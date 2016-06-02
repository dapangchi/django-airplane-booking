from __future__ import absolute_import

from django.conf import settings
from .utils import get_sign


class Flight(object):
    def __init__(
        self, id, offers=[], legs=[], status=None, first_flight_date=None, last_flight_date=None, categories=None, additional_info=None, offers_count=None,
        selected_categories=None, encoded_categories=None, baggage_id=None,
    ):
        self.id = id
        self.offers = offers
        self.legs = legs
        self.status = status
        self.first_flight_date = first_flight_date
        self.last_flight_date = last_flight_date
        self.categories = categories
        self.selected_categories = selected_categories
        self.encoded_categories = encoded_categories
        self.additional_info = additional_info
        self.offers_count = offers_count
        self.baggage_id = baggage_id

    def get_pending_offers(self):
        pending_offers = []
        for offer in self.offers:
            if offer.status == "PENDING":
                pending_offers.append(offer)
        return pending_offers

    def get_paid_offers(self):
        paid_offers = []
        for offer in self.offers:
            if offer.status == "OFFER_PAID":
                paid_offers.append(offer)
        return paid_offers

    def get_confirmed_offers(self):
        confirmed_offers = []
        for offer in self.offers:
            if offer.status == "OFFER_CONFIRMED_BY_OPERATOR":
                confirmed_offers.append(offer)
        return confirmed_offers



class Leg(object):
    def __init__(self, id, from_code=None, from_airport=None, to_code=None, to_airport=None, date=None, time=None, passengers=None):
        self.id = id
        self.from_code = from_code
        self.from_airport = from_airport
        self.to_code = to_code
        self.to_airport = to_airport
        self.date = date
        self.time = time
        self.passengers = passengers

    def __unicode__(self):
        return self.id


class Offer(object):
    """
    Offer stores both offer and order data. Offer basically becomes order once it is booked and payed.
    Offer model is not stored in database, it just a holder for data exchanged between frontend and backend.
    """

    def __init__(
        self, id, provider=None, aircraft=None, aircraft_type=None, price=None, price_cents=None, currency=None, status=None, offer_updated=None, updated_note=None,
        return_time=None, passengers=None, return_passengers=None, baggage=None, additional=None,
        tail_number=None, constructed=None, seats=None, image_url=None, operator_notice=None, aircraft_category=None, image_ids=None,
        merchant_ref_no=None, sign=None, upp_transaction_id=None, merchant_id=settings.MERCHANT_ID,
        reqtype=None, pmethod=None, response_status=None,
        offer_type=None, trip_request_id=None, notification_id=None, leg_offers=[], aircraft_id=None, operator_id=None, created_date=None, availability=None,
        availability_date=None, cost_entries=None,
    ):
        self.id = id
        self.offer_type = offer_type
        self.trip_request_id = trip_request_id
        self.notification_id = notification_id
        self.leg_offers = leg_offers
        # list view
        self.provider = provider
        self.operator_id = operator_id
        self.aircraft = aircraft
        self.aircraft_id = aircraft_id
        self.aircraft_type = aircraft_type
        self.aircraft_category = aircraft_category
        self.price = price
        self.price_cents = price_cents
        self.currency = currency
        self.status = status
        self.offer_updated = offer_updated
        self.created_date = created_date
        self.updated_note = updated_note
        self.cost_entries = cost_entries
        # details view
        self.return_time = return_time
        self.passengers = passengers
        self.return_passengers = return_passengers
        self.baggage = baggage
        self.additional = additional
        self.availability = availability
        self.availability_date = availability_date
        # aircraft details
        self.tail_number = tail_number
        self.constructed = constructed
        self.seats = seats
        self.image_url = image_url
        self.operator_notice = operator_notice
        self.image_ids = image_ids
        # payment gateway request
        self.merchant_ref_no = merchant_ref_no
        self.sign = get_sign(price_cents, currency, merchant_ref_no)
        self.upp_transaction_id = upp_transaction_id
        self.merchant_id = merchant_id
        # payment gateway response
        self.reqtype = reqtype
        self.pmethod = pmethod
        self.response_status = response_status

    def __unicode__(self):
        return self.merchant_ref_no

    def set_sign(self):
        self.sign = get_sign(self.price_cents, self.currency, self.merchant_ref_no)


class LegOffer(object):
    def __init__(
        self, id, request_leg_id=None, departure_date=None, departure_time=None, from_code=None, to_code=None, from_airport=None, to_airport=None,
        pax=None, proposed_departure_time_hrs=None, proposed_departure_time_min=None, flight_time_hrs=None, flight_time_min=None, time_shift=None,
    ):
        self.id = id
        self.request_leg_id = request_leg_id
        self.departure_date = departure_date
        self.departure_time = departure_time
        self.from_code = from_code
        self.to_code = to_code
        self.from_airport = from_airport
        self.to_airport = to_airport
        self.pax = pax
        self.proposed_departure_time_hrs = proposed_departure_time_hrs
        self.proposed_departure_time_min = proposed_departure_time_min
        self.flight_time_hrs = flight_time_hrs
        self.flight_time_min = flight_time_min
        self.time_shift = time_shift

    def __unicode__(self):
        return self.id
