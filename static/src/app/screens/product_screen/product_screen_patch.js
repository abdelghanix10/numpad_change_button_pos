/** @odoo-module */

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(ProductScreen.prototype, {
    _getCurrentOrder() {
        return this.pos.selectedOrder || this.pos.get_order?.();
    },

    _getCurrentOrderline(order) {
        if (!order) {
            return null;
        }
        return order.getSelectedOrderline ? order.getSelectedOrderline() : order.get_selected_orderline?.();
    },

    _getLineQuantity(line) {
        return line.getQuantity ? line.getQuantity() : line.get_quantity?.() || 0;
    },

    _setLineQuantity(line, qty) {
        if (line.setQuantity) {
            line.setQuantity(qty);
        } else if (line.set_quantity) {
            line.set_quantity(qty);
        }
    },

    _removeLine(order, line) {
        if (order.removeOrderline) {
            order.removeOrderline(line);
        } else if (order.remove_orderline) {
            order.remove_orderline(line);
        }
    },

    getNumpadButtons() {
        const buttons = super.getNumpadButtons(...arguments);
        const config = this.pos.config;
        if (!config.iface_custom_numpad) {
            return buttons;
        }

        const order = this._getCurrentOrder();
        const selectedLine = this._getCurrentOrderline(order);
        const hasLine = Boolean(selectedLine);
        const currentQty = hasLine ? this._getLineQuantity(selectedLine) : 0;

        return buttons.map((button) => {
            if (button.value === "discount" && config.iface_numpad_replace_discount) {
                return {
                    ...button,
                    value: "plus",
                    text: "+",
                    disabled: !hasLine,
                    class: `${button.class || ""} numpad-plus fw-bold`,
                };
            } else if (button.value === "price" && config.iface_numpad_replace_price) {
                const disableMinus = !hasLine || (config.iface_numpad_min_qty_one && currentQty <= 1);
                return {
                    ...button,
                    value: "minus",
                    text: "-",
                    disabled: disableMinus,
                    class: `${button.class || ""} numpad-minus fw-bold`,
                };
            } else if (button.value === "-" && config.iface_numpad_replace_sign) {
                return {
                    ...button,
                    value: "delete",
                    text: _t("Delete"),
                    disabled: !hasLine,
                    class: `${button.class || ""} numpad-delete fw-bold`,
                };
            }
            return button;
        });
    },

    async onNumpadClick(buttonValue) {
        const config = this.pos.config;
        if (!config.iface_custom_numpad) {
            return super.onNumpadClick(...arguments);
        }

        const selectedOrder = this._getCurrentOrder();
        const selectedLine = this._getCurrentOrderline(selectedOrder);

        if (buttonValue === "plus") {
            if (selectedLine) {
                const newQty = this._getLineQuantity(selectedLine) + 1;
                this._setLineQuantity(selectedLine, newQty);
                this.numberBuffer?.reset();
            }
            return;
        } else if (buttonValue === "minus") {
            if (selectedLine) {
                const currentQty = this._getLineQuantity(selectedLine);
                const newQty = currentQty - 1;

                if (newQty <= 0) {
                    if (!config.iface_numpad_min_qty_one) {
                        await this._confirmAndRemoveLine(selectedOrder, selectedLine);
                    }
                } else {
                    this._setLineQuantity(selectedLine, newQty);
                }
                this.numberBuffer?.reset();
            }
            return;
        } else if (buttonValue === "delete") {
            if (selectedLine) {
                await this._confirmAndRemoveLine(selectedOrder, selectedLine);
                this.numberBuffer?.reset();
            }
            return;
        }

        return super.onNumpadClick(...arguments);
    },

    async _confirmAndRemoveLine(order, line) {
        if (this.pos.config.iface_numpad_confirm_delete && this.dialog) {
            const productName = line.get_full_product_name?.() || line.product_id?.display_name || _t("this item");
            this.dialog.add(ConfirmationDialog, {
                title: _t("Remove Order Line"),
                body: _t("Are you sure you want to remove %s from the order?", productName),
                confirm: () => {
                    this._removeLine(order, line);
                },
                cancel: () => {},
            });
        } else {
            this._removeLine(order, line);
        }
    },
});