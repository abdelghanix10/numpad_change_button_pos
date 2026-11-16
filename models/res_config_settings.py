from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_iface_custom_numpad = fields.Boolean(
        related='pos_config_id.iface_custom_numpad',
        readonly=False,
    )
    pos_iface_numpad_replace_discount = fields.Boolean(
        related='pos_config_id.iface_numpad_replace_discount',
        readonly=False,
    )
    pos_iface_numpad_replace_price = fields.Boolean(
        related='pos_config_id.iface_numpad_replace_price',
        readonly=False,
    )
    pos_iface_numpad_replace_sign = fields.Boolean(
        related='pos_config_id.iface_numpad_replace_sign',
        readonly=False,
    )
    pos_iface_numpad_min_qty_one = fields.Boolean(
        related='pos_config_id.iface_numpad_min_qty_one',
        readonly=False,
    )
    pos_iface_numpad_confirm_delete = fields.Boolean(
        related='pos_config_id.iface_numpad_confirm_delete',
        readonly=False,
    )