sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.TipAdmin", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().attachRouteMatched("RouteTipAdmin", () => {
        oLocal.setProperty("/menu/currentView", "tipadmin");
      });
    },
  });
});
