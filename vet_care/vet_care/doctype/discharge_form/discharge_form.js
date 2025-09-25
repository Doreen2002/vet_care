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
        frappe.db.get_doc('Vetcare Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("html_jbbp","options", doc.discharge_terms);
                
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
                        
                       
                          
                        frm.refresh_fields();

                    }
            }     });
        }
       
    }
});
