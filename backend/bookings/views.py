from decimal import Decimal
import random

from django.db import transaction
from django.utils import timezone

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, ListAPIView

from services.models import (
    Service,
    ProviderProfile,
)

from .models import Booking, Review

from .serializers import (
    BookingSerializer,
    BookingCreateSerializer,
    ReviewSerializer,
)


class CustomerBookingView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):

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
    def post(self, request):

        # Only customers can create bookings
        if request.user.role != "customer":

            return Response(
                {
                    "detail":
                    "Only customers can create bookings."
                },
                status=status.HTTP_403_FORBIDDEN
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
                status=status.HTTP_404_NOT_FOUND
            )

       
        provider = None

        if data.get("provider_id"):

            try:

                provider = (
                    ProviderProfile.objects
                    .filter(
                        id=data["provider_id"],
                        services=service,
                        is_available=True
                    )
                    .select_related("user")
                    .first()
                )

            except Exception:

                provider = None

            if not provider:

                return Response(
                    {
                        "detail":
                        "Provider not found, unavailable, "
                        "or does not provide this service."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

        else:

    
            provider = (
                ProviderProfile.objects
                .filter(
                    services=service,
                    is_available=True
                )
                .select_related("user")
                .order_by("-rating")
                .first()
            )

            if not provider:

                return Response(
                    {
                        "detail":
                        "No provider is currently available "
                        "for this service."
                    },
                    status=status.HTTP_404_NOT_FOUND
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
                    status=status.HTTP_400_BAD_REQUEST
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
        
        duplicate = Booking.objects.filter(
            customer=request.user,
            service=service,
            provider=provider,
            date=data["date"],
            time=data["time"]
        ).exclude(
            status="Cancelled"
        ).exists()


        if duplicate:

            return Response(
                {
                    "detail":
                    "You have already booked this service "
                    "for the selected date and time."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

      
        if data["payment_method"] == "wallet":

            if request.user.balance < total:

                return Response(
                    {
                        "detail":
                        "Insufficient wallet balance."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            request.user.balance -= total

            request.user.save(
                update_fields=[
                    "balance"
                ]
            )

        # --------------------------------
        # Create Booking
        # --------------------------------

        booking = Booking.objects.create(

            id=self.generate_booking_id(),

            customer=request.user,

            service=service,

            provider=provider,

            date=data["date"],

            time=data["time"],

            address_name=address["name"],

            phone=address["phone"],

            address_line=address["line1"],

            city=address["city"],

            pincode=address["pincode"],

            price=price,

            service_fee=service_fee,

            total=total,

            payment_method=data["payment_method"],

            # IMPORTANT:
            # Admin will confirm from Django Admin
            status="Pending",
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


# ==================================================
# BOOKING DETAIL
# ==================================================

class BookingDetailView(
    RetrieveAPIView
):

    serializer_class = BookingSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        # Admin can view all bookings
        if user.role == "admin":

            return Booking.objects.all()

        # Provider can view their bookings
        if user.role == "provider":

            return (
                Booking.objects
                .filter(
                    provider__user=user
                )
                .select_related(
                    "service",
                    "customer",
                    "provider__user"
                )
            )

        # Customer can view their bookings
        return (
            Booking.objects
            .filter(
                customer=user
            )
            .select_related(
                "service",
                "provider__user"
            )
        )


# ==================================================
# PROVIDER BOOKINGS
# ==================================================

class ProviderBookingView(
    ListAPIView
):

    serializer_class = BookingSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

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


# ==================================================
# PROVIDER BOOKING STATUS
# ==================================================

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

        # Only providers
        if request.user.role != "provider":

            return Response(
                {
                    "detail":
                    "Provider access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Get only bookings assigned to this provider
        try:

            booking = (
                Booking.objects
                .select_related(
                    "service",
                    "customer",
                    "provider__user"
                )
                .get(
                    pk=pk,
                    provider__user=request.user
                )
            )

        except Booking.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Booking not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # --------------------------------
        # IMPORTANT
        # Admin must confirm first
        # --------------------------------

        if booking.status != "Confirmed":

            return Response(
                {
                    "detail":
                    "Booking must be confirmed by admin first."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        new_status = request.data.get(
            "status"
        )

        # Provider can only complete or cancel
        if new_status not in [
            "Completed",
            "Cancelled",
        ]:

            return Response(
                {
                    "detail":
                    "Status must be Completed or Cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # --------------------------------
        # Completed
        # --------------------------------

        if new_status == "Completed":

            if booking.status == "Completed":

                return Response(
                    {
                        "detail":
                        "Booking is already completed."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Pay provider for cash bookings
            if booking.payment_method == "cash":

                request.user.balance += booking.price

                request.user.save(
                    update_fields=[
                        "balance"
                    ]
                )

            # Increase completed jobs
            if booking.provider:

                booking.provider.jobs_done += 1

                booking.provider.save(
                    update_fields=[
                        "jobs_done"
                    ]
                )

            booking.completed_at = timezone.now()

        booking.status = new_status

        booking.save()

        return Response(
            BookingSerializer(
                booking
            ).data
        )
        
class CreateReviewView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    @transaction.atomic
    def post(self, request, booking_id):

        if request.user.role != "customer":

            return Response(
                {
                    "detail":
                    "Only customers can give reviews."
                },
                status=403
            )

        try:

            booking = Booking.objects.select_related(
                "provider",
                "service"
            ).get(
                id=booking_id,
                customer=request.user
            )

        except Booking.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Booking not found."
                },
                status=404
            )

        if booking.status != "Completed":

            return Response(
                {
                    "detail":
                    "You can review only completed bookings."
                },
                status=400
            )

        if not booking.provider:

            return Response(
                {
                    "detail":
                    "This booking has no provider."
                },
                status=400
            )

        if Review.objects.filter(
            booking=booking
        ).exists():

            return Response(
                {
                    "detail":
                    "You have already reviewed this booking."
                },
                status=400
            )

        serializer = ReviewSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        review = serializer.save(
            booking=booking,
            customer=request.user,
            provider=booking.provider,
            service=booking.service
        )
        provider = booking.provider

        total_reviews = Review.objects.filter(
            provider=provider
        )

        total_rating = sum(
            review.rating
            for review in total_reviews
        )

        count = total_reviews.count()

        provider.rating = (
            Decimal(total_rating) /
            Decimal(count)
        )

        provider.reviews = count

        provider.save(
            update_fields=[
                "rating",
                "reviews"
            ]
        )

        service = booking.service

        service_reviews = Review.objects.filter(
            service=service
        )

        service_total = sum(
            review.rating
            for review in service_reviews
        )

        service_count = service_reviews.count()

        service.rating = (
            Decimal(service_total) /
            Decimal(service_count)
        )

        service.reviews = service_count

        service.save(
            update_fields=[
                "rating",
                "reviews"
            ]
        )

        return Response(
            ReviewSerializer(
                review
            ).data,
            status=201
        )