sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Play", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter()
        .getRoute("RoutePlay")
        .attachPatternMatched(() => {
          oLocal.setProperty("/menu/currentView", "play");
        });
    },
    onAfterRendering: function () {
      const oCanvas = document.getElementById("canvas");
      oCanvas.addEventListener("gameover", (oEvent) => {
        MessageBox.show(
          `Your final score is ${oEvent.detail}. Press OK to play again!`, {
          icon: MessageBox.Icon.INFORMATION,
          title: "Oh no! You ran out of lives.",
          actions: [MessageBox.Action.OK],
          emphasizedAction: MessageBox.Action.OK,
          onClose: function (oAction) {
            location.reload();
          }
        }
        );
      })
      $.loadScript = function (url, callback) {
        $.ajax({
          url: url,
          dataType: 'script',
          success: callback,
          async: true
        });
      }
      $.loadScript("lib/game/min.js", () => {
        main();
      });
    }
  });
});
