from django.contrib import admin

from .models import (
    Service,
    ProviderProfile,
)


@admin.register(Service)
class ServiceAdmin(
    admin.ModelAdmin
):

    list_display = [

        "id",
        "name",
        "category",
        "price",
        "rating",
        "reviews",
        "is_active",

    ]


    list_filter = [

        "category",
        "is_active",

    ]


    search_fields = [

        "name",
        "category",

    ]


@admin.register(ProviderProfile)
class ProviderProfileAdmin(
    admin.ModelAdmin
):

    list_display = [

        "id",
        "user",
        "profession",
        "rating",
        "jobs_done",
        "is_available",

    ]


    list_filter = [

        "profession",
        "is_available",

    ]


    search_fields = [

        "user__name",
        "user__email",
        "profession",

    ]