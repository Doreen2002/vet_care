// Copyright (c) 2026, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("Orthopedic Surgery Form", {
    refresh(frm) {
        frm.set_query('patient', () => {
            return {
                filters: {
                    customer: frm.doc.owneragent_name
                }
            }
        })
        frappe.db.get_doc('VetCare Terms Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("html_qfns","options", doc.orthopedic_surgery_form);
                
                cur_frm.refresh_fields();
            }
        });
        frm.set_query('invoice_no', () => {
            return {
                filters: {
                    customer: frm.doc.owneragent_name
                }
            }
        })
        

        
	},
    patient(frm)
    {
        if(frm.doc.patient)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.orthopedic_surgery_form.orthopedic_surgery_form.get_patient_details",
                args:{'patient':frm.doc.patient},
                callback: function(r) {
                    if(r.message)
                    {
                        frm.set_value("microchip_no", r.message.microchip_no);
                        frm.set_value("body_weight", r.message.body_wgt); 
                        frm.set_value("gender", r.message.gender);
                        frm.set_value("color", r.message.color);  
                         frm.set_value("patient_full_name", r.message.patient_fullname);
                         frm.set_value("microchip_no", r.message.microchip_number);
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
    owneragent_name(frm)
    {
        if(frm.doc.owneragent_name)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.orthopedic_surgery_form.orthopedic_surgery_form.get_customer_details",
                args:{'customer':frm.doc.owneragent_name},
                callback: function(r) {
                    if(r.message)
                    {
                       
                        frm.set_value("mobile_no", r.message.mobile_no); 
                        frm.set_value("cpr", r.message.cpr_no);
                        frm.set_value("customer_full_name", r.message.customer_fullname);
                          
                        frm.refresh_fields();

                    }
            }     });
        }
       
    }
});
