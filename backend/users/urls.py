from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    MeView,
    BalanceView,
    ForgotPasswordView,
    ResetPasswordView,

)


urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout"
    ),

    path(
        "me/",
        MeView.as_view(),
        name="me"
    ),

    path(
        "balance/",
        BalanceView.as_view(),
        name="balance"
    ),

    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password"
    ),

    path(
        "reset-password/<uid>/<token>/",
        ResetPasswordView.as_view(),
        name="reset-password"
    ),

]