sap.ui.define(
  [
    "./BaseController",
    "../util/CollectionListeners",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
  ],
  function (BaseController, Listeners, Fragment, MessageBox) {
    "use strict";

    return BaseController.extend("fmi.Eco.controller.Root", {
      viewData: {
        logInDialog: null,
        signUpDialog: null,
        subscribedListeners: [],
      },
      onInit: function () {
        this.attachAuthListener();
        this.addPrototypes();
      },
      attachAuthListener: function () {
        const oAuth = this.getModel("firebase").getObject("/auth");
        const oLocal = this.getModel("local");
        oAuth.onAuthStateChanged((oUser) => {
          if (oUser) {
            const oDB = this.getModel("firebase").getObject("/firestore");
            oDB
              .collection("users")
              .doc(oUser.uid)
              .get()
              .then(function (oSnapshot) {
                const oData = oSnapshot.data();
                oData.id = oUser.uid;
                oLocal.setProperty("/userData", oData);
              })
              .then(() => {
                Promise.all([
                  Listeners.userLogs.call(this),
                  Listeners.rankedUsers.call(this),
                ]).then((aResponses) => {
                  oLocal.setProperty("/dataLoaded", true);
                  aResponses.forEach((oRes) => {
                    this.viewData.subscribedListeners.push(oRes);
                  });
                });
              });
          } else {
            this.viewData.subscribedListeners.forEach((fnListener) => {
              fnListener();
            });
          }
        });
      },
      addPrototypes: function () {
        String.prototype.capitalize = function () {
          return this.charAt(0).toUpperCase() + this.slice(1);
        };
      },
      toggleMenuExpanded: function () {
        const oToolPage = this.byId("rootPage");
        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        if (
          oToolPage
            .getMainContents()[0]
            .getCurrentPage()
            .getControllerName() === "fmi.Eco.controller.Analytics"
        ) {
          setTimeout(() => {
            try {
              oToolPage
                .getMainContents()[0]
                .getCurrentPage()
                .byId("chartCarousel")
                .getPages()
                .forEach((oChart) => oChart.chartConfig.reflow());
            } catch (e) {
              console.warn(e);
            }
          }, 500);
        }
      },
      handleMenuNav: function (oEvent) {
        const sKey = oEvent.getParameter("item").getKey();
        switch (sKey) {
          case "home":
            this.navTo("RouteHome");
            break;
          case "ranked":
            this.navTo("RouteRanked");
            break;
          case "analytics":
            this.navTo("RouteAnalytics");
            break;
          case "info":
            this.navTo("RouteInfo");
            break;
        }
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
      handleSignUpSubmited: function (oEvent) {
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
                points: 0,
              })
              .then(function () {
                oDialog.close();
                sap.ui.core.BusyIndicator.hide();
              })
              .catch(function (oErr) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error(
                  "The following error occured: " + oErr.message
                );
              });
          })
          .catch(function (oErr) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("The following error occured: " + oErr.message);
          });
      },
    });
  }
);
