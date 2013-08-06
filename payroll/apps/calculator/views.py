from django.conf import settings
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.template.loader import render_to_string
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponse
from django.http.response import HttpResponseForbidden
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.mail.message import EmailMultiAlternatives
from django.core.exceptions import ObjectDoesNotExist
from payroll.apps.registration.forms import PayrollRegistrationForm
from payroll.apps.calculator.forms import AccountantForm, ContactForm, ResetPasswordForm
from payroll.apps.calculator.models import EntryData, EntryStateData, ResultData, ResultTaxData, Employee
from datetime import datetime
import urllib
import urllib2
import logging
import locale
import json
import re
import os
import string
import random
from django.utils.datastructures import MultiValueDictKeyError


parseStr = lambda x: x.isalpha() and x or x.isdigit() and \
        int(x) or x.isalnum() and x or \
        len(set(string.punctuation).intersection(x)) == 1 and \
        x.count('.') == 1 and float(x) or 0

def parseStrFix (x):
    try:
        return parseStr(x)
    except:
        return x

# Get an instance of a logger
logger = logging.getLogger('apps')
class NullHandler(logging.Handler):
    def emit(self, record):
        pass
nullhandler = logger.addHandler(NullHandler())

def home(request):
    if 'iuid' in request.GET:
        request.session['iuid'] = request.GET['iuid']
    elif request.session.get('iuid') == None:
        request.session['iuid'] = random.randint(1000000000, 9999999999)
    return calculator(request)

def handler404(request):
    params = {}
    if hasattr(settings, 'GA_ID'): params['ga_uuid'], params['ga_property'] = settings.GA_ID
    params['nav'] = 'calculator'
    params['contact_form'] = ContactForm()
    if not request.user.is_authenticated():
        params['accountant_form'] = AccountantForm(initial={'message':u"Try out this new paycheck calculator from Intuit.\n\nWhen it's time to cut checks, just enter your employee info and calculate the check amounts. When you save checks, the details from your payroll will appear in my accounting software. I'll be able to access all the details\nyou won't have to send me anything! It will be a big time saver at tax time, and it's free."})
        params['login_form'] = AuthenticationForm()
        params['reset_form'] = ResetPasswordForm()
        params['registration_form'] = PayrollRegistrationForm()

    return render_to_response('404.html',
                              params,
                              context_instance=RequestContext(request)
                              )

def successfully_logged_out(request):
    params = {}
    if hasattr(settings, 'GA_ID'): params['ga_uuid'], params['ga_property'] = settings.GA_ID
    params['nav'] = 'calculator'
    params['contact_form'] = ContactForm()
    if not request.user.is_authenticated():
        params['accountant_form'] = AccountantForm(initial={'message':u"Try out this new paycheck calculator from Intuit.\n\nWhen it's time to cut checks, just enter your employee info and calculate the check amounts. When you save checks, the details from your payroll will appear in my accounting software. I'll be able to access all the details\nyou won't have to send me anything! It will be a big time saver at tax time, and it's free."})
        params['login_form'] = AuthenticationForm()
        params['reset_form'] = ResetPasswordForm()
        params['registration_form'] = PayrollRegistrationForm()

    return render_to_response('registration/logout.html',
                              params,
                              context_instance=RequestContext(request)
                              )

def save_employee(request):
    if not request.user.is_authenticated():
        return HttpResponseForbidden()
    data=request.POST
    try:
        employee = Employee.objects.get(user=request.user, name=get_param(data, 'employee').title())
    except Employee.DoesNotExist:
        employee = Employee(user=request.user, name=get_param(data, 'employee').title())
        employee.save()
    return autocomplete_employee(request)


def calculator(request):
    params = {}
    if hasattr(settings, 'GA_ID'): params['ga_uuid'], params['ga_property'] = settings.GA_ID
    params['nav'] = 'calculator'
    params['contact_form'] = ContactForm()
    if not request.user.is_authenticated():
        params['accountant_form'] = AccountantForm(initial={'message':u"Try out this new paycheck calculator from Intuit.\n\nWhen it's time to cut checks, just enter your employee info and calculate the check amounts. When you save checks, the details from your payroll will appear in my accounting software. I'll be able to access all the details\nyou won't have to send me anything! It will be a big time saver at tax time, and it's free."})
        params['login_form'] = AuthenticationForm()
        params['reset_form'] = ResetPasswordForm()
        params['registration_form'] = PayrollRegistrationForm()

    return render_to_response('calculator.html',
                              params,
                              context_instance=RequestContext(request)
                              )

def history(request):
    params = {}
    if hasattr(settings, 'GA_ID'): params['ga_uuid'], params['ga_property'] = settings.GA_ID
    params['nav'] = 'history'
    params['contact_form'] = ContactForm()
    if not request.user.is_authenticated():
        params['accountant_form'] = AccountantForm(initial={'message':u"Try out this new paycheck calculator from Intuit.\n\nWhen it's time to cut checks, just enter your employee info and calculate the check amounts. When you save checks, the details from your payroll will appear in my accounting software. I'll be able to access all the details\nyou won't have to send me anything! It will be a big time saver at tax time, and it's free."})
        params['login_form'] = AuthenticationForm()
        params['reset_form'] = ResetPasswordForm()
        params['registration_form'] = PayrollRegistrationForm()
    else:
        params['invoices'] = ResultData.objects.filter(entry__employee__user = request.user)

    return render_to_response('history.html',
                              params,
                              context_instance=RequestContext(request)
                              )

def help(request):
    params = {}
    if hasattr(settings, 'GA_ID'): params['ga_uuid'], params['ga_property'] = settings.GA_ID
    return render_to_response('help.html',
                              params,
                              context_instance=RequestContext(request)
                              )

def get_last_calculation(request, employee=None):

    if not request.user.is_authenticated():
        return  HttpResponseForbidden()

    user_data={'status':0, 'data':None}
    entry = None
    obj={}

    try:
        if employee:
            entry = EntryData.objects.filter(employee__user=request.user, employee__name__iexact = employee).latest('id')
        else:
            entry = EntryData.objects.filter(employee__user = request.user).latest('id')
    except:
        return HttpResponse(json.dumps(user_data), mimetype="application/json")

    if not entry:
        return HttpResponse(json.dumps(user_data), mimetype="application/json")

    try:
        res = ResultData.objects.filter(entry=entry).latest('id')
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps(user_data), mimetype="application/json")

    obj['employee'] = entry.employee.name
    obj['state'] = entry.state

    obj['pay_date'] = entry.pay_date.strftime("%m/%d/%Y")
    obj['pay_type'] = entry.pay_type
    obj['pay_period'] = entry.pay_period
    obj['hours_worked'] = entry.hours_worked
    obj['gross_ytd'] = entry.gross_ytd + res.gross_pay
    obj['pay_rate_hs'] = entry.pay_rate_hs

    obj['overtime_worked'] = entry.overtime_worked
    obj['salary'] = entry.salary
    obj['bonus'] = entry.bonus
    obj['commission'] = entry.commission

    obj['filing_status'] = entry.filing_status
    obj['exemptions'] = entry.exemptions
    obj['additional_withholding'] = entry.additional_withholding

    for state in entry.entrystatedata_set.all():
        obj[state.name] = state.value

    user_data['status'] = 1
    user_data['data'] = obj

    return HttpResponse(json.dumps(user_data), mimetype="application/json")


def get_result(data, name):
    prefix = 'result_'
    try:
        val = data[prefix + name]

        return val.replace(",", "")
    except MultiValueDictKeyError:
        return 0

def get_param(data, name):
    try:
        val = data[name]
        if name == 'pay_date':
            val = datetime.strptime(val, "%m/%d/%Y").date()
        elif name == 'pay_type':
            val = {'hourly':0, 'salary':1}.get(val, 0)
        elif name == 'filing_status':
            val = {'Single':0, 'Married':1, 'SingleRate':2, 'DoNotWithhold':3}.get(val, 0)
    except MultiValueDictKeyError:
        val = 0

    return val

@csrf_exempt
def autocomplete_employee(request):
    employees = Employee.objects.filter(user=request.user).values('id', 'name')
    response = ''
    for e in employees:
        if response:
            response += ', '
        response += '"' + str(e['id']) + '":"' + e['name'] + '"'

    response = '{' + response + '}'
    return HttpResponse(response, mimetype="text/plain")

def save_pay_to_date(user, result):
    """
        Calculate and save pay to date result values
    """
    pass

@csrf_exempt
def save_paycheck_data(request):

    if not request.user.is_authenticated():
        return HttpResponseForbidden()

    data=request.POST

    try:
        employee = Employee.objects.get(user=request.user, name=get_param(data, 'employee').title())
    except Employee.DoesNotExist:
        employee = Employee(user=request.user, name=get_param(data, 'employee').title())
        employee.save()

    #save calculator fields
    entry = EntryData()
    entry.employee = employee
    entry.state = get_param(data, 'state')

    entry.pay_date = get_param(data, 'pay_date')
    entry.pay_type = get_param(data, 'pay_type')
    entry.pay_period = parseStrFix(get_param(data, 'pay_period'))
    entry.hours_worked = parseStrFix(get_param(data, 'hours_worked'))
    entry.gross_ytd = parseStrFix(get_param(data, 'gross_ytd'))
    entry.pay_rate_hs = parseStrFix(get_param(data, 'pay_rate_hs'))

    entry.overtime_worked = parseStrFix(get_param(data, 'overtime_worked'))
    entry.salary = parseStrFix(get_param(data, 'salary'))
    entry.bonus = parseStrFix(get_param(data, 'bonus'))
    entry.commission = parseStrFix(get_param(data, 'commission'))

    entry.filing_status = get_param(data, 'filing_status')
    entry.exemptions = parseStr(get_param(data, 'exemptions'))
    entry.additional_withholding = parseStrFix(get_param(data, 'additional_withholding'))
    entry.save()

    #save result fields
    result = ResultData()
    result.entry = entry
    result.state = get_param(data, 'state')
    result.pay_date = get_param(data, 'pay_date')
    result.pay_rate_hs = parseStrFix(get_param(data, 'pay_rate_hs'))
    result.net_pay = parseStrFix(get_result(data, 'net_pay'))
    result.net_pay_ytd = parseStrFix(get_result(data, 'net_pay_ytd'))

    if ('result_hours_total' in data):
        result.hours_total = parseStrFix(get_result(data, 'hours_total'))
        result.hours_worked = parseStrFix(get_result(data, 'hours_worked'))
    if ('result_salary' in data):
        result.salary = parseStrFix(get_result(data, 'salary'))
        result.salary_ytd = parseStrFix(get_result(data, 'salary_ytd'))
    if ('result_gross_pay' in data):
        result.gross_pay = parseStrFix(get_result(data, 'gross_pay'))
        result.gross_pay_ytd = parseStrFix(get_result(data, 'gross_pay_ytd'))
    if ('result_bonus' in data):
        result.bonus = parseStrFix(get_result(data, 'bonus'))
        result.bonus_ytd = parseStrFix(get_result(data, 'bonus_ytd'))
    if ('result_commission' in data):
        result.commission = parseStrFix(get_result(data, 'commission'))
        result.commission_ytd = parseStrFix(get_result(data, 'commission_ytd'))
    if ('result_ot_hours_worked' in data):
        result.ot_hours_worked = parseStrFix(get_result(data, 'ot_hours_worked'))
    if ('result_ot_pay_rate_hs' in data):
        result.ot_pay_rate_hs = parseStrFix(get_result(data, 'ot_pay_rate_hs'))
    if ('result_ot_total' in data):
        result.ot_total = parseStrFix(get_result(data, 'ot_total'))
    result.save()

    #save state and tax fields only
    for field in data:
        if re.match(entry.state + r"_.*$", field):
            sentry = EntryStateData()
            sentry.entry = entry
            sentry.name = field
            sentry.value = data[field]
            sentry.save()

    for i in range(0,10):
        key = 'result_taxes['+str(i)+']'
        if (key+'[name]' in data):
            rentry = ResultTaxData()
            rentry.result = result
            rentry.name = data[key+'[name]']
            rentry.amount = parseStrFix(data[key+'[amount]'])
            rentry.amount_ytd = parseStrFix(data[key+'[amount_ytd]'])
            rentry.save()

    save_pay_to_date(request.user, result)

    return HttpResponse(json.dumps({"status":"ok", }), mimetype="application/json")

def is_number(s):
    f = s.replace(",", "")
    try:
        float(f)
        return True
    except ValueError:
        return False

@csrf_exempt
def not_supported(request):

    state = ''
    email = ''

    if 'state' in request.POST:
        state = request.POST['state']

    if 'email' in request.POST:
        email = request.POST['email']

    bcc = ['hernan@itangelo.com', 'pablo@itangelo.com']
    to = 'snappayrollfeedback@intuit.com'
    from_email = settings.DEFAULT_FROM_EMAIL

    subject = "Intuit Easy Paycheck State Request for " + state
    text_content = render_to_string('email/not_supported.txt', { 'state': state,'email': email })
    html_content = render_to_string('email/not_supported.html', { 'state': state,'email': email })

    msg = EmailMultiAlternatives(subject, text_content, from_email, [to], bcc=bcc)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return HttpResponse(json.dumps({'status': 'ok', }), mimetype="application/json")

@csrf_exempt
def recommend(request):

    data = request.POST
    if "clients" in data:
        bcc = ['hernan@itangelo.com', 'pablo@itangelo.com']
        clients = data['clients'].split(",")
        for client in clients:
            to = client
            from_email = settings.DEFAULT_FROM_EMAIL

            email = data['email']
            message = data['message']

            subject = "Intuit Easy Paycheck"
            text_content = render_to_string('email/recommend.txt', { 'email': email, 'message': message })
            html_content = render_to_string('email/recommend.html', { 'email': email, 'message': message })

            msg = EmailMultiAlternatives(subject, text_content, from_email, [to], bcc=bcc)
            msg.attach_alternative(html_content, "text/html")
            msg.send()

    return HttpResponse(json.dumps({'status': 'ok', }), mimetype="application/json")

@csrf_exempt
def contact(request):

    data = request.POST
    bcc = ['hernan@itangelo.com', 'pablo@itangelo.com']
    to = ['snappayrollfeedback@intuit.com']
    from_email = settings.DEFAULT_FROM_EMAIL

    email = data['email']
    message = data['message']

    subject = "Contact from Intuit Easy Paycheck"
    text_content = render_to_string('email/contact.txt', { 'email': email, 'message': message })
    html_content = render_to_string('email/contact.html', { 'email': email, 'message': message })

    msg = EmailMultiAlternatives(subject, text_content, from_email, to, bcc=bcc)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return HttpResponse(json.dumps({'status': 'ok', }), mimetype="application/json")

@csrf_exempt
def get_year_to_date(request):

    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    taxes = {}
    result = {}
    ytd = {}

    ee = request.POST['employee']
    old = None
    if request.user.is_authenticated():
        try:
            old = ResultData.objects.filter(entry__employee__user=request.user, entry__employee__name__iexact = ee).latest('id')
        except:
            old = None

    for tax in request.POST:
        if not re.match(r"taxes.*$", tax):
            if (is_number(request.POST[tax]) and tax!='gross_pay'):
                val = float(request.POST[tax].replace(",", ""))
                if tax == 'gross_pay_ytd':
                    val += float(request.POST['gross_pay'].replace(",", ""))
                    ytd[tax] = locale.format('%.2f', val, True)
                else:
                    if (old):
                        try:
                            val += getattr(old, tax+'_ytd')
                        except:
                            val += 0
                    ytd[tax+'_ytd'] = locale.format('%.2f', val, True)

    for i in range(0,10):
        key = 'taxes['+str(i)+']'
        if (key+'[name]' in request.POST):
            val = float(request.POST[key+'[amount]'].replace(",", ""))
            if (old):
                val += 0 # getattr(old, tax+'_ytd')
            taxes[request.POST[key+'[name]']] = locale.format('%.2f', val, True)

    result['ytd'] = ytd
    result['taxes'] = taxes
    return HttpResponse(json.dumps(result), mimetype="application/json")

@require_http_methods(["GET", "POST"])
def proxy(request):

    ep = '/v1/usa';
    if 'HTTP_X_RESTPROXY_ENDPOINT' in request.META:
        ep = request.META['HTTP_X_RESTPROXY_ENDPOINT']

    api_key = 'ec5589c0-2501-11e2-81c1-0800200c9a66'
    headers = { 'X-Intuit-ApiKey' : api_key }
    data = urllib.urlencode(request.POST)

    try:
        req = urllib2.Request('https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com' + ep, data, headers);
        response = urllib2.urlopen(req)
    except Exception, e:
        response = '{"status": "error"}'

    return HttpResponse(response, mimetype="text/javascript")

@require_http_methods(["GET", "POST"])
def proxyls(request):
    state = ''
    zipcode = ''

    if 'state' in request.GET:
        state = request.GET['state']

    if 'zip' in request.GET:
        zipcode = request.GET['zip']

    req = urllib2.Request("https://silverpanda.emslabs.intuit.com/v1/geocode/usa/?state=%s&zip=%s" % (state,zipcode));
    response = urllib2.urlopen(req)

    return HttpResponse(response, mimetype="text/javascript")
