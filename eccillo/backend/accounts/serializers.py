from rest_framework import serializers
from .models import User, Organization, Membership


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "type", "country", "default_currency", "kyb_status"]
        read_only_fields = ["id", "kyb_status"]


class MembershipSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ["id", "organization", "role", "status"]


class UserSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "first_name", "last_name", "phone", "locale", "timezone", "memberships"]
        read_only_fields = ["id", "memberships"]


class RegisterSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(write_only=True)
    organization_type = serializers.ChoiceField(choices=["organizer", "vendor", "sponsor", "talent_agency"], default="organizer", write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "organization_name", "organization_type"]

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email already exists. Sign in instead.")
        return email

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is already in use. Try a different email address.")
        return value

    def create(self, validated_data):
        org_name = validated_data.pop("organization_name")
        org_type = validated_data.pop("organization_type")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        org = Organization.objects.create(name=org_name, type=org_type)
        Membership.objects.create(user=user, organization=org, role="owner")
        return user
