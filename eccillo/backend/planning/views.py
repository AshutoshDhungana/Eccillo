from django.db.models import Sum
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from common.permissions import accessible_event as _event
from .models import BudgetLineItem, Event, EventComment, Milestone, Risk, SeatingPlan, Task
from .serializers import BudgetLineItemSerializer, EventCommentSerializer, EventListSerializer, EventSerializer, MilestoneSerializer, RiskSerializer, SeatingPlanSerializer, TaskSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def events_list(request):
    if request.method == "GET":
        return Response(EventListSerializer(Event.objects.filter(organization=request.organization).order_by("-created_at"), many=True).data)
    serializer = EventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    event = Event.objects.create(organization=request.organization, **serializer.validated_data)
    return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def event_detail(request, event_id):
    event = _event(request, event_id, write=request.method != "GET")
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    if request.method == "GET":
        return Response(EventSerializer(event).data)
    if request.method == "DELETE":
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    serializer = EventSerializer(event, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def event_by_slug(request, slug):
    event = Event.objects.filter(slug=slug, status__in=["published", "live", "completed"]).first()
    if event is None:
        return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(EventSerializer(event).data)


def collection(serializer_class, model, relationship):
    @api_view(["GET", "POST"])
    @permission_classes([IsAuthenticated])
    def view(request, event_id):
        event = _event(request, event_id, write=request.method == "POST")
        if event is None:
            return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
        if request.method == "GET":
            return Response(serializer_class(getattr(event, relationship).all(), many=True).data)
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save(event=event)
        return Response(serializer_class(item).data, status=status.HTTP_201_CREATED)
    return view


milestones = collection(MilestoneSerializer, Milestone, "milestones")
tasks = collection(TaskSerializer, Task, "tasks")
risks = collection(RiskSerializer, Risk, "risks")


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def budget(request, event_id):
    event = _event(request, event_id, write=request.method == "PUT")
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    if request.method == "PUT":
        rows = request.data.get("line_items", [])
        if not isinstance(rows, list):
            return Response({"detail": "line_items must be a list."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = BudgetLineItemSerializer(data=rows, many=True)
        serializer.is_valid(raise_exception=True)
        event.budget_items.all().delete()
        BudgetLineItem.objects.bulk_create([BudgetLineItem(event=event, **row) for row in serializer.validated_data])
    items = event.budget_items.all()
    totals = items.aggregate(planned_minor=Sum("planned_minor"), committed_minor=Sum("committed_minor"), actual_minor=Sum("actual_minor"))
    return Response({"summary": {key: value or 0 for key, value in totals.items()}, "line_items": BudgetLineItemSerializer(items, many=True).data})


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def seating(request, event_id):
    event = _event(request, event_id, write=request.method == "PUT")
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    if request.method == "PUT":
        plan, _ = SeatingPlan.objects.get_or_create(event=event)
        serializer = SeatingPlanSerializer(plan, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    plan = SeatingPlan.objects.filter(event=event).first()
    return Response(SeatingPlanSerializer(plan).data if plan else {"layout": {}, "assignments": {}})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def comments(request, event_id):
    event = _event(request, event_id, write=request.method == "POST")
    if event is None:
        return Response({"detail": "Event access denied."}, status=status.HTTP_403_FORBIDDEN)
    if request.method == "GET":
        return Response(EventCommentSerializer(event.comments.all().order_by("-created_at"), many=True).data)
    serializer = EventCommentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    comment = serializer.save(event=event, author=request.user)
    return Response(EventCommentSerializer(comment).data, status=status.HTTP_201_CREATED)


def item_detail(serializer_class, model):
    @api_view(["PATCH", "DELETE"])
    @permission_classes([IsAuthenticated])
    def view(request, event_id, item_id):
        event = _event(request, event_id, write=True)
        item = model.objects.filter(id=item_id, event=event).first() if event else None
        if item is None:
            return Response({"detail": "Planning item not found."}, status=status.HTTP_404_NOT_FOUND)
        if request.method == "DELETE":
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = serializer_class(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    return view


milestone_detail = item_detail(MilestoneSerializer, Milestone)
task_detail = item_detail(TaskSerializer, Task)
risk_detail = item_detail(RiskSerializer, Risk)
budget_line_item_detail = item_detail(BudgetLineItemSerializer, BudgetLineItem)
