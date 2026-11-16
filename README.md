# POS Custom Numpad Buttons (Odoo 20)

This Odoo 20 addon customizes the Point of Sale (POS) Numpad to provide one-tap quantity adjustments and orderline removal, tailored for fast-paced retail, bakery, and restaurant environments.

## Features

When enabled on a POS terminal, the following Numpad buttons can be customized:

- **`%` (Discount) → `+`**: Increments the quantity of the selected orderline by `1`.
- **`Price` → `-`**: Decrements the quantity of the selected orderline by `1` (removes the line at `0`, or optionally stops at `1`).
- **`+/-` (Switch Sign) → `Delete`**: Immediately removes the selected orderline from the order.

### Additional Options
- **Granular Toggles**: Choose individually whether to replace `%`, `Price`, and/or `+/-`.
- **Stop `-` at Quantity 1**: Prevents cashiers from accidentally deleting a line when pressing `-` repeatedly.
- **Confirm Before Deleting Line**: Displays a confirmation dialog before removing an orderline.
- **Color-Coded Buttons**: Styles `+` (green), `-` (amber), and `Delete` (red) for quick visual recognition, and disables them automatically when no orderline is selected.
- **`numberBuffer` Synchronization**: Automatically resets the POS number buffer after `+`, `-`, or `Delete` so subsequent digit presses never concatenate with previous buffered inputs.

## Configuration

You can configure this feature from either location:
1. **Point of Sale → Configuration → Settings** (under the *POS Interface* section), or
2. **Point of Sale → Configuration → Point of Sale** (on an individual POS terminal form).
3. Enable **Custom Numpad Buttons** and adjust the sub-options as desired.
4. Save and open/reload the POS session.

## Technical Details

- **Module Name**: `numpad_change_button_pos`
- **Version**: `20.0.2.0.0`
- **Dependencies**: `point_of_sale`
- **License**: LGPL-3