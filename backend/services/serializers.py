from rest_framework import serializers

from .models import (
    Service,
    ProviderProfile
)


class ProviderSerializer(
    serializers.ModelSerializer
):

    name = serializers.CharField(
        source="user.name",
        read_only=True
    )

    class Meta:

        model = ProviderProfile

        fields = [
            "id",
            "user",
            "name",
            "services",
            "profession",
            "rating",
            "reviews",
            "jobs_done",
            "bio",
            "image",
            "is_available",
        ]

        read_only_fields = [
            "id",
            "name",
            "rating",
            "reviews",
            "jobs_done",
        ]


class ServiceProviderSerializer(
    serializers.ModelSerializer
):

    name = serializers.CharField(
        source="user.name",
        read_only=True
    )

    class Meta:

        model = ProviderProfile

        fields = [
            "id",
            "name",
            "profession",
            "rating",
            "reviews",
            "jobs_done",
            "is_available",
        ]


class ServiceSerializer(
    serializers.ModelSerializer
):

    providers = ServiceProviderSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Service

        fields = [
            "id",
            "name",
            "category",
            "price",
            "rating",
            "reviews",
            "description",
            "image",
            "duration_minutes",
            "is_active",
            "created_at",
            "providers",
        ]