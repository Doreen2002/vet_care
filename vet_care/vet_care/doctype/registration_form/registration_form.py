# Copyright (c) 2025, 9T9IT and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RegistrationForm(Document):
	pass


def validate(self, method):
	cpr_exists = frappe.db.exists("Customer", {"vc_cpr":self.cpr_no}) or  frappe.db.exists("Customer", {"cr_no":self.cpr_no})
	mobile_no_exists = frappe.db.exists("Customer", {"mobile_number":self.mobile_no})
	email_exists = frappe.db.exists("Customer", {"email_info":self.email})
	if self.existing_customer != 1:
		if (cpr_exists  and self.cpr_no ) or (self.mobile_no and mobile_no_exists) or (self.email and email_exists):
			frappe.throw("Customer ID already available with the cpr/mobile/email where the match is found.")
def on_submit(self,method):
	customer = None
	if self.agree_to_terms_and_conditions != 1:
		return frappe.throw("You must agree to the terms and conditions before submitting the form.")
	if self.existing_customer != 1:
		customer = frappe.get_doc({
			"doctype": "Customer",
			"customer_name": self.clients_name,
			"customer_type": "Individual",
			"customer_group": "All Customer Groups",
			"mobile_no": self.mobile_no,
			"mobile_number": self.mobile_no,
			"email_info": self.email,
			"email_id": self.email,
			"vc_cpr": self.cpr_no,
			"vc_flat_no":self.address
		})
		customer.insert(ignore_permissions=True)
		frappe.db.set_value("Registration Form", self.name, "customer", customer.name)
		
	lines = []
	if self.name_and_date_of_last_vaccine:
		lines.append(f"Name and Date of Last Vaccine: {self.name_and_date_of_last_vaccine}")

	if self.name_and_date_of_last_deworming:
		lines.append(f"Name and Date of Last Deworming: {self.name_and_date_of_last_deworming}")

	if self.previous_veterinarian:
		lines.append(f"Previous Veterinarian: {self.previous_veterinarian}")

	medical_history = "\n".join(lines)

	patient = frappe.get_doc( {
		"doctype": "Patient",
		"first_name": self.patients_name,
		"patient_name": self.patients_name,
		"vc_breed": self.breed,
		"customer": customer.name if customer else '',
		"vc_species": self.species,
		"sex":self.sex,
		"vc_chip_id":self.microchip_number,
		"vc_neutered":self.spayedneutered,
		"vc_weight":self.body_wt,
		"dob":self.dobage,
		"vc_color":self.color,
		"allergies":self.any_allergies,
		"vc_nutrition": self.regular_diet,
		"medical_history": medical_history
	})
	patient.insert(ignore_permissions=True)
	self.patient = patient.name
