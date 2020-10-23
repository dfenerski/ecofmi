sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Analytics", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().attachRouteMatched("RouteAnalytics", () => {
        oLocal.setProperty("/menu/currentView", "analytics");
      });
    },
  });
});
