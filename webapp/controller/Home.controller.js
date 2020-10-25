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

    return BaseController.extend("fmi.Eco.controller.Home", {
      viewData: {
        addLogDialog: null,
      },
      onInit: function () {
        const oLocal = this.getOwnerComponent().getModel("local");
        this.getRouter()
          .getRoute("RouteHome")
          .attachPatternMatched(() => {
            oLocal.setProperty("/menu/currentView", "home");
          });
        // this.testClassification();
      },
      testClassification: function () {
        const oImg = loadImage(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Can%28Easy_Open_Can%29.JPG/360px-Can%28Easy_Open_Can%29.JPG"
        );
        setTimeout(() => {
          classifier.classify(oImg).then((oRes) => {
            console.log(oRes);
          });
        }, 500);
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
        if (!(oFile.type.includes("video") || oFile.type.includes("image"))) {
          return;
        }
        // const toBase64 = (file) => new Promise((resolve, reject) => {
        //   const reader = new FileReader();
        //   reader.readAsDataURL(file);
        //   reader.onload = () => resolve(reader.result);
        //   reader.onerror = error => reject(error);
        // });
        // toBase64(oFile).then((sBase64) => {
        oLogData.timestamp = dNow.getTime();
        oLogData.files.push({
          contentType: oFile.type,
          name: oFile.name,
          ref: oFile,
          // src: sBase64
        });
        // });

        oLocal.setProperty("/newLogData", oLogData);
      },
      handleLogSubmit: function (oEvent) {
        oEvent.getSource().getParent().close();
        const oLocal = this.getModel("local");
        const oDB = this.getModel("firebase").getObject("/firestore");
        const oStorage = this.getModel("firebase").getObject("/storage");
        const oLogData = oLocal.getProperty("/newLogData");
        if (oLogData.files.length === 0) {
          sap.m.MessageToast.show("Please upload at least 1 file!");
          return;
        }
        const oUser = oLocal.getProperty("/userData");
        const oLog = {
          timestamp: oLogData.timestamp,
          publisherId: oLocal.getProperty("/userData/id"),
          status: "pending",
          points: 0,
          files: [],
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
        const aUploadPromises = oLogData.files.map((oFile) => {
          return oStorage
            .child("logs/" + oFile.name)
            .put(oFile.ref, { contentType: oFile.contentType });
        });
        Promise.all(aUploadPromises)
          .then((aSnaps) => {
            Promise.all(aSnaps.map((oSnap) => oSnap.ref.getDownloadURL()))
              .then((aUrls) => {
                bOk = true;
                oLog.files = aUrls.map((el, i) => {
                  return {
                    url: el,
                    contentType: oLogData.files[i].contentType,
                  };
                });
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
                      oLocal.setProperty("/newLogData", {
                        timestamp: 0,
                        message: "",
                        files: [],
                      });
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
            width: "170px",
            densityAware: false,
            detailBox: [
              new LightBox({
                imageContent: [
                  new LightBoxItem({
                    imageSrc: oContext.getProperty("url"),
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
