from __future__ import absolute_import
import logging
import requests
import json

from .models import Offer, Flight, Leg, LegOffer

logger = logging.getLogger('ascent_jet.custom')


# helper method used for authentication which returns cookie
def authenticate():
    url = 'http://ascentjet.com/rest/security/'
    body = '{"userName":"verteuil@bluewin.ch", "password":"111111"}'
    headers = {'Content-Type': 'application/json'}
    r = requests.put(url=url, data=body, headers=headers)
    print "status: ", r.status_code

    return r.cookies


# based on dictionary containing flight details (f), parse only basic flight data, create and return Flight object
def parse_flight_list(f):
    flight = Flight(f.get('id'))

    # legs
    legs = []
    if f.get('legs', None):
        for l in f.get('legs'):
            leg = Leg(l.get('id'))
            fromAirportObject = l.get('fromAirportObj', None)
            if fromAirportObject:
                leg.from_airport = fromAirportObject.get('city', None)
                leg.from_code = fromAirportObject.get('iataCode', None)
            toAirportObject = l.get('toAirportObj', None)
            if toAirportObject:
                leg.to_airport = toAirportObject.get('city', None)
                leg.to_code = toAirportObject.get('iataCode', None)
            leg.date = l.get('date')
            leg.time = l.get('time')
            legs.append(leg)
    flight.legs = legs
    flight.status = f.get('status', None)

    return flight

# get the aircraft images from ascentJet
def aircraft_images(path, cookies):
    aircraft_img_url = 'http://ascentjet.com/rest/aircraft/images/' + str(path)
    try:
        response = requests.get(url=aircraft_img_url, cookies=cookies)
        f = json.loads(response.text)
        return f
    except Exception as e:
        logger.info("get_aircraft_image, Exception: %s" % e)
        return None

# based on dictionary containing flight details (f), parse flight details, create and return Flight object
def parse_flight(f):
    flight = Flight(f.get('id'))
    flight.status = f.get('status', None)
    flight.first_flight_date = f.get('firstFlightDate', None)
    flight.last_flight_date = f.get('lastFlightDate', None)
    flight.status = f.get('status', None)
    flight.categories = f.get('categories', None)
    flight.selected_categories = f.get('selectedCategories', None)
    flight.encoded_categories = f.get('encodedCategories', None)
    flight.additional_info = f.get('additionalInfo', None)
    flight.offers_count = f.get('offersCount', None)
    flight.baggage = f.get('baggageDescription', None)

    # legs
    legs = []
    if f.get('legs', None):
        for l in f.get('legs'):
            leg = Leg(l.get('id'))
            fromAirportObject = l.get('fromAirportObj', None)
            if fromAirportObject:
                leg.from_airport = fromAirportObject.get('city', None)
                leg.from_code = fromAirportObject.get('iataCode', None)
            toAirportObject = l.get('toAirportObj', None)
            if toAirportObject:
                leg.to_airport = toAirportObject.get('city', None)
                leg.to_code = toAirportObject.get('iataCode', None)
            leg.date = l.get('date', None)
            leg.time = l.get('time', None)
            leg.passengers = l.get('passengers', None)
            legs.append(leg)
    flight.legs = legs

    # offers
    offers = []
    if f.get('offers', None):
        for o in f.get('offers'):
            # print "parse offer with id: ", o.get('id')
            offer = Offer(o.get('id'))
            print "created new offer... %s " % offer
            offer.offer_type = o.get('offerType', None)
            offer.trip_request_id = o.get('tripRequestId', None)
            offer.notification_id = o.get('notificationId', None)
            offer.aircraft_id = o.get('aircraftId', None)
            offer.aircraft = o.get('aircraft', None)
            if offer.aircraft:
                offer.aircraft_type = offer.aircraft.get('type', None)
                offer.aircraft_category = offer.aircraft.get('category', None)
                offer.tail_number = offer.aircraft.get('tailNum', None)
                offer.constructed = offer.aircraft.get('year', None)
                offer.seats = offer.aircraft.get('seats', None)
                offer.image_ids = offer.aircraft.get('imageIds', None)
            price_float = float(o.get('price').replace(',', ''))
            offer.price_cents = int(price_float * 100)
            offer.price = "{:,.0f}".format(price_float)
            offer.currency = o.get('currency', None)
            offer.status = o.get('status', None)
            offer.operator_id = o.get('operatorId', None)
            offer.provider = o.get('provider', None)
            offer.offer_updated = o.get('offerUpdated', None)
            offer.created_date = o.get('createdDate', None)
            offer.merchant_ref_no = o.get('id', None)
            offer.operator_notice = o.get('operatorNotice', None)
            offer.availability = o.get('availability', None)
            offer.availability_date = o.get('availabilityDate', None)
            offer.cost_entries = o.get('costEntries', None)
            offer.set_sign()

            # leg offers
            leg_offers = []
            if o.get('legOffers', None):
                for lo in o.get('legOffers'):
                    # print "parse leg offer with id: ", lo.get('id')
                    leg_offer = LegOffer(lo.get('id'))
                    leg_offer.request_leg_id = lo.get('requestLegId', None)
                    leg_offer.departure_date = lo.get('departureDate', None)
                    leg_offer.departure_time = lo.get('departureTime', None)
                    leg_offer.from_code = lo.get('fromCode', None)
                    leg_offer.to_code = lo.get('toCode', None)

                    fromAirportObject = lo.get('fromAirportObj', None)
                    if fromAirportObject:
                        leg_offer.from_airport = fromAirportObject.get('city', None)
                        leg_offer.from_code = fromAirportObject.get('iataCode', None)
                    toAirportObject = lo.get('toAirportObj', None)
                    if toAirportObject:
                        leg_offer.to_airport = toAirportObject.get('city', None)
                        leg_offer.to_code = toAirportObject.get('iataCode', None)

                    leg_offer.pax = lo.get('pax', None)
                    leg_offer.proposed_departure_time_hrs = lo.get('proposedDepartureTimeHrs', None)
                    leg_offer.proposed_departure_time_min = lo.get('proposedDepartureTimeMin', None)
                    leg_offer.flight_time_hrs = lo.get('flightTimeHrs', None)
                    leg_offer.flight_time_min = lo.get('flightTimeMin', None)
                    leg_offer.time_shift = lo.get('timeShift', None)
                    leg_offers.append(leg_offer)
            print "leg offers: ", leg_offers
            offer.leg_offers = leg_offers
            offers.append(offer)

    offers.sort(key=lambda x: x.status, reverse=True)
    flight.offers = offers
    return flight


def parse_offer(f):
    offer = LegOffer(f.get('id'))
    offer.trip_request_id = f.get('tripRequestId', None)
    return offer


# get flight request by id
def get_flight_request(id, cookies):
    flight_requests_url = 'http://ascentjet.com/rest/secured/request/' + str(id)
    try:
        response = requests.get(url=flight_requests_url, cookies=cookies)
        logger.info("get_flight_request, status: %s" % response.status_code)
        logger.info("response.text: %s" % response.text)
        f = json.loads(response.text)
        return parse_flight(f)
    except Exception as e:
        logger.info("get_flight_request, Exception: %s" % e)
        return None


# get offer request by id
def get_offer_request(id, cookies):
    flight_requests_url = 'http://ascentjet.com/rest/secured/request/' + str(id)
    try:
        response = requests.post(url=flight_requests_url, cookies=cookies)
        print "status: ", response.status_code
        print "body: ", response.text

        f = json.loads(response.text)
        return parse_offer(f)

    except Exception as e:
        print "Exception: ", e
        return None


# get all flight requests for authenticated user
def get_flight_requests(cookies):
    flight_requests_url = 'http://ascentjet.com/rest/secured/request/'
    try:
        response = requests.get(url=flight_requests_url, cookies=cookies)
        logger.info("get_flight_requests, response.status_code: %s" % response.status_code)
        logger.info("get_flight_requests, response.text: %s" % response.text)

        r = json.loads(response.text)
        # logger.info("response.text: %s" % response.text)
        flight_requests_dict = r.get('requests', None)
        logger.info("flight_requests_dict: %s" % flight_requests_dict)
        flights = []  # flight request python objects

        if flight_requests_dict:
            for f in flight_requests_dict:
                flights.append(parse_flight_list(f))
        flights.sort(key=lambda x: x.id, reverse=True)
        return flights

    except Exception as e:
        print "Exception: ", e
        return None
