sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Play", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter()
        .getRoute("RoutePlay")
        .attachPatternMatched(() => {
          oLocal.setProperty("/menu/currentView", "play");
        });
    },
  });
});
