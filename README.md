# POS Custom Numpad Buttons

This Odoo 19 addon modifies the Point of Sale Numpad behavior to provide quicker quantity adjustments and line removal.

## Features

When enabled, the following buttons on the Numpad are changed:

- **%** (Discount) becomes **+** : Increments the quantity of the selected line by 1.
- **Price** becomes **-** : Decrements the quantity of the selected line by 1 (removes the line if it reaches 0).
- **+/-** (Switch Sign) becomes **Delete** : Immediately removes the selected line from the order.

## Configuration

To enable this feature:

1. Go to **Point of Sale** -> **Configuration** -> **Settings**.
2. Locate the POS you want to modify.
3. Check the box **Custom Numpad Buttons**.
4. Save and restart/open the POS session.

## Technical Details

- **Module Name**: `numpad_change_button_pos`
- **Dependency**: `point_of_sale`
- **Compatibility**: Odoo 19.0+
- **Frontend Framework**: OWL (Odoo Web Library)
