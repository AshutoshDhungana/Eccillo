from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Organization, Membership, PermissionGrant, User
from .serializers import UserSerializer, OrganizationSerializer, RegisterSerializer
from common.auth import encode_token, decode_token


def _tokens(user, membership):
    claims = {"sub": str(user.id), "membership_id": str(membership.id), "organization_id": str(membership.organization_id), "role": membership.role}
    return {"access_token": encode_token(dict(claims, type="access"), 3600), "refresh_token": encode_token(dict(claims, type="refresh"), 60 * 60 * 24 * 30), "expires_in": 3600}


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    identifier = str(request.data.get("email") or request.data.get("username") or "").strip()
    password = request.data.get("password")
    # The browser sign-in form uses an email address. Django's default backend
    # authenticates the username field, so resolve a matching email first and
    # then pass its username to the backend for password verification.
    account = User.objects.filter(email__iexact=identifier).first()
    user = authenticate(request, username=account.username if account else identifier, password=password)
    if not user:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    membership = user.memberships.filter(status="active").order_by("created_at").first()
    if not membership:
        return Response({"detail": "User has no active organization."}, status=status.HTTP_403_FORBIDDEN)
    return Response({**_tokens(user, membership), "user": UserSerializer(user).data})


@api_view(["POST"])
def logout_view(request):
    return Response({"detail": "Logged out."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_organization(request):
    serializer = OrganizationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    org = serializer.save()
    if request.user.is_authenticated:
        Membership.objects.create(user=request.user, organization=org, role="owner", status="active")
    return Response(OrganizationSerializer(org).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    with transaction.atomic():
        user = serializer.save()
        membership = user.memberships.get()
    return Response({**_tokens(user, membership), "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh(request):
    claims = decode_token(request.data.get("refresh_token", ""))
    if claims.get("type") != "refresh":
        return Response({"detail": "Refresh token required."}, status=status.HTTP_401_UNAUTHORIZED)
    membership = Membership.objects.get(id=claims["membership_id"], status="active")
    return Response(_tokens(membership.user, membership))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def switch_organization(request):
    membership = request.user.memberships.get(id=request.data.get("membership_id"), status="active")
    return Response(_tokens(request.user, membership))


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def organization_members(request, organization_id):
    if str(request.organization.id) != str(organization_id):
        return Response({"detail": "Organization not selected."}, status=status.HTTP_403_FORBIDDEN)
    if request.method == "GET":
        return Response([{"id": str(m.id), "user_id": str(m.user_id), "role": m.role, "status": m.status} for m in Membership.objects.filter(organization_id=organization_id)])
    if request.membership.role not in ["owner", "admin"]:
        return Response({"detail": "Admin role required."}, status=status.HTTP_403_FORBIDDEN)
    grant = PermissionGrant.objects.create(membership_id=request.data["membership_id"], resource_type=request.data["resource_type"], resource_id=request.data["resource_id"], capability=request.data["capability"])
    return Response({"id": str(grant.id)}, status=status.HTTP_201_CREATED)
