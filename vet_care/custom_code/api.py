import frappe
from erpnext.stock.doctype.warehouse.warehouse import get_child_warehouses

def custom_get_qty_amount_data_for_cumulative(pr_doc, doc, items=None):
    if items is None:
        items = []
    sum_qty, sum_amt = [0, 0]
    doctype = doc.get("parenttype") or doc.doctype

    date_field = (
        "transaction_date" if frappe.get_meta(doctype).has_field("transaction_date") else "posting_date"
    )

    child_doctype = f"{doctype} Item"
    apply_on = frappe.scrub(pr_doc.get("apply_on"))

    values = [pr_doc.valid_from, pr_doc.valid_upto]
    condition = ""

    if pr_doc.warehouse:
        warehouses = get_child_warehouses(pr_doc.warehouse)

        condition += """ and `tab{child_doc}`.warehouse in ({warehouses})
            """.format(child_doc=child_doctype, warehouses=",".join(["%s"] * len(warehouses)))

        values.extend(warehouses)

    if items:
        condition += " and `tab{child_doc}`.{apply_on} in ({items})".format(
            child_doc=child_doctype, apply_on=apply_on, items=",".join(["%s"] * len(items))
        )

        values.extend(items)

    data_set = frappe.db.sql(
        f""" SELECT `tab{child_doctype}`.stock_qty,
            `tab{child_doctype}`.amount,
             `tab{child_doctype}`.parent
        FROM `tab{child_doctype}`, `tab{doctype}`
        WHERE
            `tab{child_doctype}`.parent = `tab{doctype}`.name and `tab{doctype}`.{date_field}
            between %s and %s and `tab{doctype}`.docstatus = 1
            {condition} group by `tab{child_doctype}`.name
    """,
        tuple(values),
        as_dict=1,
    )
    
    parent_turple = []
    for data in data_set:
        sum_qty += data.get("stock_qty")
        sum_amt += data.get("amount")
        parent_turple.append(data.get("parent"))
    parents = list(set(parent_turple))
    total_qty = 0.0
    for par in parents:
        pricing_details = frappe.db.get_all("Pricing Rule Detail", filters={"parent": par, "docstatus":1, "pricing_rule":pr_doc.get("name")}, fields=['name'])
        if pricing_details:
            for pricing in pricing_details:
                total_qty = total_qty + pr_doc.get('min_qty') + 1 if pr_doc.get("free_item") else 0
    sum_qty = sum_qty - total_qty
    return [sum_qty, sum_amt]
    
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
