sap.ui.define(
  ["./BaseController", "sap/ui/core/Fragment", "sap/m/MessageBox"],
  function (BaseController, Fragment, MessageBox) {
    "use strict";

    return BaseController.extend("fmi.Eco.controller.Home", {
      viewData: {
        addLogDialog: null,
      },
      onInit: function () {
        const oLocal = this.getOwnerComponent().getModel("local");
        this.getRouter().attachRouteMatched("RouteHome", () => {
          oLocal.setProperty("/menu/currentView", "home");
        });
        // if (sap.ui.Device.system.phone)+
      },
      handleOpenLogDialog: function () {
        if (!this.viewData.addLogDialog) {
          Fragment.load({
            name: "fmi.Eco.fragment.AddLog",
            id: this.getView().getId(),
            controller: this,
          }).then((oFragment) => {
            this.getView().addDependent(oFragment);
            this.viewData.addLogDialog = oFragment;
            this.viewData.addLogDialog.open();
          });
        } else {
          this.viewData.addLogDialog.open();
        }
      },
      handleLogUpload: function (oEvent) {
        const oLocal = this.getModel("local");
        const oFile = oEvent.getSource().oFileUpload.files[0];
        const dNow = new Date();
        const oLogData = oLocal.getProperty("/newLogData");
        oLogData.timestamp = dNow.getTime();
        oLogData.file.contentType = oFile.type;
        oLogData.file.name = oFile.name;
        oLogData.file.ref = oFile;
        oLocal.setProperty("/newLogData", oLogData);
      },
      handleLogSubmit: function (oEvent) {
        oEvent.getSource().getParent().close();
        const oLocal = this.getModel("local");
        const oDB = this.getModel("firebase").getObject("/firestore");
        const oStorage = this.getModel("firebase").getObject("/storage");
        const oLogData = oLocal.getProperty("/newLogData");
        const oUser = oLocal.getProperty("/userData");
        const oLog = {
          timestamp: oLogData.timestamp,
          publisherId: oLocal.getProperty("/userData/id"),
          status: "pending",
          points: 0,
          messages: [
            {
              senderId: oUser.id,
              senderFullName: `${oUser.firstName} ${oUser.lastName}`,
              timestamp: oLogData.timestamp,
              value: oLogData.message,
            },
          ],
        };
        let bOk;
        sap.ui.core.BusyIndicator.show(0);
        oStorage
          .child("logs/" + oLogData.file.name)
          .put(oLogData.file.ref, { contentType: oLogData.file.contentType })
          .then(function (oSnapshot) {
            oSnapshot.ref
              .getDownloadURL()
              .then(function (sUrl) {
                console.log(
                  "File URL:",
                  sUrl,
                  "File type:",
                  oLogData.file.contentType
                );
                oLog.url = sUrl;
                oLog.contentType = oLogData.file.contentType;
                bOk = true;
              })
              .catch((oErr) => {
                MessageBox.error(
                  "The following error occured: " + oErr.message
                );
                bOk = false;
              })
              .finally(() => {
                if (bOk) {
                  oDB
                    .collection("logs")
                    .add(oLog)
                    .then(function (oRef) {
                      bOk = true;
                    })
                    .catch(function (oErr) {
                      sap.ui.core.BusyIndicator.hide();
                      MessageBox.error(
                        "The following error occured: " + oErr.message
                      );
                      bOk = false;
                    })
                    .finally(() => {
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageToast.show(
                        bOk ? "Item added!" : "Error adding item!"
                      );
                    });
                }
              });
          })
          .catch(function (oErr) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("The following error occured: " + oErr.message);
          });
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
            const aLogs = oLocal.getProperty("/userLogs");
            let sPath = "/userLogs/";
            sPath += aLogs.indexOf(aLogs.find((oLog) => oLog.id === sKey));
            sPath += "/";
            this.viewData.editLogDialog.setBindingContext(
              new sap.ui.model.Context(oLocal, sPath),
              "local"
            );
            this.viewData.editLogDialog.getCustomData()[0].setValue(sKey);
            this.viewData.editLogDialog.open();
          });
        } else {
          this.viewData.editLogDialog.getCustomData()[0].setValue(sKey);
          this.viewData.editLogDialog.open();
        }
      },
      handleDeleteLogRequest: function (oEvent) {
        const sKey = oEvent.getSource().getCustomData()[0].getValue();
        MessageBox.confirm("Do you really want to delete this log?", {
          icon: MessageBox.Icon.QUESTION,
          title: "Confirmation needed",
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          // emphasizedAction: MessageBox.Action.YES,
          onClose: (oAction) => {
            if (oAction === MessageBox.Action.YES) {
              sap.ui.core.BusyIndicator.show(0);
              //TODO deletion of associated file needed!
              const oDB = this.getModel("firebase").getObject("/firestore");
              oDB
                .collection("logs")
                .doc(sKey)
                .delete()
                .then(function () {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show("Item deleted!");
                });
            }
          },
        });
      },
    });
  }
);
