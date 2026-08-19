from rest_framework import (viewsets, permissions, filters)
from django_filters.rest_framework import (DjangoFilterBackend)
from .models import (Service, ProviderProfile)
from .serializers import (ServiceSerializer, ProviderSerializer)

class IsAdminOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        
        return (
            request.user.is_authenticated
            and
            request.user.role == "admin"
        )


class ServiceViewSet(viewsets.ModelViewSet):

    queryset = Service.objects.filter(
        is_active=True
    ).order_by(
        "-created_at"
    )

    serializer_class = ServiceSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "category"
    ]

    search_fields = [
        "name",
        "category",
        "description",
    ]

    ordering_fields = [
        "price",
        "rating",
        "reviews",
        "created_at",
    ]


class ProviderViewSet(viewsets.ModelViewSet):

    queryset = (
        ProviderProfile.objects
        .filter(is_available=True)
        .select_related("user")
    )

    serializer_class = ProviderSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "user__name",
        "profession",
    ]

    ordering_fields = [
        "rating",
        "jobs_done",
    ]