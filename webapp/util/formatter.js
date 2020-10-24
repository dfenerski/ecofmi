/* eslint-disable */
sap.ui.define([], function () {
  "use strict";

  const formatter = {
    getValidFormat: function (oFile) {
      return !!oFile?.type.includes("video");
    },
    getStatusState: function (sStatus) {
      switch (sStatus) {
        case "approved":
          return "Success";
        case "pending":
          return "Warning";
        case "rejected":
          return "Error";
        default:
          return "None";
      }
    },
    getDateFromStamp: function (iTime) {
      const dVal = new Date(iTime);
      return `${dVal.getDate() < 10 ? "0" + dVal.getDate() : dVal.getDate()}.${dVal.getMonth() + 1 < 10
        ? "0" + (dVal.getMonth() + 1)
        : dVal.getMonth() + 1
        }.${dVal.getFullYear()}`;
    },
    getStatusMessage: function (sStatus, iPoints) {
      switch (sStatus) {
        case "approved":
          return `Your Eco-Log has been approved. ${iPoints} Points have been awarded to your account.`;
        case "pending":
          return `Your Eco-Log is currently being reviewed. Please check it again soon for award-points!`;
        case "rejected":
          return `Your Eco-Log has been rejected. It may be blurred, broken, or against our community guidelines.`;
        default:
          return "None";
      }
    },
    getUserFullName: function (sFirstName, sLastName) {
      return sFirstName + " " + sLastName;
    },
    getUserRankedLeader: function (aUsers, sId) {
      return aUsers[0].id === sId;
    },
    getApprovedLogs: function (aData) {
      return aData.filter((el) => el.status === "approved").length;
    },
    getPendingLogs: function (aData) {
      return aData.filter((el) => el.status === "pending").length;
    },
    getRejectedLogs: function (aData) {
      return aData.filter((el) => el.status === "rejected").length;
    },
    getUserNotVoted: function (sId, aIds) {
      if (!aIds) {
        return false;
      }
      return !aIds.includes(sId);
    }
  };

  return formatter;
});
