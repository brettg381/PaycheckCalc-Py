from django.conf.urls import patterns, include, url, handler404
from django.contrib import admin
from django.conf import settings
admin.autodiscover()

urlpatterns = patterns('',
    url(r'', include('payroll.apps.registration.auth_urls')),
    url(r'^$', 'payroll.apps.calculator.views.home', name='home'),
    url(r'^employee/save/?$', 'payroll.apps.calculator.views.save_employee', name='save_ee'),
    url(r'^calculator/ytd/?$', 'payroll.apps.calculator.views.get_year_to_date', name='ytd'),
    url(r'^calculator/save/?$', 'payroll.apps.calculator.views.save_paycheck_data', name='save'),
    url(r'^calculator/autocomplete-employee/$', 'payroll.apps.calculator.views.autocomplete_employee', name='autocomplete'),
    url(r'^calculator/not-found/?$', 'payroll.apps.calculator.views.handler404', name='not-found'),
    url(r'^calculator/?$', 'payroll.apps.calculator.views.calculator', name='calculator'),
    url(r'^last-calculation/?$', 'payroll.apps.calculator.views.get_last_calculation', name='last_calculation'),
    url(r'^last-calculation/(?P<employee>.*)/?$', 'payroll.apps.calculator.views.get_last_calculation', name='last_calculation_filter'),
    url(r'^successfully-logged-out/?$', 'payroll.apps.calculator.views.successfully_logged_out', name='successfully_logged_out'),
    url(r'^help/$', 'payroll.apps.calculator.views.help', name='help'),
    url(r'^history/?$', 'payroll.apps.calculator.views.history', name='history'),
    url(r'^not-supported/?$', 'payroll.apps.calculator.views.not_supported', name='not_supported'),
    url(r'^recommend/?$', 'payroll.apps.calculator.views.recommend', name='recommend'),
    url(r'^contact/?$', 'payroll.apps.calculator.views.contact', name='contact'),
    url(r'^proxy/', 'payroll.apps.calculator.views.proxy', name='proxy'),
    url(r'^proxyLS/', 'payroll.apps.calculator.views.proxyls', name='proxyls'),
	url(r'^accounts/', include('payroll.apps.registration.backends.default.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

handler404 = 'payroll.apps.calculator.views.handler404'

if settings.DEBUG:
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^static/(?P<path>.*)$', 'serve'),
    )
