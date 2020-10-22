sap.ui.define(["./BaseController", "sap/ui/core/Fragment"], function (
  BaseController,
  Fragment
) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Home", {
    viewData: {
      addLogDialog: null,
    },
    onInit: function () {
      // if (sap.ui.Device.system.phone)
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
      const oLog = {
        timestamp: oLogData.timestamp,
        publisherId: oLocal.getProperty("/userData/id"),
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
              bOk = true;
            })
            .catch((oErr) => {
              MessageBox.error("The following error occured: " + oErr.message);
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
  });
});
