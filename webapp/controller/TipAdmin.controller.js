sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.TipAdmin", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().getRoute("RouteTipAdmin").attachPatternMatched(() => {
        oLocal.setProperty("/menu/currentView", "tipadmin");
      });
    },
    handleNewTipSubmit: function () {
      const oLocal = this.getModel("local");
      const oData = oLocal.getProperty("/newTipData");
      const oDB = this.getModel("firebase").getObject("/firestore");
      oDB.collection("tips").add({ ...oData, points: 0, voters: [] }).then(() => {
        sap.m.MessageToast.show("Tip added!");
      }).catch(() => {
        sap.m.MessageToast.show("Could not add tip!");
      }).finally(() => {
        for (let sProp in oData) {
          oData[sProp] = "";
        }
        oLocal.setProperty("/newTipData", oData);
      });
    },
    handleDeleteTip: function (oEvent) {
      const sKey = oEvent.getSource().getCustomData()[0].getValue();
      const oDB = this.getModel("firebase").getObject("/firestore");
      oDB
        .collection("tips")
        .doc(sKey)
        .delete()
        .then(function () {
          sap.m.MessageToast.show("Tip deleted!");
        }).catch(() => {
          sap.m.MessageToast.show("Could not delete tip!");
        });
    }
  });
});
