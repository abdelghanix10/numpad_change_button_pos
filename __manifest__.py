{
    'name': 'POS Custom Numpad Buttons',
    'version': '20.0.2.0.0',
    'category': 'Sales/Point of Sale',
    'summary': 'Customize POS Numpad buttons (+, -, Delete) with safety options',
    'description': """
POS Custom Numpad Buttons (Odoo 20)
===================================
Customizes the POS Numpad buttons for faster cashier operation:
- '%' becomes '+' (Increment quantity by 1)
- 'Price' becomes '-' (Decrement quantity by 1)
- '+/-' becomes 'Delete' (Remove selected orderline)
- Configurable per-button toggles, stop-at-1 protection, and delete confirmation popup.
    """,
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_config_view.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'numpad_change_button_pos/static/src/app/**/*',
        ],
    },
    'installable': True,
    'license': 'LGPL-3',
}