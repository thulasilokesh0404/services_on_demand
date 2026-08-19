from django.contrib import admin

from django.contrib.auth.admin import (
    UserAdmin
)

from .models import User


@admin.register(User)
class CustomUserAdmin(
    UserAdmin
):

    model = User


    list_display = [

        "id",
        "email",
        "name",
        "role",
        "balance",
        "is_active",
        "is_staff",

    ]


    list_filter = [

        "role",
        "is_active",
        "is_staff",

    ]


    search_fields = [

        "email",
        "name",

    ]


    ordering = [
        "-date_joined"
    ]


    fieldsets = (

        (
            None,
            {
                "fields": (
                    "email",
                    "password",
                )
            }
        ),

        (
            "Personal Information",
            {
                "fields": (
                    "name",
                    "phone",
                    "role",
                    "balance",
                )
            }
        ),

        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            }
        ),

        (
            "Important Dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            }
        ),

    )


    add_fieldsets = (

        (
            None,
            {
                "classes": (
                    "wide",
                ),

                "fields": (
                    "email",
                    "name",
                    "password1",
                    "password2",
                    "role",
                    "is_active",
                    "is_staff",
                ),
            }
        ),

    )