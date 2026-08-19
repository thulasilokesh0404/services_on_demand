from django.urls import (path, include)
from rest_framework.routers import (DefaultRouter)
from .views import (ServiceViewSet, ProviderViewSet)

router = DefaultRouter()
router.register("list", ServiceViewSet, basename="service")
router.register("providers", ProviderViewSet, basename="provider")

urlpatterns = [path("", include(router.urls))]