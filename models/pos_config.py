from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    iface_custom_numpad = fields.Boolean(
        string="Custom Numpad Buttons",
        help="Enable custom numpad buttons (+, -, Delete).",
        default=False,
    )
    iface_numpad_replace_discount = fields.Boolean(
        string="Replace '%' with '+'",
        help="Replace the Discount (%) button with '+' to increment quantity by 1.",
        default=True,
    )
    iface_numpad_replace_price = fields.Boolean(
        string="Replace 'Price' with '-'",
        help="Replace the Price button with '-' to decrement quantity by 1.",
        default=True,
    )
    iface_numpad_replace_sign = fields.Boolean(
        string="Replace '+/-' with 'Delete'",
        help="Replace the '+/-' button with 'Delete' to remove the selected orderline.",
        default=True,
    )
    iface_numpad_min_qty_one = fields.Boolean(
        string="Stop '-' at Quantity 1",
        help="If enabled, pressing '-' stops at quantity 1 instead of removing the line at 0.",
        default=False,
    )
    iface_numpad_confirm_delete = fields.Boolean(
        string="Confirm Before Deleting Line",
        help="Ask for confirmation before removing an orderline via the Delete button.",
        default=False,
    )