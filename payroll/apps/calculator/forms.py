try:
    from django.contrib.auth import get_user_model
except ImportError: # django < 1.5
    from django.contrib.auth.models import User
else:
    User = get_user_model()
from django import forms
from django.utils.translation import ugettext_lazy as _

attrs_dict = {'class': 'required'}

# from django import forms
# from django.forms.fields import email_re

# class MultipleEmailsField(forms.Field):
#     def clean(self, value):
#         """
#         Check that the field contains one or more comma-separated emails
#         and normalizes the data to a list of the email strings.
#         """
#         if not value:
#             raise forms.ValidationError('Enter at least one e-mail address.')
#         emails = value.split(',')
#         for email in emails:
#             if not email_re.match(email):
#                 raise forms.ValidationError('%s is not a valid e-mail address.' % email)
#         return emails

class ContactForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs=dict(attrs_dict,
                                                               maxlength=75)),
                             label=_("Your Email"))
    message = forms.CharField(widget=forms.Textarea(attrs={'rows': 5,'class':'required'}),
                                label=_("Message"))

class ResetPasswordForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs=dict(attrs_dict,
                                                               maxlength=75)),
                             label=_("Your Email"))

class AccountantForm(forms.Form):
    clients = forms.CharField(widget=forms.TextInput(attrs=dict(attrs_dict,
                                                               maxlength=75)),
                             label=u"Client's Emails",
                             help_text=u"Comma separated")

    email = forms.EmailField(widget=forms.TextInput(attrs=dict(attrs_dict,
                                                               maxlength=75)),
                             label=_("Your Email"))
    message = forms.CharField(widget=forms.Textarea(attrs={'rows': 5,'class':'required'}),
                                label=_("Message"))
