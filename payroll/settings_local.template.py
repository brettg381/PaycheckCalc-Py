import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG
PROJECT_PATH = os.path.realpath(os.path.dirname(__file__))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': os.path.join(PROJECT_PATH,'../sqlite.db'),                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

#Debug Toolbar Configuration
DEBUG_TOOLBAR_CONFIG = {'INTERCEPT_REDIRECTS': False,}
INTERNAL_IPS = ('127.0.0.1',)
MIDDLEWARE_CLASSES += ('debug_toolbar.middleware.DebugToolbarMiddleware',)
INSTALLED_APPS += ('debug_toolbar',)

# EMAIL CONFIGURATION
DEFAULT_FROM_EMAIL = 'account@gmail.com'
SERVER_EMAIL = 'account@gmail.com'
EMAIL_USE_TLS = TRUE
EMAIL_HOST = 'stmp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'account@gmail.com'
EMAIL_HOST_PASSWORD = 'password'

# ===== Google Analytics tracking ids =====
GA_ID = ('UA-41115413-1', 'ikenta.com');   # test server
# GA_ID = ('UA-41115413-2', 'intuiteasypaycheck.com');   # deploy server
