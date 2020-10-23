sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "../util/formatter",
  ],
  function (Controller, UIComponent, formatter) {
    "use strict";

    return Controller.extend("fmi.Eco.controller.BaseController", {
      formatter: formatter,

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
      closeDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
      },
      navTo: function (sRoute) {
        return this.getRouter().navTo(sRoute);
      },
    });
  }
);
