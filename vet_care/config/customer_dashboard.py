from frappe import _
import frappe
from erpnext.selling.doctype.customer.customer_dashboard import get_data as erpnext_get_data

def get_data(data):
    erpnext_data = erpnext_get_data()
    erpnext_data['non_standard_fieldnames'].update({
            
            'Sedation Form': 'client',
            'Discharge Form': 'pet_owner',
            'Grooming Form': 'customer_name',
            'Admission Form': 'client',
            'Surgery Consent Form': 'owneragent_name',
            'Euthanasia Form': 'clients_name'
    })
    erpnext_data['transactions'].extend(
        [{
                'label': _('Registration Form'),
                'items': ['Registration Form']
            },
            {
                'label': _('Sedation Form'),
                'items': ['Sedation Form']
            },
            {
                'label': _('Discharge Form'),
                'items': ['Discharge Form']
            },
            {
                'label': _('Grooming Form'),
                'items': ['Grooming Form']
            },
            {
                'label': _('Admission Form'),
                'items': ['Admission Form']
            },
            {
                'label': _('Surgery Consent Form'),
                'items': ['Surgery Consent Form']
            },
            {
                'label': _('Euthanasia Form'),
                'items': ['Euthanasia Form']
            }]
         )
    return erpnext_data

