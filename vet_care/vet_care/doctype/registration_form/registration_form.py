# Copyright (c) 2025, 9T9IT and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class REGISTRATIONFORM(Document):
	def on_submit(self):
		if self.agree_to_terms_and_conditions != 1:
			return frappe.throw("You must agree to the terms and conditions before submitting the form.")
		customer = frappe.get_doc({
			"doctype": "Customer",
			"customer_name": self.clients_name,
			"customer_type": "Individual",
			"customer_group": "All Customer Groups",
			"mobile_no": self.mobile_no,
			"vc_cpr": self.cpr_no,
			"vc_flat_no":self.address
		})
		customer.insert(ignore_permissions=True)
	
		patient = frappe.get_doc( {
			"doctype": "Patient",
			"first_name": self.patients_name,
			"patient_name": self.patients_name,
			"vc_breed": self.breed,
			"customer": customer.name,
			"vc_species": self.species,
			"sex":self.sex,
			"vc_chip_id":self.microchip_number,
			# "spayedneutered":self.spayedneutered,
			"vc_weight":self.body_wt,
			"vc_color":self.color,
		})
		patient.insert(ignore_permissions=True)
		self.customer = customer.name
		self.patient = patient.name
