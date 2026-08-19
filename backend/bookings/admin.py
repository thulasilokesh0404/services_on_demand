from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(
    admin.ModelAdmin
):

    list_display = [

        "id",
        "customer",
        "service",
        "provider",
        "date",
        "time",
        "total",
        "payment_method",
        "status",
        "created_at",

    ]


    list_filter = [

        "status",
        "payment_method",
        "date",

    ]


    search_fields = [

        "id",
        "customer__name",
        "customer__email",
        "service__name",

    ]


    readonly_fields = [

        "created_at",
        "completed_at",

    ]