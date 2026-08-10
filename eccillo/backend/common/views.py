from django.utils import timezone
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ApprovalChain,ApprovalStep,Notification
from .serializers import ApprovalChainSerializer,NotificationSerializer
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_approval(request):
    chain=ApprovalChain.objects.create(organization=request.organization,resource_type=request.data["resource_type"],resource_id=request.data["resource_id"])
    for index,membership_id in enumerate(request.data.get("approver_membership_ids",[])):ApprovalStep.objects.create(chain=chain,approver_id=membership_id,sequence=index+1)
    return Response(ApprovalChainSerializer(chain).data,status=201)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def decide_approval(request,chain_id):
    chain=ApprovalChain.objects.get(id=chain_id,organization=request.organization);step=chain.steps.get(approver=request.membership,decision="pending")
    if step.sequence != min(chain.steps.filter(decision="pending").values_list("sequence",flat=True)):return Response({"detail":"Earlier approval is pending."},status=422)
    step.decision=request.data["decision"];step.comment=request.data.get("comment","");step.decided_at=timezone.now();step.save();chain.status="rejected" if step.decision=="rejected" else ("approved" if not chain.steps.filter(decision="pending").exists() else "pending");chain.save(update_fields=["status","updated_at"]);return Response(ApprovalChainSerializer(chain).data)
@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def notifications(request):
    if request.method=="GET":return Response(NotificationSerializer(Notification.objects.filter(recipient=request.user,organization=request.organization),many=True).data)
    if request.membership.role not in ["owner","admin","manager"]:return Response({"detail":"Manager role required."},status=403)
    s=NotificationSerializer(data=request.data);s.is_valid(raise_exception=True);n=s.save(organization=request.organization,status="sent");return Response(NotificationSerializer(n).data,status=201)
