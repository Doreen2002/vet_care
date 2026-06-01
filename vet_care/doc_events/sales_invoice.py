import frappe

from frappe import _


def validate(doc, method):
    pass
    # if not _is_pet_related_to(doc.patient, doc.customer):
    #     frappe.throw(_('Pet is not related to the customer'))


def _is_pet_related_to(pet, customer):
    filters = {'parent': pet, 'customer': customer}
    pet_relations = frappe.get_all('Pet Relation', filters=filters)
    return len(pet_relations) > 0


def on_submit(doc, method):
    if doc.pricing_rules:
        for pr in doc.pricing_rules:
            pricing_rule_name = frappe.db.get_value("Pricing Rule", {"title":"Full Grooming Service"}, "name")
            if pr.pricing_rule == pricing_rule_name and pr.item_code == "Full Grooming Service":
                    customer = frappe.get_doc("Customer", doc.customer)
                    customer.custom_full_service_loyalty_count = 0
                    customer.save()
                    frappe.db.commit()
    elif doc.items:
        for item in doc.items:
            if item.item_code == "Full Grooming Service":
                customer = frappe.get_doc("Customer", doc.customer)
                customer.custom_full_service_loyalty_count += item.qty
                customer.save()
                frappe.db.commit()

              
