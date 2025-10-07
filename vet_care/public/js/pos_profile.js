frappe.ui.form.on('POS Profile', {

    onload:function(frm)
    {
        frappe.ui.form.on('POS Profile', {
            refresh: function(frm) {
                frappe.db.get_doc('DocType', 'Sales Invoice').then(doc => {
                    if (doc) {
                      
                        let naming_field = doc.fields.find(f => f.fieldname === 'naming_series');
                        if (naming_field && naming_field.options) {
                            
                            let series_options = naming_field.options.split('\n');
                           
                            frm.set_df_property('naming_series', 'options', series_options);
                          
                        }
                    }
                });
            }
        });
        
    }
});

