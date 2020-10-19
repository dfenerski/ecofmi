sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
  ],
  function (Controller, UIComponent, History, Fragment) {
    "use strict";

    return Controller.extend("fmi.Eco.controller.BaseController", {
      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },
    });
  }
);
