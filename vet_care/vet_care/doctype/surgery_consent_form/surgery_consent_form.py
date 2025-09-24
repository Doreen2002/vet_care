# Copyright (c) 2025, 9T9IT and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SurgeryConsentForm(Document):
	pass


import json
@frappe.whitelist()
def get_patient_details(patient):
	microchip_no = ''
	body_wgt = ''
	gender = ''
	color =''
	patient = json.loads(patient)
	for p in patient:
		patient_doc = frappe.get_doc("Patient", p['patient'])
		microchip_no+= patient_doc.vc_chip_id if patient_doc.vc_chip_id else ''
		body_wgt +=str( patient_doc.vc_weight) if patient_doc.vc_weight else ''
		gender += patient_doc.sex if patient_doc.sex else ''
		color += patient_doc.vc_color if patient_doc.vc_color else ''
	return {'microchip_no':microchip_no, 'body_wgt':body_wgt, 'gender': gender, 'color':color}

@frappe.whitelist()
def get_customer_details(customer):
	address = ''
	mobile_no = ''
	cpr_no = ''
	email =''
	customer_doc = frappe.get_doc ('Customer', customer)
	address = customer_doc.vc_flat_no if  customer_doc.vc_flat_no else ''  + customer_doc.vc_road_no if customer_doc.vc_road_no else '' + customer_doc.vc_road_no if  customer_doc.vc_road_no else '' + customer_doc.vc_city if customer_doc.vc_city else ''
	mobile_no = customer_doc.mobile_number if customer_doc.mobile_number else ''
	cpr_no = customer_doc.vc_cpr if customer_doc.vc_cpr else ''
	email = customer_doc.email_id if customer_doc.email_id else ''
	return {"address":address, "mobile_no":mobile_no, "cpr_no":cpr_no, "email":email}