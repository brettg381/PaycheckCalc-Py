from django.contrib import admin
from django.contrib.auth.models import Group
from payroll.apps.calculator.models import PayrollUser, Employee, EntryData, EntryStateData, ResultData, ResultTaxData, ReportData
from payroll.apps.calculator.actions import export_as_csv_action
from django.utils.translation import ugettext_lazy as _
from django.contrib.admin import SimpleListFilter
from django.contrib.sites.models import Site

class UsernameListFilter(SimpleListFilter):
    title = _('Username')
    parameter_name = 'email'

    def lookups(self, request, model_admin):
        users = PayrollUser.objects.all()

        return [ (u.id, u.email) for u in users ]

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        if self.value():
            return queryset.filter(entry__employee__user__id__exact=self.value())
        else:
            return queryset        
        
class EmployeeListFilter(SimpleListFilter):
    title = _('Employee')
    parameter_name = 'employee'

    def lookups(self, request, model_admin):
        employees = Employee.objects.all()

        return [ (e.id, e.name) for e in employees ]

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        if self.value():
            return queryset.filter(entry__employee__id__exact=self.value())
        else:
            return queryset  

#from django.conf.urls import patterns
#from django.contrib import admin
#from django.http import HttpResponse
#
#def report(request):
#    return HttpResponse("Report Data!")
#
#def get_admin_urls(urls):
#    def get_urls():
#        my_urls = patterns('',
#            (r'^report/$', admin.site.admin_view(report))
#        )
#        return my_urls + urls
#    return get_urls
#
#admin_urls = get_admin_urls(admin.site.get_urls())
#admin.site.get_urls = admin_urls

class ReportDataAdmin(admin.ModelAdmin):
    actions = None
    actions = [export_as_csv_action("Export to CSV", fields=['email'])]
    list_display = ('get_user', 'get_employee', 'pay_date', 'pay_rate_hs', 'hours_worked', 'gross_pay', 'gross_pay_ytd', 'net_pay')
    list_filter = (UsernameListFilter, EmployeeListFilter)
 
    def get_actions(self, request):
        actions = super(ReportDataAdmin, self).get_actions(request)
        actions['delete_selected'][0].short_description = "Delete Selected Paycheck"
#        del actions['delete_selected']
        return actions

    def has_add_permission(self, request):
        return False
    
    def has_edit_permission(self, request):
        return False

    def get_user(self, obj):
        return '%s'%(obj.entry.employee.user.email)
    get_user.short_description = 'User'

    def get_employee(self, obj):
        return '%s'%(obj.entry.employee.name)
    get_employee.short_description = 'Employee'
    
    def __init__(self, *args, **kwargs):
        super(ReportDataAdmin, self).__init__(*args, **kwargs)
        self.list_display_links = (None, )
        
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')

class StateDataInline(admin.TabularInline):
    model = EntryStateData
    verbose_name = "State Values"
    verbose_name_plural = "State Values"
    
    def has_add_permission(self, request):
        return False
#
#    def has_change_permission(self, request, obj=None):
#        return False
#
    def has_delete_permission(self, request, obj=None):
        return False

class EntryDataAdmin(admin.ModelAdmin):
    inlines = [
        StateDataInline,
    ]
    fieldsets = (
        (None, {
            'fields': ('state', 'employee')
        }),
        ('Pay Information', {
            'classes': ('collapse',),
            'fields': ('pay_date', 'pay_period', 'hours_worked', 'pay_rate_hs', 'gross_ytd')
        }),
        ('Pay Additional', {
            'classes': ('collapse',),
            'fields': ('overtime_worked','salary','bonus','commission')
        }),
        ('Federal Withholdings', {
            'classes': ('collapse',),
            'fields': ('filing_status', 'exemptions', 'additional_withholding')
        }),
    )
    list_display = ('employee', 'state', 'pay_date')

class ResultTaxDataInline(admin.TabularInline):
    model = ResultTaxData
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

class ResultDataAdmin(admin.ModelAdmin):
    inlines = [
        ResultTaxDataInline,
    ]

class PayrollUserAdmin(admin.ModelAdmin):
	pass
	# list_display = (email, is_staff, is_admin)
	# search_fields = ('email',)
	# ordering = ('email',)

#admin.site.register(Employee, EmployeeAdmin)
#admin.site.register(EntryData, EntryDataAdmin)
#admin.site.register(ResultData, ResultDataAdmin)
#admin.site.register(PayrollUser, PayrollUserAdmin)
admin.site.register(ReportData, ReportDataAdmin)
admin.site.unregister(Group)
admin.site.unregister(Site)

