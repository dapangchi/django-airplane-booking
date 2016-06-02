"""
Django settings for ascent_jet project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import dj_database_url
BASE_DIR = os.environ.get('BASE_DIR', os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '6_+(8b9@$aem2xc%6%v*ufgui81=755pp36j=3si4v7vk!rxrt'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True # bool(os.environ.get('DEBUG', False))

TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Borislav Petrovic', 'borko@revolucija.hr'),
    ('Ozren Lapcevic', 'ozren.lapcevic@revolucija.hr'),
)

MANGERS = ADMINS

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = (

    # first define inhouse dependencies that other apps require
    'utils',
    'common',

    # 3rd party apps that override django
    'grappelli',
    # django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party apps
    'mptt',
    'django_autoslug',
    'tinymce',
    'django_extensions',
    'captcha',
    'imagekit',

    # our apps
    'structure',
    'airplanes',
    'flights',
    'contact'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

X_FRAME_OPTIONS = 'https://pilot.datatrans.biz'

# CORS_ORIGIN_ALLOW_ALL = True

# CORS_ORIGIN_WHITELIST = (
#     'https://pilot.datatrans.biz',
# )

ROOT_URLCONF = 'ascent_jet.urls'

WSGI_APPLICATION = 'ascent_jet.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
# DATABASES = {'default': dj_database_url.config()}
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'ascent_jet',
        'USER': 'postgres',
        'PASSWORD': 'root',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
STATIC_ROOT = os.path.join(MEDIA_ROOT, 'static')
STATIC_URL = MEDIA_URL + 'static/'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

SERVER_EMAIL = 'noreply@ascentjet.com'
DEFAULT_FROM_EMAIL = 'noreply@ascentjet.com'
#EMAIL_HOST = 'secure.emailsrvr.com'
#EMAIL_HOST_USER = 'noreply@ascentjet.com'
#EMAIL_HOST_PASSWORD = '1nfromati0n'

# EMAIL_HOST = 'smtp.gmail.com'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.mandrillapp.com'
EMAIL_PORT = '587'
EMAIL_HOST_USER = 'pederandes@gmail.com'
EMAIL_HOST_PASSWORD = 'ascentJet!23'


MANDRILL_USER = 'cdeverteuil'
MANDRILL_PASS = 'Espr1t12*'

MANDRILL_API_KEY = 'RgCJs8gaNGgZph8EDh2RfQ'
# MANDRILL_API_KEY = 'q1H5oPvBZNbaBu5SBzP29Q'
# MANDRILL_API_KEY = 'U3xMfNawRKdattabtRv00g'

DEFAULT_TO_EMAIL = "info@ascentjet.com"

if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    INTERNAL_IPS = ('127.0.0.1',)
    HMAC_KEY = "84c7cbaaa007a47cd256f20b2b0ac447d3b2fbbd6db00a1fdb6fd7299f6a44bbab3239058c21a56ff77a3bed8b1750fe61bb87f9f36c3a310b9799f63104a8d6"
    MERCHANT_ID = "1000011976"
else:
    HMAC_KEY = "84c7cbaaa007a47cd256f20b2b0ac447d3b2fbbd6db00a1fdb6fd7299f6a44bbab3239058c21a56ff77a3bed8b1750fe61bb87f9f36c3a310b9799f63104a8d6"
    MERCHANT_ID = "1000011976"

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_BACKEND = "djrill.mail.backends.djrill.DjrillBackend"

GRAPPELLI_ADMIN_TITLE = 'Ascent Jet Web Admin'

TEMPLATE_CONTEXT_PROCESSORS = (
    # start defaults
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    # end defaults

    # add request variable to every RequestContext (current HttpRequest). Required by grappelli.
    "django.core.context_processors.request",

    # add our custom context processors
    'structure.context_processors.navigation'
)

SITE_ID = 1

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        }
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR + '/info.log',
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        'ascent_jet.custom': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

TINYMCE_DEFAULT_CONFIG = {
    'theme': 'advanced',
    'custom_undo_redo_levels': 10,
    'relative_urls': False,
    'strict_loading_mode': True,
    'plugins': 'style, paste',
    'theme_advanced_buttons1': 'bold,italic,|,justifyleft,justifycenter,|,bullist,numlist,|,link,unlink,|,undo,redo,|,indent,outdent,image,charmap',
    'theme_advanced_buttons2': 'cut,copy,paste,|,pastetext,pasteword,|,removeformat,formatselect,|,image,styleselect',
    'theme_advanced_blockformats': 'p,div,h3,h4,h5,h6,blockquote,dt,dd,code,samp',
    'theme_advanced_more_colors': True,
    'theme_advanced_toolbar_align': 'left',
    'theme_advanced_toolbar_location': 'top',
    'theme_advanced_resizing': True,
    'width': '758px',
    'height': '400px',
    'remove_script_host': 'false',
    'document_base_url': '',
    'convert_urls': 'true',
    'style_formats': [
        {'title': 'Image left', 'selector': 'img', 'classes': ['left']},
        {'title': 'Image right', 'selector': 'img', 'classes': ['right']}
    ]
}

# reCaptcha. You can get keys at https://www.google.com/recaptcha/admin#list.
# This keys are associated with ozren.lapcevic@revolucija.hr account.
RECAPTCHA_PUBLIC_KEY = '6LcEsw0TAAAAAI1_8poecUENXdugTAs694ZA8UEA'
RECAPTCHA_PRIVATE_KEY = '6LcEsw0TAAAAAFh8z7k5cpAqPiJ-B_HwGK56Ayex'
NOCAPTCHA = True
