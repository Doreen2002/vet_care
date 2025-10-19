// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

function set_patient_query(frm){
    let walk_in_patient = '';
        frappe.db.get_doc('Vetcare Settings').then(doc => {
            if(doc)
            {
                walk_in_patient = doc.default_walk_in_patient;
               
            }
        });
        frm.set_query('patient', 'grooming_patient_details', function (doc, cdt, cdn) {
            const row = locals[cdt][cdn];
            return {
                filters: {
                    customer: ['in', [frm.doc.customer_name, walk_in_patient]]
                }
            };
        });
}

frappe.ui.form.on("Grooming Form", {
		refresh(frm) {
            set_patient_query(frm);

        frappe.db.get_doc('VetCare Terms Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("html_editor_rvye","options", doc.grooming_terms);
                
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
    grooming_employee(frm)
    {
        frappe.call({
            method:"vet_care.vet_care.doctype.grooming_form.grooming_form.get_grooming_employee_fullname",
            args:{'employee':frm.doc.grooming_employee},
            callback: function(r) { 
                if(r.message)
                {
                    frm.set_value("grooming_employee_fullname", r.message); 
                    frm.refresh_fields();
                }
            }
        })
        
    },
    groomer(frm)
    {
        frappe.call({
            method:"vet_care.vet_care.doctype.grooming_form.grooming_form.get_groomer_fullname",
            args:{'groomer':frm.doc.groomer},
            callback: function(r) {
                if(r.message)
                {
                     frm.set_value('groomer_fullname',r.message)
                      frm.refresh_fields();
                }
            }
        })
       
    },
    type_of_grooming(frm)
    {
        if(frm.doc.type_of_grooming == "Clinical")
        {
            frm.set_value("naming_series", "CGM-.#####");          
            frm.refresh_fields();
        }
        if(frm.doc.type_of_grooming == "Pet Shop")
        {
            frm.set_value("naming_series", "PGM-.#####");          
            frm.refresh_fields();
        }
    },
    customer_name(frm)
    {
        set_patient_query(frm);
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
                        frm.set_value("customer_fullname", r.message.customer_fullname);
                          
                        frm.refresh_fields();

                    }
            }     });
        }
       
    },
   
});

frappe.ui.form.on("Grooming Patient Details", {
    patient(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        console.log( row.patient )
        if (row.patient) {
            frappe.call({
                method: "vet_care.vet_care.doctype.euthanasia_form.euthanasia_form.get_patient_details",
                args:{'patient':[{'patient':row.patient}]},
                callback: function (r) {
                    if (r.message) {
                      
                        frappe.model.set_value(cdt, cdn, "breed", r.message.breed);
                        frappe.model.set_value(cdt, cdn, "species", r.message.species);
                        frappe.model.set_value(cdt, cdn, "age", r.message.dob_age);
                        frappe.model.set_value(cdt, cdn, "patient_fullname", r.message.patient_fullname);
                    }
                }
            });
        }
    }
});
