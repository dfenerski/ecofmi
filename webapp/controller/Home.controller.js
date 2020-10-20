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
  });
});
