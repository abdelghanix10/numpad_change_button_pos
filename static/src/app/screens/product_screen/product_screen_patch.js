import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(ProductScreen.prototype, {
  getNumpadButtons() {
    const buttons = super.getNumpadButtons();
    if (!this.pos.config.iface_custom_numpad) {
      return buttons;
    }

    return buttons.map((button) => {
      if (button.value === "discount") {
        return {
          ...button,
          value: "plus",
          text: "+",
          disabled: false,
          class: (button.class || "") + " numpad-plus",
        };
      } else if (button.value === "price") {
        return {
          ...button,
          value: "minus",
          text: "-",
          disabled: false,
          class: (button.class || "") + " numpad-minus",
        };
      } else if (button.value === "-") {
        return {
          ...button,
          value: "delete",
          text: _t("Delete"),
          class: (button.class || "") + " numpad-delete",
        };
      }
      return button;
    });
  },

  async onNumpadClick(buttonValue) {
    if (!this.pos.config.iface_custom_numpad) {
      return super.onNumpadClick(...arguments);
    }

    const selectedOrder = this.pos.selectedOrder;
    const selectedLine = selectedOrder?.getSelectedOrderline();

    if (buttonValue === "plus") {
      if (selectedLine) {
        selectedLine.setQuantity(selectedLine.getQuantity() + 1);
      }
      return;
    } else if (buttonValue === "minus") {
      if (selectedLine) {
        const newQty = selectedLine.getQuantity() - 1;
        if (newQty <= 0) {
          selectedOrder.removeOrderline(selectedLine);
        } else {
          selectedLine.setQuantity(newQty);
        }
      }
      return;
    } else if (buttonValue === "delete") {
      if (selectedLine) {
        selectedOrder.removeOrderline(selectedLine);
      }
      return;
    }

    return super.onNumpadClick(...arguments);
  },
});
