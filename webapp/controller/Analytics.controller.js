sap.ui.define(["./BaseController", "../lib/controls/Highchart"], function (
  BaseController,
  Highchart
) {
  "use strict";

  return BaseController.extend("fmi.Eco.controller.Analytics", {
    onInit: function () {
      const oLocal = this.getOwnerComponent().getModel("local");
      this.getRouter().getRoute("RouteAnalytics").attachPatternMatched(() => {
        oLocal.setProperty("/menu/currentView", "analytics");
        try {
          setTimeout(() => {
            this.byId("chartCarousel").getPages().forEach((oChart) => oChart.chartConfig.reflow());
          }, 500)
        } catch (e) { }
      });
    },
    userChartsFactory: function (sIdSuffix, oContext) {
      const oLocal = this.getModel("local");
      const sPath = oContext.getPath();
      const oControl = new Highchart({
        chartId: `{local>${sPath}/chartId}`,
        type: `{local>${sPath}/type}`,
        title: `{local>${sPath}/title}`,
        description: `{local>${sPath}/description}`,
        dataPreset: `{local>${sPath}/dataPreset}`,
        header: new sap.m.OverflowToolbar({
          content: [
            new sap.m.Title({
              text: `{local>${sPath}/title}`,
            }),
            new sap.m.Button({
              type: "Transparent",
              icon: "sap-icon://hint",
            }),
            new sap.m.ToolbarSpacer(),
          ],
        }),
        hint: new sap.m.Popover({
          title: `{local>${sPath}/description}`,
          placement: "Bottom",
        }),
      });
      oControl.setModel(oLocal);
      this._attachPopoverOnMouseover(
        oControl.getHeader().getContent()[1],
        oControl.getHint()
      );
      return oControl;
    },
    _attachPopoverOnMouseover: function (oTargetControl, oTooltip) {
      oTargetControl.addEventDelegate(
        {
          onmouseover: this._showPopover.bind(this, oTargetControl, oTooltip),
          onmouseout: this._clearPopover.bind(this, oTooltip),
        },
        this
      );
    },
    _showPopover: function (oTargetControl, oTooltip) {
      this._timeId = setTimeout(function () {
        oTooltip.openBy(oTargetControl);
      }, 500);
    },
    _clearPopover: function (oTooltip) {
      clearTimeout(this._timeId) || oTooltip.close();
    },
  });
});
