sap.ui.define(
  ["./BaseController", "sap/ui/core/Fragment", "sap/m/MessageBox"],
  function (BaseController, Fragment, MessageBox) {
    "use strict";

    return BaseController.extend("fmi.Eco.controller.Root", {
      viewData: {
        logInDialog: null,
        signUpDialog: null,
      },
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
      handleLogInDialogOpen: function () {
        if (!this.viewData.logInDialog) {
          Fragment.load({
            name: "fmi.Eco.fragment.LogIn",
            id: this.getView().getId(),
            controller: this,
          }).then((oFragment) => {
            this.getView().addDependent(oFragment);
            this.viewData.logInDialog = oFragment;
            this.viewData.logInDialog.open();
          });
        } else {
          this.viewData.logInDialog.open();
        }
      },
      handleSignUpDialogOpen: function () {
        if (!this.viewData.signUpDialog) {
          Fragment.load({
            name: "fmi.Eco.fragment.SignUp",
            id: this.getView().getId(),
            controller: this,
          }).then((oFragment) => {
            this.getView().addDependent(oFragment);
            this.viewData.signUpDialog = oFragment;
            this.viewData.signUpDialog.open();
          });
        } else {
          this.viewData.signUpDialog.open();
        }
      },
      handleLogInSubmited: function (oEvent) {
        const oDialog = oEvent.getSource().getParent();
        const oLocal = this.getModel("local");
        const oData = oLocal.getProperty("/loginData");
        for (let sVal in oData) {
          if (oData[sVal] === "") {
            return;
          }
        }
        sap.ui.core.BusyIndicator.show(0);
        const oAuth = this.getModel("firebase").getObject("/auth");
        let bOK = false;
        oAuth
          .signInWithEmailAndPassword(oData.email, oData.password)
          .then(function (oCreds) {
            bOK = true;
          })
          .catch(function (oErr) {
            bOK = false;
            MessageBox.error("The following error occured: " + oErr.message);
          })
          .finally(function () {
            if (bOK) {
              oDialog.close();
            }
            sap.ui.core.BusyIndicator.hide();
          });
      },
      handleSignUpSubmited: function () {
        const oDialog = oEvent.getSource().getParent();
        const oLocal = this.getModel("local");
        const oData = oLocal.getProperty("/signupData");
        for (let sVal in oData) {
          if (oData[sVal] === "") {
            return;
          }
        }
        sap.ui.core.BusyIndicator.show(0);
        const oAuth = this.getModel("firebase").getObject("/auth");
        const oDB = this.getModel("firebase").getObject("/firestore");
        oAuth
          .createUserWithEmailAndPassword(oData.email, oData.password)
          .then(function (oCreds) {
            oDB
              .collection("users")
              .doc(oCreds.user.uid)
              .set({
                lastName: oData.lastName,
                firstName: oData.firstName,
                email: oData.email,
              })
              .then(function () {
                oDialog.close();
                sap.ui.core.BusyIndicator.hide();
              });
          });
      },
    });
  }
);
