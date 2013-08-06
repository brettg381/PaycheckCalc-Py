from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import admin
from payroll.apps.calculator.models import ResultData
import csv

def export_as_csv_action(description="Export selection as CSV",
                         fields=None, exclude=None, header=True):
    """
    Esta function retorna un archivo csv
    """
    def export_as_csv(modeladmin, request, queryset):
        """
        Export Calculator Report as CSV
        """
        opts = modeladmin.model._meta

        response = HttpResponse(mimetype='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s.csv' % unicode(opts).replace('.', '_')

        writer = csv.writer(response)

        header = [u'Username', u'Employee', u'Creation Date', u'Pay Date', u'Worked From', u'Hours Worked', u'Salary', u'Bonus', u'Commission', u'Overtime hours worked ', u'Pay Rate', u'Gross Pay', u'Net Pay']
        rows = []
        for obj in queryset:
            row = [None] * len(header)

            row.insert(0, unicode(obj.entry.employee.user.email).encode("utf-8","replace"))
            row.insert(1, unicode(obj.entry.employee.name).encode("utf-8","replace"))
            row.insert(2, unicode(obj.created).encode("utf-8","replace"))
            row.insert(3, unicode(obj.pay_date).encode("utf-8","replace"))
            row.insert(4, unicode(obj.get_state_display()).encode("utf-8","replace"))
            row.insert(5, unicode(obj.hours_worked).encode("utf-8","replace"))
            row.insert(6, unicode(obj.salary).encode("utf-8","replace"))
            row.insert(7, unicode(obj.bonus).encode("utf-8","replace"))
            row.insert(8, unicode(obj.commission).encode("utf-8","replace"))
            row.insert(9, unicode(obj.ot_hours_worked).encode("utf-8","replace"))
            row.insert(10, unicode(obj.pay_rate_hs).encode("utf-8","replace"))
            row.insert(11, unicode(obj.gross_pay).encode("utf-8","replace"))
            row.insert(12, unicode(obj.net_pay).encode("utf-8","replace"))

            for tax in obj.resulttaxdata_set.all():
                if not tax.name in header:
                    header.append(tax.name)

                idx = header.index(tax.name)
                row.insert(idx, unicode(tax.amount).encode("utf-8","replace"))

            rows.append(row)

        writer.writerow(header)
        for row in rows:
            writer.writerow(row)

        return response

    export_as_csv.short_description = description
    return export_as_csv
