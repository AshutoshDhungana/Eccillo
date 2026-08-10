from rest_framework import serializers
from .models import ApprovalChain, ApprovalStep, Notification
class ApprovalStepSerializer(serializers.ModelSerializer):
    class Meta: model=ApprovalStep; fields="__all__"; read_only_fields=["id","chain","created_at","updated_at"]
class ApprovalChainSerializer(serializers.ModelSerializer):
    steps=ApprovalStepSerializer(many=True,read_only=True)
    class Meta: model=ApprovalChain; fields="__all__"; read_only_fields=["id","organization","status","created_at","updated_at"]
class NotificationSerializer(serializers.ModelSerializer):
    class Meta: model=Notification; fields="__all__"; read_only_fields=["id","organization","status","created_at","updated_at"]
