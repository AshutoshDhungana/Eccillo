import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=20,
        choices=[
            ("organizer", "Organizer"),
            ("vendor", "Vendor"),
            ("sponsor", "Sponsor"),
            ("talent_agency", "Talent Agency"),
            ("platform", "Platform"),
        ],
        default="organizer",
    )
    country = models.CharField(max_length=3, default="NPL")
    default_currency = models.CharField(max_length=3, default="NPR")
    kyb_status = models.CharField(
        max_length=20,
        choices=[("unverified", "Unverified"), ("pending", "Pending"), ("verified", "Verified"), ("rejected", "Rejected")],
        default="unverified",
    )
    settings = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20, blank=True)
    locale = models.CharField(max_length=10, default="en")
    timezone = models.CharField(max_length=50, default="Asia/Kathmandu")

    def __str__(self):
        return self.email or self.username


class Membership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(
        max_length=20,
        choices=[
            ("owner", "Owner"), ("admin", "Admin"), ("manager", "Manager"),
            ("member", "Member"), ("finance", "Finance"), ("viewer", "Viewer"),
        ],
        default="member",
    )
    status = models.CharField(
        max_length=20,
        choices=[("invited", "Invited"), ("active", "Active"), ("suspended", "Suspended")],
        default="active",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "organization")

    def __str__(self):
        return f"{self.user} @ {self.organization} ({self.role})"


class PermissionGrant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name="permission_grants")
    resource_type = models.CharField(max_length=80)
    resource_id = models.UUIDField()
    capability = models.CharField(max_length=20, choices=[("read", "Read"), ("write", "Write"), ("approve", "Approve"), ("sign", "Sign")])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["membership", "resource_type", "resource_id", "capability"], name="unique_permission_grant")]
