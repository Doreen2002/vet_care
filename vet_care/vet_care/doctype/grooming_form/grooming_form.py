# Copyright (c) 2025, 9T9IT and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document


class GroomingForm(Document):
	pass

@frappe.whitelist()
def get_groomer_fullname(groomer):
	groomer = json.loads(groomer)
	groomer_parts = []
	groomer_name = ''
	for g in groomer:
		groomer_doc = frappe.get_doc("Healthcare Practitioner", g['practitioner'])
		groomer_parts.append(groomer_doc.practitioner_name if groomer_doc.practitioner_name else '')
		groomer_name = ', '.join(groomer_parts)
	return groomer_name


@frappe.whitelist()
def get_grooming_employee_fullname(employee):
	emp = frappe.get_doc("Employee", employee)
	return emp.employee_name