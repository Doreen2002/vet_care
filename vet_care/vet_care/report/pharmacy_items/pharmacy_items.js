// Copyright (c) 2026, 9T9IT and contributors
// For license information, please see license.txt

frappe.query_reports["Pharmacy Items"] = {
	"filters": [
		{
			"fieldname": "item_code",
			"label": __("Item Code"),
			"fieldtype": "Link",
			"options":"Item"
			
		},
		{
			"fieldname": "item_group",
			"label": __("Item Group"),
			"fieldtype": "Link",
			"options": "Item Group"
		},
		{
			"fieldname": "medicine_group",
			"label": __("Medicine Group"),
			"fieldtype": "Link",
			"options": "Medicine Group"
		},
		{
			"fieldname": "group_by_medicine_group",
			"label": __(" Group by Medicine Group"),
			"fieldtype": "Check",
		
		}
	]
};
