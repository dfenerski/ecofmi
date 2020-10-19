sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
  "use strict";

  const oFirebaseConfig = {
    apiKey: "AIzaSyCVSQP6qQSa90kFS7DHR9mAZ43cT83xOlw",
    authDomain: "ecofmi.firebaseapp.com",
    databaseURL: "https://ecofmi.firebaseio.com",
    projectId: "ecofmi",
    storageBucket: "ecofmi.appspot.com",
    messagingSenderId: "784289702999",
    appId: "1:784289702999:web:e895b280daf1eac1f4ef12",
  };

  return {
    initializeFirebase: function () {
      firebase.initializeApp(oFirebaseConfig);
      const firestore = firebase.firestore();
      const auth = firebase.auth();
      const storage = firebase.storage().ref();
      const oFirebase = {
        firestore: firestore,
        auth: auth,
        storage: storage,
      };
      const firebaseModel = new JSONModel(oFirebase);
      return firebaseModel;
    },
  };
});
