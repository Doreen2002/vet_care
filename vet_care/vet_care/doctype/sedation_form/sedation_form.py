# Copyright (c) 2025, 9T9IT and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SedationForm(Document):
	pass


import json
@frappe.whitelist()
def get_patient_details(patient):
	breed_parts =[]
	body_wgt_parts =[]
	gender_parts =[]
	color_parts =[]
	vc_neutered_parts =[]
	patient_name_parts = []
	patient = json.loads(patient)
	for p in patient:
		patient_doc = frappe.get_doc("Patient", p['patient'])
		breed_parts.append(patient_doc.vc_breed if patient_doc.vc_breed else '')
		body_wgt_parts.append(str(patient_doc.vc_weight) if patient_doc.vc_weight				 else '')
		gender_parts.append(patient_doc.sex if patient_doc.sex else '')
		color_parts.append(patient_doc.vc_color if patient_doc.vc_color else '')
		vc_neutered_parts.append(patient_doc.vc_neutered if patient_doc.vc_neutered else '')
		patient_name_parts.append(patient_doc.patient_name if patient_doc.patient_name else '' )
	breed = ', '.join(breed_parts)
	body_wgt = ', '.join(body_wgt_parts)
	gender = ', '.join(gender_parts)
	color = ', '.join(color_parts)
	vc_neutered = ', '.join(vc_neutered_parts)
	patient_name = 	', '.join(patient_name_parts)	  
	return {'vc_neutered': vc_neutered, 'breed':breed, 'body_wgt':body_wgt, 'gender': gender, 'color':color, 'patient_fullname':patient_name}

@frappe.whitelist()
def get_customer_details(customer):
	address = ''
	mobile_no = ''
	cpr_no = ''
	email =''
	customer_doc = frappe.get_doc ('Customer', customer)
	address = customer_doc.vc_flat_no if  customer_doc.vc_flat_no else ''  + customer_doc.vc_road_no if customer_doc.vc_road_no else '' + customer_doc.vc_block_no if  customer_doc.vc_block_no else '' + customer_doc.vc_city if customer_doc.vc_city else ''
	mobile_no = customer_doc.mobile_number if customer_doc.mobile_number else ''
	cpr_no = customer_doc.vc_cpr if customer_doc.vc_cpr else ''
	email = customer_doc.email_id or customer_doc.email_info or ''
	return {"address":address, "mobile_no":mobile_no, "cpr_no":cpr_no, "email":email}