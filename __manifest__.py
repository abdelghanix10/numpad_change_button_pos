{
    'name': 'POS Custom Numpad Buttons',
    'version': '1.0',
    'category': 'Point of Sale',
    'summary': 'Change Numpad buttons behavior in POS',
    'description': """
        Updates Numpad buttons:
        - '%' to '+' (Add quantity)
        - 'Price' to '-' (Subtract quantity)
        - '+/-' to 'Delete'
        Includes a setting in POS Config to enable/disable.
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
