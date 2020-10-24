sap.ui.define(
  [
    "sap/ui/core/Control",
    "../../util/HCTemplates",
    "../../util/HCDataBuilder",
    "../../util/formatter",
    "../highcharts/highcharts",
  ],
  function (Control, HCTemplates, DataBuilder, formatter) {
    "use strict";
    const oControl = Control.extend("com.Sproutboard.lib.controls.HighChart", {
      formatter: formatter,
      dataConfig: {},
      chartConfig: {},
      metadata: {
        properties: {
          chartId: {
            type: "string",
            defaultValue: "basicPie",
          },
          type: {
            type: "string",
            defaultValue: "basicPie",
          },
          title: {
            type: "string",
            defaultValue: "",
          },
          description: {
            type: "string",
            defaultValue: "",
          },
          dataPreset: {
            type: "string",
            defaultValue: "",
          },
        },
        aggregations: {
          header: {
            type: "sap.m.OverflowToolbar",
            multiple: false,
            singularName: "header",
          },
          hint: {
            type: "sap.m.Popover",
            multiple: false,
            singularName: "hint",
          },
          content: {
            type: "sap.ui.core.HTML",
            multiple: false,
            singularName: "content",
          },
        },
      },
      init: function () {
        Control.prototype.init.apply(this, arguments);
        this.setContent(
          new sap.ui.core.HTML({
            content: "<div style='height: calc(100% - 32px)'><div></div></div>",
          })
        );
      },
      onAfterRendering: function () {
        Control.prototype.onAfterRendering.apply(this, arguments);
        this.dataConfig = this.assembleConfig(this.getType());
        //not rendered
        this.chartConfig = Highcharts.chart(
          this.getContent().getId(),
          this.dataConfig
        );
        this.setChartData(this.getDataPreset());
      },

      setChartData: function (sPreset) {
        const oLocal = this.getModel();
        if (oLocal) {
          if (oLocal.getProperty("/dataLoaded")) {
            const oData = DataBuilder[sPreset](oLocal);
            this.chartConfig.xAxis[0].setCategories(oData.categories);
            this.chartConfig.addSeries({
              id: sPreset,
              name: sPreset,
              data: oData.series,
              color: "lightgreen",
            });
            this.chartConfig.reflow();
            console.log(oData);
          } else {
            setTimeout(() => {
              this.setChartData(sPreset);
            }, 500);
          }
        }
      },

      assembleConfig: function (sType) {
        let oConfig = {},
          oTitle,
          oSubtitle;
        switch (sType) {
          case "basicPie":
            oConfig = { ...HCTemplates.basicPie };
            break;
          case "basicDonut":
            oConfig = { ...HCTemplates.basicDonut };
            break;
          case "basicColumn":
            oConfig = { ...HCTemplates.basicColumn };
            break;
          case "basicBar":
            oConfig = { ...HCTemplates.basicBar };
            break;
          case "basicLine":
            oConfig = { ...HCTemplates.basicLine };
            break;
          default:
            console.error("Unsupported chart type!");
            break;
        }
        oTitle = {
          title: {
            text: null,
          },
        };
        oSubtitle = {
          subtitle: {
            text: null,
          },
        };
        return {
          ...oConfig,
          ...oTitle,
          ...oSubtitle,
          exporting: {
            buttons: [],
          },
        };
      },
      renderer: {
        apiVersion: 2,
        render: function (oRm, oControl) {
          oRm.openStart("div", oControl).class("highchartControl").openEnd();
          if (oControl.getHeader()) {
            oRm.renderControl(oControl.getHeader());
          }
          if (oControl.getContent()) {
            oRm.renderControl(oControl.getContent());
          }
          oRm.close("div");
        },
      },
    });
    return oControl;
  }
);
