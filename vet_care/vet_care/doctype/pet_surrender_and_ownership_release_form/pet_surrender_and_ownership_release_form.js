// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("Pet Surrender and Ownership Release Form", {
	refresh(frm) {
        frappe.db.get_doc('VetCare Terms Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("terms","options", doc.pet_surrender_ownership);
                
                cur_frm.refresh_fields();
            }
        });
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
                       
                        frm.set_value("gender",  r.message.gender);
                        frm.set_value("color__markings", r.message.color);
                        frm.set_value("breed", r.message.breed);
                         frm.set_value('species', r.message.species)
                        frm.set_value('microchip_no', r.message.microchip_number)
                        frm.set_value('date_of_birth__age', r.message.dob_age)
                         frm.set_value("pets_name", r.message.patient_fullname);
                        
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
    owners_name(frm)
    {
        if(frm.doc.owners_name)
        {
            frappe.call({
                method:"vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_customer_details",
                args:{'customer':frm.doc.owners_name},
                callback: function(r) {
                    if(r.message)
                    {
                      
                        frm.set_value("phone_number", r.message.mobile_no); 
                        frm.set_value("cpr__id", r.message.cpr_no);
                       frm.set_value("full_name", r.message.customer_fullname);
                        frm.refresh_fields();

                    }
            }     });
        }
       
    }
});
