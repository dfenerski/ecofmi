/* eslint-disable */
sap.ui.define(["./formatter"], function (formatter) {
  "use strict";

  const HCDataBuilder = {
    logsByDay: (oLocal) => {
      const oData = {
        series: [],
        categories: [],
      };
      const aLogs = oLocal.getProperty("/userLogs");
      const aDates = [];
      aLogs.forEach((oLog) => {
        const sDate = formatter.getDateFromStamp(oLog.timestamp);
        if (!aDates.includes(sDate)) {
          aDates.push(sDate);
        }
      });
      const aVals = [];
      for (let i = 0; i < aDates.length; i++) {
        aVals.push(
          aLogs.filter(
            (oLog) => formatter.getDateFromStamp(oLog.timestamp) === aDates[i]
          ).length
        );
      }
      oData.categories = aDates;
      oData.series = aVals;
      return oData;
    },
    ptsByDay: (oLocal) => {
      const oData = {
        series: [],
        categories: [],
      };
      const aLogs = oLocal.getProperty("/userLogs");
      const aDates = [];
      aLogs.forEach((oLog) => {
        const sDate = formatter.getDateFromStamp(oLog.timestamp);
        if (!aDates.includes(sDate)) {
          aDates.push(sDate);
        }
      });
      const aVals = [];
      for (let i = 0; i < aDates.length; i++) {
        const aCurr = aLogs.filter(
          (oLog) => formatter.getDateFromStamp(oLog.timestamp) === aDates[i]
        );
        let iPts;
        if (aCurr.length === 1) {
          iPts = aCurr[0].points;
        } else {
          iPts = aCurr.reduce((acc, cur) => {
            return acc.points + cur.points;
          });
        }
        aVals.push(iPts);
      }
      oData.categories = aDates;
      oData.series = aVals;
      return oData;
    },
    userComparison: (oLocal) => {
      const oData = {
        series: [],
        categories: [],
      };
      const oUser = oLocal.getProperty("/userData");
      const aUsers = [];
      const aPoints = [];
      aUsers.push(`${oUser.firstName} ${oUser.lastName}`);
      aPoints.push(oUser.points);
      const aRankedUsers = oLocal
        .getProperty("/rankedUsers")
        .filter((el) => el.id !== oUser.id);
      for (let i = 0; i < 10; i++) {
        if (!aRankedUsers[i]) {
          break;
        }
        aUsers.push(`${aRankedUsers[i].firstName} ${aRankedUsers[i].lastName}`);
        aPoints.push(aRankedUsers[i].points);
      }
      oData.categories = aUsers;
      oData.series = aPoints;
      return oData;
    },
  };

  return HCDataBuilder;
});
