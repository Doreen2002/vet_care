// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("Grooming Form", {
		refresh(frm) {
        frm.set_query('patient', () => {
            return {
                filters: {
                    customer: frm.doc.customer_name
                }
            }
        })
        frappe.db.get_doc('Vetcare Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("html_editor_rvye","options", doc.dgrooming_terms);
                
                cur_frm.refresh_fields();
            }
        });
        frm.set_query('invoices', () => {
            return {
                filters: {
                    customer: frm.doc.customer_name
                }
            }
        })
        

        
	},
  
    customer_name(frm)
    {
        if(frm.doc.customer_name)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_customer_details",
                args:{'customer':frm.doc.customer_name},
                callback: function(r) {
                    if(r.message)
                    {
                       
                        frm.set_value("contact_no", r.message.mobile_no); 
                        frm.set_value("cpr_no", r.message.cpr_no);
                        frm.set_value("email", r.message.email);
                       
                          
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
    patient(frm)
    {
        if(frm.doc.patient)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_patient_details",
                args:{'patient':frm.doc.patient},
                callback: function(r) {
                    if(r.message)
                    {
                       
                        frm.set_value("breed", r.message.breed);
                        frm.set_value("species", r.message.species);
                        frm.set_value("age", r.message.dob_age);
                      
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
});
