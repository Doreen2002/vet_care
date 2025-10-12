// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("Euthanasia Form", {
	refresh(frm) {
        frm.set_query('patients_name', () => {
            return {
                filters: {
                    customer: frm.doc.clients_name
                }
            }
        })
        frappe.db.get_doc('VetCare Terms Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("terms","options", doc.euthanasia_terms);
                
                cur_frm.refresh_fields();
            }
        });
        frm.set_query('invoice', () => {
            return {
                filters: {
                    customer: frm.doc.clients_name
                }
            }
        })
        

        
	},
    patients_name(frm)
    {
        if(frm.doc.patients_name)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_patient_details",
                args:{'patient':frm.doc.patients_name},
                callback: function(r) {
                    if(r.message)
                    {
                       
                        frm.set_value("body_wt", r.message.body_wgt); 
                        frm.set_value("sex", r.message.gender);
                        frm.set_value("color", r.message.color);
                        frm.set_value("breed", r.message.breed);
                         frm.set_value('species', r.message.species)
                        frm.set_value('microchip_number', r.message.microchip_number)
                        frm.set_value('dob_age', r.message.dob_age)
                         frm.set_value("patient_fullname", r.message.patient_fullname);
                        frm.set_value("spayedneutered", r.message.spayedneutered);  
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
    clients_name(frm)
    {
        if(frm.doc.clients_name)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_customer_details",
                args:{'customer':frm.doc.clients_name},
                callback: function(r) {
                    if(r.message)
                    {
                      
                        frm.set_value("mobile_no", r.message.mobile_no); 
                        frm.set_value("cpr_no", r.message.cpr_no);
                        frm.set_value("email", r.message.email); 
                        frm.set_value("address", r.message.address);
                       frm.set_value("customer_fullname", r.message.customer_fullname);
                        frm.refresh_fields();

                    }
            }     });
        }
       
    }
});
