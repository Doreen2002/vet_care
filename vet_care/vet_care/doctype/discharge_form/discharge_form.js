// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("Discharge Form", {
	refresh(frm) {
        frm.set_query('pet_name', () => {
            return {
                filters: {
                    customer: frm.doc.pet_owner
                }
            }
        })
        frappe.db.get_doc('VetCare Terms Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("terms","options", doc.discharge_terms);
                
                cur_frm.refresh_fields();
            }
        });
        frm.set_query('invoices', () => {
            return {
                filters: {
                    customer: frm.doc.pet_owner
                }
            }
        })
        

        
	},
    pet_name(frm)
    {
        if(frm.doc.pet_name)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_patient_details",
                args:{'patient':frm.doc.pet_name},
                callback: function(r) {
                    if(r.message)
                    {
                       
                        
                         frm.set_value("patient_fullname", r.message.patient_fullname);
                       
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
    pet_owner(frm)
    {
        if(frm.doc.pet_owner)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_customer_details",
                args:{'customer':frm.doc.pet_owner},
                callback: function(r) {
                    if(r.message)
                    {
                       
                        frm.set_value("owner_phone_no", r.message.mobile_no); 
                            frm.set_value("customer_fullname", r.message.customer_fullname);
                       
                          
                        frm.refresh_fields();

                    }
            }     });
        }
       
    }
});