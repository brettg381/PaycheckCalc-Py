from django.db import models
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from enums import *
from datetime import datetime

class PayrollUserManager(BaseUserManager):
    def create_user(self, email, password=None):

        if not email:
            raise ValueError('Users must have an email address')
 
        user = self.model(
            email=PayrollUserManager.normalize_email(email),
        )
 
        user.set_password(password)
        user.save(using=self._db)
        return user
 
    def create_superuser(self, email, password):
        user = self.create_user(
        	email,
            password=password,
        )
        user.is_active = True
        user.is_admin = True
        user.save(using=self._db)
        return user
 
class PayrollUser(AbstractBaseUser):
    objects = PayrollUserManager()
    email = models.EmailField(max_length=254, unique=True)
    accountant_email = models.EmailField(max_length=254, blank=True, null=True)

    USERNAME_FIELD = 'email'
    
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    def get_full_name(self):
        return self.email
 
    def get_short_name(self):
        return self.email
 
    def __unicode__(self):
        return self.email
 
    def has_perm(self, perm, obj=None):
        # Handle whether the user has a specific permission?"
        return True
 
    def has_module_perms(self, app_label):
        # Handle whether the user has permissions to view the app `app_label`?"
        return True

    def email_user(self, subject, message, from_email=None):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email])
 
    @property
    def is_staff(self):
        # Handle whether the user is a member of staff?"
        return self.is_admin

class Employee(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=60)
    created = models.DateField(auto_now_add=True, default=datetime.now())
    deleted = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name

class EntryData(models.Model):
    employee = models.ForeignKey(Employee)
    created = models.DateField(auto_now_add=True, default=datetime.now())
    state = models.CharField(max_length=2, choices = INTUIT_STATES)
    
    #This is a fix value for current year.     
    gross_ytd = models.FloatField(default=0, null=True, blank=True)
    # Pay Information
    pay_date = models.DateField(null=True, blank=True)
    pay_period = models.SmallIntegerField(choices = INTUIT_PAY_PERIOD,null=True, blank=True)
    pay_type = models.SmallIntegerField(choices = INTUIT_PAY_TYPE,null=True, blank=True)
    hours_worked = models.IntegerField(default=0, null=True, blank=True)
    pay_rate_hs = models.FloatField(default=0, null=True, blank=True)
    # Pay Additional
    overtime_worked = models.FloatField(default=0, null=True, blank=True)
    salary = models.FloatField(default=0, null=True, blank=True)
    bonus = models.FloatField(default=0, null=True, blank=True)
    commission = models.FloatField(default=0, null=True, blank=True)
    # Federal Witholdings
    filing_status = models.SmallIntegerField(choices = INTUIT_FILING_STATUS,null=True, blank=True)
    exemptions = models.IntegerField(default=0, null=True, blank=True)
    additional_withholding = models.FloatField(default=0, null=True, blank=True)
    
    def __unicode__(self):
        return self.employee.name

    class Meta():
        verbose_name = "Entry Data"
        verbose_name_plural = "Entry Data"

class EntryStateData(models.Model):
    entry = models.ForeignKey(EntryData)
    name = models.CharField(max_length=50)
    value = models.CharField(max_length=30)

    def __unicode__(self):
        return self.name

class ResultData(models.Model):
    entry = models.ForeignKey(EntryData)
    created = models.DateField(auto_now_add=True, default=datetime.now())
    # Result
    state = models.CharField(max_length=2, choices = INTUIT_STATES)
    pay_date = models.DateField(null=True, blank=True)
    pay_rate_hs = models.FloatField(default=0, null=True, blank=True)
    net_pay = models.FloatField(default=0, null=True, blank=True)
    hours_total = models.FloatField(default=0, null=True, blank=True)
    hours_worked = models.FloatField(default=0, null=True, blank=True)
    gross_pay = models.FloatField(default=0, null=True, blank=True)
    # Other fields
    salary = models.FloatField(default=0, null=True, blank=True)
    bonus = models.FloatField(default=0, null=True, blank=True)
    commission = models.FloatField(default=0, null=True, blank=True)
    is_salary = models.BooleanField(default=False)
    ot_hours_worked = models.FloatField(default=0, null=True, blank=True)
    ot_pay_rate_hs = models.FloatField(default=0, null=True, blank=True)
    ot_total = models.FloatField(default=0, null=True, blank=True)
    
    # YEAR-TO-DATE
    gross_pay_ytd = models.FloatField(default=0, null=True, blank=True)
    net_pay_ytd = models.FloatField(default=0, null=True, blank=True)
    # Other fields
    salary_ytd = models.FloatField(default=0, null=True, blank=True)
    bonus_ytd = models.FloatField(default=0, null=True, blank=True)
    commission_ytd = models.FloatField(default=0, null=True, blank=True)

    def __unicode__(self):
        return self.entry.employee.name

    class Meta():
        verbose_name = "Result Data"
        verbose_name_plural = "Result Data"


class ResultTaxData(models.Model):
    result = models.ForeignKey(ResultData, blank=True, null=True)

    name = models.CharField(max_length=50)
    amount = models.FloatField(default=0)

    # YEAR-TO-DATE
    amount_ytd = models.FloatField(default=0)

    def __unicode__(self):
        return self.name

class ReportData(ResultData):

    class Meta:
        proxy = True    
        verbose_name = "Paycheck Calculation History"
        verbose_name_plural = "Paycheck Calculation History"
