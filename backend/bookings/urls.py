from django.urls import path

from .views import (
    CustomerBookingView,
    BookingDetailView,
    ProviderBookingView,
    ProviderBookingStatusView,
    CreateReviewView
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
        "<str:booking_id>/review/",
        CreateReviewView.as_view(),
        name="create-review"
),
]