function set_custom_buttons(frm) {
    const custom_buttons = [
        {
            label: __('Animal Overview'),
            onclick: async function() {
                const sales_person = await _get_practitioner(frm.doc.physician);
                frappe.route_options = {'animal': frm.doc.patient, 'sales_person': sales_person.employee};
                
                frappe.set_route('Form', 'Animal Overview');
               
            },
        }
    ];
    custom_buttons.forEach((custom_button) => {
        frm.add_custom_button(custom_button['label'], custom_button['onclick']);
    });
}


async function _get_practitioner(physician) {
    const { message: employee } = await frappe.db.get_value('Healthcare Practitioner', physician, 'employee');
    return employee;
}
