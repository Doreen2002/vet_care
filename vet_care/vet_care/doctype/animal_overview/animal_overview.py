# -*- coding: utf-8 -*-
# Copyright (c) 2020, 9T9IT and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from toolz import compose, first, pluck
from frappe.model.document import Document
from functools import partial

from frappe.desk.reportview import get_match_cond, get_filters_cond
from erpnext.controllers.queries import get_fields
class AnimalOverview(Document):
	def validate(self):
		_set_attach_to_animal(self)


# searches for customer
@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def customer_query(doctype, txt, searchfield, start, page_len, filters):
	conditions = []
	cust_master_name = frappe.defaults.get_user_default("cust_master_name")

	if cust_master_name == "Customer Name":
		fields = ["name", "customer_group", "territory"]
	else:
		fields = ["name", "customer_name", "customer_group", "territory"]

	fields = get_fields("Customer", fields)

	searchfields = frappe.get_meta("Customer").get_search_fields()
	searchfields = " or ".join([field + " like %(txt)s" for field in searchfields])

	return frappe.db.sql("""select {fields} from `tabCustomer`
		where docstatus < 2
			and ({scond}) and disabled=0
			{fcond} {mcond}
		order by
			if(locate(%(_txt)s, name), locate(%(_txt)s, name), 99999),
			if(locate(%(_txt)s, customer_name), locate(%(_txt)s, customer_name), 99999),
			idx desc,
			name, customer_name
		limit %(start)s, %(page_len)s""".format(**{
			"fields": ", ".join(fields),
			"scond": searchfields,
			"mcond": get_match_cond(doctype),
			"fcond": get_filters_cond(doctype, filters, conditions).replace('%', '%%'),
		}), {
			'txt': "%%%s%%" % txt,
			'_txt': txt.replace("%", ""),
			'start': start,
			'page_len': page_len
		})

def _set_attach_to_animal(animal_overview):
	if not animal_overview.animal and animal_overview.attach:
		frappe.throw(_('Please set animal field'))
	if not animal_overview.attach:
		return
	file = compose(
		first,
		partial(pluck, 'name'),
	)(
		frappe.get_all(
			'File',
			filters={
				'attached_to_name': 'Animal Overview',
				'attached_to_doctype': 'Animal Overview'
			}
		)
	)
	frappe.db.sql(
		"""
			UPDATE 
				`tabFile`
			SET
				attached_to_name = %(attached_to_name)s,
				attached_to_doctype = 'Patient'
			WHERE
				name = %(name)s
		""",
		{
			'attached_to_name': animal_overview.animal,
			'name': file
		}
	)
	animal_overview.attach = None
