from rest_framework.permissions import BasePermission


class IsOrgMember(BasePermission):
    """User must be an active member of the organization owning the resource."""

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        org_id = getattr(obj, "organization_id", None)
        if org_id is None:
            event = getattr(obj, "event", None)
            org_id = getattr(event, "organization_id", None) if event else None
        if org_id is None:
            return False
        return request.user.memberships.filter(
            organization_id=org_id, status="active"
        ).exists()


class IsOrgAdmin(IsOrgMember):
    """User must be owner or admin of the organization."""

    def has_object_permission(self, request, view, obj):
        if not super().has_object_permission(request, view, obj):
            return False
        org_id = getattr(obj, "organization_id", None)
        return request.user.memberships.filter(
            organization_id=org_id, role__in=["owner", "admin"], status="active"
        ).exists()


def require_event_access(request, event, capability="read"):
    if not request.user.is_authenticated or event.organization_id != getattr(request, "organization", None).id:
        return False
    role = request.membership.role
    if capability == "read":
        return True
    if role in ["owner", "admin", "manager"]:
        return True
    return request.membership.permission_grants.filter(resource_type="event", resource_id=event.id, capability=capability).exists()


def accessible_event(request, event_id, write=False):
    """Load an event the caller may touch, or ``None``.

    Every event-scoped view needs exactly this; it lived as a private copy in
    each app's views module.  Callers turn ``None`` into their own 403.
    """
    from planning.models import Event

    event = Event.objects.filter(id=event_id).first()
    if event is None or not require_event_access(request, event, "write" if write else "read"):
        return None
    return event
