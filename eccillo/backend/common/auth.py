"""Small dependency-free JWT implementation for the API's HMAC access tokens."""
import base64
import hashlib
import hmac
import json
import time
from django.conf import settings
from rest_framework import authentication, exceptions


def _b64(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode()


def _unb64(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def encode_token(payload: dict, expires_in: int) -> str:
    header = _b64(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    body = dict(payload, exp=int(time.time()) + expires_in, iat=int(time.time()))
    encoded = _b64(json.dumps(body, separators=(",", ":"), default=str).encode())
    signature = _b64(hmac.new(settings.SECRET_KEY.encode(), f"{header}.{encoded}".encode(), hashlib.sha256).digest())
    return f"{header}.{encoded}.{signature}"


def decode_token(token: str) -> dict:
    try:
        header, payload, signature = token.split(".")
        expected = _b64(hmac.new(settings.SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(expected, signature):
            raise ValueError("signature")
        data = json.loads(_unb64(payload))
        if int(data["exp"]) < time.time():
            raise ValueError("expired")
        return data
    except Exception as exc:
        raise exceptions.AuthenticationFailed("Invalid or expired token.") from exc


class EccilloJWTAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate_header(self, request):
        """Advertise the JWT scheme so unauthenticated API calls return 401."""

        return self.keyword

    def authenticate(self, request):
        value = authentication.get_authorization_header(request).decode()
        if not value:
            return None
        try:
            scheme, token = value.split(" ", 1)
        except ValueError as exc:
            raise exceptions.AuthenticationFailed("Invalid authorization header.") from exc
        if scheme != self.keyword:
            return None
        data = decode_token(token)
        if data.get("type") != "access":
            raise exceptions.AuthenticationFailed("Access token required.")
        from accounts.models import User, Membership
        try:
            user = User.objects.get(id=data["sub"], is_active=True)
            membership = Membership.objects.get(id=data["membership_id"], user=user, status="active")
        except (User.DoesNotExist, Membership.DoesNotExist) as exc:
            raise exceptions.AuthenticationFailed("Token membership is no longer active.") from exc
        request.organization = membership.organization
        request.membership = membership
        return user, data
