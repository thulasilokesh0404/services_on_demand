from decimal import Decimal

import random

from django.db import transaction

from django.utils import timezone

from rest_framework import (
    permissions,
    status,
)

from rest_framework.response import Response

from rest_framework.views import APIView

from rest_framework.generics import (
    RetrieveAPIView,
    ListAPIView,
)

from services.models import (
    Service,
    ProviderProfile,
)

from .models import Booking

from .serializers import (
    BookingSerializer,
    BookingCreateSerializer,
)


class CustomerBookingView(
    APIView
):

    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get(
        self,
        request
    ):

        bookings = (
            Booking.objects
            .filter(
                customer=request.user
            )
            .select_related(
                "service",
                "provider__user"
            )
        )


        serializer = BookingSerializer(
            bookings,
            many=True
        )


        return Response(
            serializer.data
        )


    @transaction.atomic
    def post(
        self,
        request
    ):

        if request.user.role != "customer":

            return Response(
                {
                    "detail":
                    "Only customers can create bookings."
                },
                status=403
            )


        serializer = BookingCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )


        data = serializer.validated_data


        try:

            service = Service.objects.get(
                id=data["service_id"],
                is_active=True
            )

        except Service.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Service not found."
                },
                status=404
            )


        provider = None


        if data.get("provider_id"):

            try:

                provider = ProviderProfile.objects.get(
                    user_id=data["provider_id"],
                    is_available=True
                )

            except ProviderProfile.DoesNotExist:

                return Response(
                    {
                        "detail":
                        "Provider not found."
                    },
                    status=404
                )


        else:

            provider = (
                ProviderProfile.objects
                .filter(
                    profession__iexact=
                    service.category,
                    is_available=True
                )
                .order_by("-rating")
                .first()
            )


        address = data["address"]


        required_fields = [

            "name",
            "phone",
            "line1",
            "city",
            "pincode",

        ]


        for field in required_fields:

            if not address.get(field):

                return Response(
                    {
                        "detail":
                        f"{field} is required."
                    },
                    status=400
                )


        price = Decimal(
            str(service.price)
        )


        service_fee = Decimal(
            "50.00"
        )


        total = (
            price +
            service_fee
        )


        # Wallet payment

        if data["payment_method"] == "wallet":

            if request.user.balance < total:

                return Response(
                    {
                        "detail":
                        "Insufficient wallet balance."
                    },
                    status=400
                )


            request.user.balance -= total

            request.user.save(
                update_fields=[
                    "balance"
                ]
            )


        booking = Booking.objects.create(

            id=self.generate_booking_id(),

            customer=request.user,

            service=service,

            provider=provider,

            date=data["date"],

            time=data["time"],

            address_name=
                address["name"],

            phone=
                address["phone"],

            address_line=
                address["line1"],

            city=
                address["city"],

            pincode=
                address["pincode"],

            price=price,

            service_fee=service_fee,

            total=total,

            payment_method=
                data["payment_method"],

            status="Confirmed",

        )


        return Response(
            BookingSerializer(
                booking
            ).data,
            status=status.HTTP_201_CREATED
        )


    @staticmethod
    def generate_booking_id():

        while True:

            booking_id = (
                "SH" +
                str(
                    random.randint(
                        10000,
                        99999
                    )
                )
            )


            if not Booking.objects.filter(
                id=booking_id
            ).exists():

                return booking_id


class BookingDetailView(
    RetrieveAPIView
):

    serializer_class = BookingSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get_queryset(
        self
    ):

        user = self.request.user


        if user.role == "admin":

            return Booking.objects.all()


        if user.role == "provider":

            return Booking.objects.filter(
                provider__user=user
            )


        return Booking.objects.filter(
            customer=user
        )


class ProviderBookingView(
    ListAPIView
):

    serializer_class = BookingSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get_queryset(
        self
    ):

        if self.request.user.role != "provider":

            return Booking.objects.none()


        return (
            Booking.objects
            .filter(
                provider__user=self.request.user
            )
            .select_related(
                "service",
                "customer",
                "provider__user"
            )
        )


class ProviderBookingStatusView(
    APIView
):

    permission_classes = [
        permissions.IsAuthenticated
    ]


    @transaction.atomic
    def patch(
        self,
        request,
        pk
    ):

        if request.user.role != "provider":

            return Response(
                {
                    "detail":
                    "Provider access required."
                },
                status=403
            )


        try:

            booking = Booking.objects.select_related(
                "service",
                "customer",
                "provider__user"
            ).get(
                pk=pk,
                provider__user=request.user
            )

        except Booking.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Booking not found."
                },
                status=404
            )


        new_status = request.data.get(
            "status"
        )


        if new_status not in [
            "Completed",
            "Cancelled",
        ]:

            return Response(
                {
                    "detail":
                    "Status must be Completed or Cancelled."
                },
                status=400
            )


        if new_status == "Completed":

            if booking.status != "Completed":

                if booking.payment_method == "cash":

                    request.user.balance += booking.price

                    request.user.save(
                        update_fields=[
                            "balance"
                        ]
                    )


                if booking.provider:

                    booking.provider.jobs_done += 1

                    booking.provider.save(
                        update_fields=[
                            "jobs_done"
                        ]
                    )


                booking.completed_at = (
                    timezone.now()
                )


        booking.status = new_status

        booking.save()


        return Response(
            BookingSerializer(
                booking
            ).data
        )


class AdminBookingView(
    ListAPIView
):

    serializer_class = BookingSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get_queryset(
        self
    ):

        if self.request.user.role != "admin":

            return Booking.objects.none()


        return Booking.objects.all()


class AdminStatsView(
    APIView
):

    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get(
        self,
        request
    ):

        if request.user.role != "admin":

            return Response(
                {
                    "detail":
                    "Admin access required."
                },
                status=403
            )


        from users.models import User


        bookings = Booking.objects.all()


        revenue = sum(
            (
                booking.service_fee
                for booking in bookings
            ),
            Decimal("0.00")
        )


        return Response({

            "users":
                User.objects.filter(
                    role="customer"
                ).count(),

            "providers":
                User.objects.filter(
                    role="provider"
                ).count(),

            "bookings":
                bookings.count(),

            "revenue":
                revenue,

        })