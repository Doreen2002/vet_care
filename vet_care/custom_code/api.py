import frappe

@frappe.whitelist()
def get_room_events(healthcare_practitioner):
    formatted_events = []
    users = frappe.db.get_list("Healthcare Practitioner", filters={"name":healthcare_practitioner},  fields=["name as id", "practitioner_name as title"])
    event_partcipants = frappe.db.get_all("Event Participants",  filters={"reference_docname":healthcare_practitioner} , fields=["parent as id",  "reference_docname as resourceId"])
    events = frappe.db.get_all("Event", filters={"event_type": "Public"}, fields=["name as id", "subject as title", "starts_on as start", "ends_on as end"])
    for event in events:
        for event_partcipant in event_partcipants:
            if event["id"] == event_partcipant["id"]:
                formatted_events.append({
                    "id": event["id"],
                    "title": event["title"],
                    "start": event["start"],
                    "end": event["end"],
                    "color": "#28811D",
                    "textColor": "#FFFFFF",
                    "resourceId": event_partcipant["resourceId"]
                })
    return {
        "users": users,
        "events": formatted_events
    }

@frappe.whitelist()
def create_patient_appointment(data):
    try:
        json_data = frappe._dict(frappe.parse_json(data))
        data = json_data
        new_event = frappe.get_doc({
            "doctype": "Event",
            "subject":  "Patient Appointment",
            "event_type": "Public",
            "starts_on": data.get('starts_on'),
            "ends_on": data.get('ends_on'),
            "all_day": 0,
            "status": "Open",
            "event_category": "Meeting",
        })
        new_event.append("event_participants", {
            "reference_doctype": "Patient",
            "reference_docname": data.get('patient')
        })
        new_event.append("event_participants", {
            "reference_doctype": "Healthcare Practitioner",
            "reference_docname": data.get('healthcare_practitioner')
        })
        new_event.save()
        frappe.db.commit()
        patient_appointment = frappe.get_doc({
            "doctype": "Patient Booking",
            "physician": data.get('healthcare_practitioner'),
            "patient": data.patient,
            "appointment_type": data.get('appointment_type'),
            "customer": data.get('customer'),
            "posting_date": data.get('starts_on'),
            "mobile_no": data.get('mobile_no') or "",
            "appointment_date": data.get('starts_on'),
            "appointment_time": data.get('starts_on'),
            "notes": data.get('notes'),
          
            })
        patient_appointment.save(ignore_permissions=True )
        patient_appointment.submit( )
        frappe.db.commit()
        return new_event.name
    except Exception as e:
        frappe.throw(f"Error {e}")