sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Info", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().attachRouteMatched("RouteInfo", () => {
        oLocal.setProperty("/menu/currentView", "info");
      });
    },
    handleTipVote: function (oEvent, bUp) {
      const oLocal = this.getModel("local");
      const sKey = oEvent.getSource().getCustomData()[0].getValue();
      const oDB = this.getModel("firebase").getObject("/firestore");
      const oDocRef = oDB.collection("tips").doc(sKey);
      const sUserId = oLocal.getProperty("/userData/id");
      return oDocRef.update({
        points: firebase.firestore.FieldValue.increment(bUp ? 1 : -1),
        voters: firebase.firestore.FieldValue.arrayUnion(sUserId),
      });
    }
  });
});
