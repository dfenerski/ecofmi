sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Info", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().attachRouteMatched("RouteInfo", () => {
        oLocal.setProperty("/menu/currentView", "info");
      });
    },
  });
});
