/* eslint-disable */
sap.ui.define([], function () {
  "use strict";

  const CollectionListeners = {
    userLogs: function () {
      const oFirebase = this.getModel("firebase");
      const oDB = oFirebase.getObject("/firestore");
      const oLocal = this.getModel("local");
      const sUserId = oLocal.getProperty("/userData/id");
      return new Promise(function (resolve) {
        const oRef = oDB
          .collection("logs")
          .where("publisherId", "==", sUserId)
          .orderBy("timestamp", "desc")
          .onSnapshot(function (oSnapshot) {
            const aData = [];
            let oEntry = {};
            oSnapshot.docs.forEach((oDoc) => {
              oEntry = oDoc.data();
              oEntry.id = oDoc.id;
              aData.push(oEntry);
            });
            oLocal.setProperty("/userLogs", aData);
            resolve(oRef);
          });
      });
    },
    rankedUsers: function () {
      const oFirebase = this.getModel("firebase");
      const oDB = oFirebase.getObject("/firestore");
      const oLocal = this.getModel("local");
      return new Promise(function (resolve) {
        const oRef = oDB
          .collection("users")
          .orderBy("points", "desc")
          .onSnapshot(function (oSnapshot) {
            const aData = [];
            let oEntry = {};
            oSnapshot.docs.forEach((oDoc) => {
              oEntry = oDoc.data();
              oEntry.id = oDoc.id;
              aData.push(oEntry);
            });
            oLocal.setProperty("/rankedUsers", aData);
            resolve(oRef);
          });
      });
    },
    tips: function () {
      const oFirebase = this.getModel("firebase");
      const oDB = oFirebase.getObject("/firestore");
      const oLocal = this.getModel("local");
      return new Promise(function (resolve) {
        const oRef = oDB
          .collection("tips")
          .orderBy("points", "desc")
          .onSnapshot(function (oSnapshot) {
            const aData = [];
            let oEntry = {};
            oSnapshot.docs.forEach((oDoc) => {
              oEntry = oDoc.data();
              oEntry.id = oDoc.id;
              aData.push(oEntry);
            });
            oLocal.setProperty("/tips", aData);
            resolve(oRef);
          });
      });
    }
  };

  return CollectionListeners;
});
