/* eslint-disable */
sap.ui.define([], function () {
  "use strict";

  const formatter = {
    getValidFormat: function (oFile) {
      return !!oFile?.type.includes("video");
    },
  };

  return formatter;
});
