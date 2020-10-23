sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Ranked", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().attachRouteMatched("RouteRanked", () => {
        oLocal.setProperty("/menu/currentView", "ranked");
      });
    },
  });
});
