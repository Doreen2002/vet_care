// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("SEDATION FORM", {
	refresh(frm) {
        frm.set_query('patient', () => {
            return {
                filters: {
                    customer: frm.doc.client
                }
            }
        })
        frappe.db.get_doc('Vetcare Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("html_eyfd","options", doc.sedation_terms);
                
                cur_frm.refresh_fields();
            }
        });
        frm.set_query('invoice', () => {
            return {
                filters: {
                    customer: frm.doc.client
                }
            }
        })
        

        
	},
    patient(frm)
    {
        if(frm.doc.patient)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.sedation_form.sedation_form.get_patient_details",
                args:{'patient':frm.doc.patient},
                callback: function(r) {
                    if(r.message)
                    {
                        // frm.set_value("microchip_number", r.message.microchip_no);
                        frm.set_value("body_weight", r.message.body_wgt); 
                        frm.set_value("gender", r.message.gender);
                        frm.set_value("color", r.message.color);
                        frm.set_value("breed", r.message.breed);
                        // frm.set_value("species", r.message.species);
                        // frm.set_value("dob_age", r.message.dob_age);
                        // frm.set_value("spayedneutered", r.message.spayedneutered);  
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
                method:"vet_care.vet_care.doctype.sedation_form.sedation_form.get_customer_details",
                args:{'customer':frm.doc.client},
                callback: function(r) {
                    if(r.message)
                    {
                       
                        frm.set_value("mobile", r.message.body_wgt); 
                        frm.set_value("cpr", r.message.cpr);
                        frm.set_value("email", r.message.email); 
                        frm.set_value("address", r.message.address);
                       
                          
                        frm.refresh_fields();

                    }
            }     });
        }
       
    }
});
