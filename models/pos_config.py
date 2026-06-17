from odoo import fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    iface_custom_numpad = fields.Boolean(string="Custom Numpad Buttons", help="Change % to +, Price to -, and +/- to Delete", default=False)
