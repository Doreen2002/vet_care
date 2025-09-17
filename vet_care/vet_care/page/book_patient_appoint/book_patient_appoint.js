frappe.pages['book-patient-appoint'].on_page_load = function(wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Patient Appoinment Booking',
		single_column: true
	});
	// page.add_field({
	// 	label: 'Healthcare Practitioner',
	// 	fieldtype: 'Link',
	// 	fieldname: 'healthcare_practitioner',
	// 	options: 'Healthcare Practitioner',
	// 	change() {

			
	// 	}
	// });
	
	let calendar_area = $(`<div id="calendar"></div>`).appendTo(page.body);

	frappe.call({
		method: "vet_care.custom_code.api.get_room_events", // you'll define this
		args: {},
		callback: function(r) {
			const { users, events } = r.message;

			const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
				schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
				editable: true,
  				selectable: true,
				initialView: 'resourceTimeGridDay',
				headerToolbar: {
				  left: 'prev,next today',
				  center: 'title',
				  right: 'resourceTimeGridDay,resourceTimeGridWeek' 
				},
				views: {
				  resourceTimeGridDay: {
					buttonText: 'Day'
				  },
				  resourceTimeGridWeek: {
					buttonText: 'Week'
				  }
				},			  
				resourceAreaHeaderContent: 'Healthcare Practitioner',
				resources: users,
				events: events,  
			
			});
			calendar.on('dateClick', function(info) {
				apointment_info = {
					user: info.resource.id,
					start: frappe.datetime.get_datetime_as_string(info.date),
					end: info.endStr

				}
					bookAppointment(apointment_info);

				console.log(`clicked on ${info.date}` );
			  });
			calendar.render();
		}
	});
}




function bookAppointment(info) {
	let d = new frappe.ui.Dialog({
		title: 'Appointment Details ',
		fields: [
			{
				label: 'Customer',
				fieldname: 'customer',
				fieldtype: 'Link',
				options:'Customer'
			},
			{
				label: 'Patient',
				fieldname: 'patient',
				fieldtype: 'Link',
				options:'Patient',
				reqd: true,
				get_query: () => {
					let customer = d.get_value('customer');
					return {
						filters: {
							customer: customer
						}
					};
				}
				
				
			},
			
			{
				label: 'Healthcare Practitioner',
				fieldname: 'healthcare_practitioner',
				fieldtype: 'Link',
				options:'Healthcare Practitioner',
				reqd: true,
			},
			{
				label: 'Appointment Type',
				fieldname: 'appointment_type',
				fieldtype: 'Link',
				options:'Appointment Type',
				reqd: true,
			},
			{
				label: '',
				fieldname: 'column1',
				fieldtype: 'Column Break',
				
			},
		

			{
				label: 'Appointment Starts On',
				fieldname: 'starts_on',
				fieldtype: 'Datetime',
				default: info.start,
				reqd: true,
			},
			{
				label: ' Appointment Ends On',
				fieldname: 'ends_on',
				fieldtype: 'Datetime',
				default: info.start,
				reqd: true,
			},
			{
				label: '',
				fieldname: 'section1',
				fieldtype: 'Section Break',
				
			},
			
			{
				label: 'Notes',
				fieldname: 'notes',
				fieldtype: 'Small Text',
				
			},

			
		],
		size: 'large', 
		primary_action_label: 'Book',
		primary_action(values) {
		frappe.call({	
			"method": "vet_care.custom_code.api.create_patient_appointment",
			args: {
				"data": values
			},
			callback: function(r) {
				if(r.message){
					frappe.msgprint("Appointment Created Successfully");
				}
				d.hide();
				location.reload();

			}
			
			 })
		}
	});
	
	return d.show();
}



function formatFrappeDatetime(dateObj) {
    const pad = (n) => n < 10 ? '0' + n : n;

    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ` +
           `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
}
