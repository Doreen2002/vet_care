// Copyright (c) 2025, 9T9IT and contributors
// For license information, please see license.txt

frappe.ui.form.on("Registration Form", {
	refresh(frm) {
        frappe.db.get_doc('VetCare Terms Settings').then(doc => {
            if(doc)
            {
                cur_frm.set_df_property("html_editor_rvye","options", doc.registration_terms);
                
                cur_frm.refresh_fields();
            }
        });
	},
});


