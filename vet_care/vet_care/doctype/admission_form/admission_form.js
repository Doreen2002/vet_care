// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("Admission Form", {
	refresh(frm) {
        frm.set_query('patient', () => {
            return {
                filters: {
                    customer: frm.doc.client
                }
            }
        })
        frm.set_query('invoice_no', () => {
            return {
                filters: {
                    customer: frm.doc.client
                }
            }
        })
        

        frappe.db.get_doc('VetCare Terms Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("terms_and_conditions","options", doc.admission_form_text);
                
                cur_frm.refresh_fields();
            }
        });
	},
    patient(frm)
    {
        if(frm.doc.patient)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.admission_form.admission_form.get_patient_details",
                args:{'patient':frm.doc.patient},
                callback: function(r) {
                    if(r.message)
                    {
                        frm.set_value("breed", r.message.breed);
                        frm.set_value("body_weight", r.message.body_wgt); 
                        frm.set_value("gender", r.message.gender);
                        frm.set_value("color", r.message.color); 
                         frm.set_value("patient_fullname", r.message.patient_fullname); 
                         frm.set_value("customer_fullname", r.message.customer_fullname);
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
    client(frm)
    {
        if(frm.doc.client)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.admission_form.admission_form.get_customer_details",
                args:{'customer':frm.doc.client},
                callback: function(r) {
                    if(r.message)
                    {
                        frm.set_value("address", r.message.address);
                        frm.set_value("mobile", r.message.mobile_no); 
                        frm.set_value("cpr", r.message.cpr_no);
                        frm.set_value("email", r.message.email);
                          
                        frm.refresh_fields();

                    }
            }     });
        }
       
    }
    
});
