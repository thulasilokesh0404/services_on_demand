from django.urls import path

from .views import (
    CustomerBookingView,
    BookingDetailView,
    ProviderBookingView,
    ProviderBookingStatusView,
    AdminBookingView,
    AdminStatsView,
)


urlpatterns = [

    path(
        "",
        CustomerBookingView.as_view(),
        name="bookings"
    ),

    path(
        "<str:pk>/",
        BookingDetailView.as_view(),
        name="booking-detail"
    ),

    path(
        "provider/",
        ProviderBookingView.as_view(),
        name="provider-bookings"
    ),

    path(
        "provider/<str:pk>/status/",
        ProviderBookingStatusView.as_view(),
        name="provider-status"
    ),

    path(
        "admin/",
        AdminBookingView.as_view(),
        name="admin-bookings"
    ),

    path(
        "admin/stats/",
        AdminStatsView.as_view(),
        name="admin-stats"
    ),

]