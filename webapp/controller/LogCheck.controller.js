sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.LogCheck", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().attachRouteMatched("RouteLogCheck", () => {
        oLocal.setProperty("/menu/currentView", "logcheck");
      });
    },
  });
});
