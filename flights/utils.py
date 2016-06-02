import hmac
from hashlib import md5

from django.conf import settings


def hmac_md5(key, msg):
    return hmac.HMAC(key, msg, md5).hexdigest()


def get_sign(amount, currency, refno):
    key = bytearray.fromhex(settings.HMAC_KEY)
    msg = str(settings.MERCHANT_ID) + str(amount) + str(currency) + str(refno)

    print msg

    return hmac_md5(key, msg)
