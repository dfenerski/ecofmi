sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Root", {
    onInit: function () {
      var oAuth = this.getModel("firebase").getObject("/auth");
      oAuth.onAuthStateChanged(function (oUser) {
        if (oUser) {
        } else {
        }
      });
    },
    toggleMenuExpanded: function () {
      this.getModel("local").setProperty(
        "/menu/expanded",
        !this.getModel("local").getProperty("/menu/expanded")
      );
    },
  });
});
