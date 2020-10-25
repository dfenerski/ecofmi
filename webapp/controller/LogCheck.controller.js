sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "../lib/controls/Video",
    "sap/m/Image",
    "sap/m/LightBox",
    "sap/m/LightBoxItem",
  ],
  function (
    BaseController,
    Fragment,
    MessageBox,
    Video,
    Image,
    LightBox,
    LightBoxItem
  ) {
    "use strict";

    return BaseController.extend("fmi.Eco.controller.LogCheck", {
      viewData: { editLogDialog: null },
      onInit: function () {
        const oLocal = this.getOwnerComponent().getModel("local");
        this.getRouter()
          .getRoute("RouteLogCheck")
          .attachPatternMatched(() => {
            oLocal.setProperty("/menu/currentView", "logcheck");
          });
      },
      confirmLogAction: function (oEvent, bApprove) {
        const sKey = oEvent.getSource().getCustomData()[0].getValue();
        MessageBox.confirm(
          `Do you really want to ${
            bApprove ? "approve" : "reject"
          } the selected Log?`,
          {
            icon: MessageBox.Icon.QUESTION,
            title: "Please confirm the selected action.",
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: (oAction) => {
              if (oAction === MessageBox.Action.YES) {
                const oDB = this.getModel("firebase").getObject("/firestore");
                const oDocRef = oDB.collection("logs").doc(sKey);
                return oDocRef.update({
                  status: bApprove ? "approved" : "rejected",
                });
              }
            },
          }
        );
      },
      handleOpenEditDialog: function (oEvent) {
        const sKey = oEvent.getSource().getCustomData()[0].getValue();
        if (!this.viewData.editLogDialog) {
          Fragment.load({
            name: "fmi.Eco.fragment.EditLog",
            id: this.getView().getId(),
            controller: this,
          }).then((oFragment) => {
            this.getView().addDependent(oFragment);
            this.viewData.editLogDialog = oFragment;
            const oLocal = this.getModel("local");
            const aLogs = oLocal.getProperty("/logs");
            let sPath = "/logs/";
            sPath += aLogs.indexOf(aLogs.find((oLog) => oLog.id === sKey));
            sPath += "/";
            this.viewData.editLogDialog.setBindingContext(
              new sap.ui.model.Context(oLocal, sPath),
              "local"
            );
            this.viewData.editLogDialog.getCustomData()[0].setValue(sKey);
            if (sap.ui.Device.system.phone) {
              this.viewData.editLogDialog
                .getContent()[0]
                .addStyleClass("phonePlayerWidth");
            } else {
              this.viewData.editLogDialog
                .getContent()[0]
                .addStyleClass("nonphonePlayerWidth");
            }
            this.viewData.editLogDialog.open();
          });
        } else {
          const oLocal = this.getModel("local");
          const aLogs = oLocal.getProperty("/logs");
          let sPath = "/logs/";
          sPath += aLogs.indexOf(aLogs.find((oLog) => oLog.id === sKey));
          sPath += "/";
          this.viewData.editLogDialog.setBindingContext(
            new sap.ui.model.Context(oLocal, sPath),
            "local"
          );
          this.viewData.editLogDialog.getCustomData()[0].setValue(sKey);
          this.viewData.editLogDialog.open();
        }
      },
      handleAddLogMessage: function (oEvent) {
        const oUser = this.getModel("local").getProperty("/userData");
        const oDialog = this.byId("editLogDialog");
        const oData = oDialog.getBindingContext("local").getObject();
        const sMsg = oEvent.getParameter("value");
        const dNow = new Date();
        const oMsg = {
          senderId: oUser.id,
          senderFullName: `${oUser.firstName} ${oUser.lastName}`,
          timestamp: dNow.getTime(),
          value: sMsg,
        };
        const sKey = oEvent.getSource().getCustomData()[0].getValue();
        const oDB = this.getModel("firebase").getObject("/firestore");
        const oDocRef = oDB.collection("logs").doc(sKey);
        oData.messages.push(oMsg);
        return oDocRef.update({
          messages: firebase.firestore.FieldValue.arrayUnion(oMsg),
        });
      },
      handleLogFilterSelect: function (oEvent) {
        const oTable = this.byId("logsTable");
        const oBinding = oTable.getBinding("items");
        const sKey = oEvent.getParameter("key");
        switch (sKey) {
          case "any":
            oBinding.filter();
            return;
          case "approved":
            oBinding.filter(
              new sap.ui.model.Filter("status", "EQ", "approved")
            );
            return;
          case "pending":
            oBinding.filter(new sap.ui.model.Filter("status", "EQ", "pending"));
            return;
          case "rejected":
            oBinding.filter(
              new sap.ui.model.Filter("status", "EQ", "rejected")
            );
            return;
        }
      },
      visualiseLogFile: function (sId, oContext) {
        const sContentType = oContext.getProperty("contentType");
        if (sContentType.includes("video")) {
          const oControl = new Video({
            url: oContext.getProperty("url"),
            contentType: oContext.getProperty("contentType"),
          }).addStyleClass("vjs-fill");
          return oControl;
        } else {
          const oControl = new Image({
            src: oContext.getProperty("url"),
            decorative: false,
            height: "25vh",
            densityAware: false,
            detailBox: [
              new LightBox({
                imageContent: [
                  new LightBoxItem({
                    imageSrc: oContext.getProperty("url"),
                    subtitle: `${oContext.getProperty(
                      "predictions/0/label"
                    )} ${oContext.getProperty("predictions/0/confidence")}`,
                  }),
                ],
              }),
            ],
          });
          return oControl;
        }
      },
    });
  }
);
