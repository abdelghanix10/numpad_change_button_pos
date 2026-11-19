/** @odoo-module */

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";

function stripColorListClasses(className = "") {
    return className.replace(/\bo_colorlist_item_\S+/g, "").trim();
}

patch(ProductScreen.prototype, {
    _getCurrentOrder() {
        return (
            this.currentOrder ||
            this.pos.getOrder?.() ||
            this.pos.selectedOrder ||
            this.pos.get_order?.() ||
            null
        );
    },

    _getCurrentOrderline(order) {
        if (!order) {
            return null;
        }
        return (
            order.getSelectedOrderline?.() ||
            order.get_selected_orderline?.() ||
            order.selectedOrderline ||
            null
        );
    },

    _getLineQuantity(line) {
        if (!line) {
            return 0;
        }
        if (typeof line.getQuantity === "function") {
            return line.getQuantity();
        }
        if (typeof line.get_quantity === "function") {
            return line.get_quantity();
        }
        return Number(line.qty ?? line.quantity ?? 0);
    },

    _setLineQuantity(line, qty) {
        if (!line) {
            return;
        }
        if (typeof line.setQuantity === "function") {
            line.setQuantity(qty);
        } else if (typeof line.set_quantity === "function") {
            line.set_quantity(qty);
        } else {
            line.qty = qty;
        }
    },

    _removeLine(order, line) {
        if (!line) {
            return;
        }
        if (typeof order?.removeOrderline === "function") {
            order.removeOrderline(line);
        } else if (typeof order?.remove_orderline === "function") {
            order.remove_orderline(line);
        } else if (typeof line.delete === "function") {
            line.delete();
        } else if (typeof line.setQuantity === "function") {
            line.setQuantity("remove");
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
                    class: `${stripColorListClasses(button.class)} numpad-plus fw-bold`.trim(),
                };
            } else if (button.value === "price" && config.iface_numpad_replace_price) {
                const disableMinus = !hasLine || (config.iface_numpad_min_qty_one && currentQty <= 1);
                return {
                    ...button,
                    value: "minus",
                    text: "-",
                    disabled: disableMinus,
                    class: `${stripColorListClasses(button.class)} numpad-minus fw-bold`.trim(),
                };
            } else if (button.value === "-" && config.iface_numpad_replace_sign) {
                return {
                    ...button,
                    value: "delete",
                    text: _t("Delete"),
                    disabled: !hasLine,
                    class: `${stripColorListClasses(button.class)} numpad-delete fw-bold`.trim(),
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
        const dialog = this.dialog || this.env?.services?.dialog;
        if (this.pos.config.iface_numpad_confirm_delete && dialog) {
            const productName =
                line.getFullProductName?.() ||
                line.get_full_product_name?.() ||
                line.full_product_name ||
                line.product_id?.display_name ||
                _t("this item");

            dialog.add(ConfirmationDialog, {
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