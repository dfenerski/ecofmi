sap.ui.define(
    [
        "sap/ui/core/Control",
        "../../util/HCTemplates",
        "../../util/formatter",
        "../highcharts/highcharts",
    ],
    function (
        Control,
        HCUtil,
        DataFunctions,
        IconTabButton,
        formatter
    ) {
        "use strict";
        const oControl = Control.extend("com.Sproutboard.lib.controls.HighChart", {
            formatter: formatter,
            dataConfig: {},
            chartConfig: {},
            model: null,
            metadata: {
                properties: {
                    type: {
                        type: "string",
                        defaultValue: "basicPie",
                    },
                    theme: {
                        type: "string",
                        defaultValue: "light",
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
                this.model = this.getParent().getBindingContext("local").getModel();
            },
            onAfterRendering: function () {
                Control.prototype.onAfterRendering.apply(this, arguments);
                this.dataConfig = this.assembleConfig(this.getType());
                if (!this.getBindingContext("local").getObject("isRendered")) {
                    //not rendered
                    this.chartConfig = Highcharts.chart(
                        "_" + this.getChartId(),
                        this.dataConfig
                    );
                    this.getChartData(this.getDataPreset());
                    this.getModel()
                        .setProperty(this.getBindingContext("local") + "/isRendered", true);
                } else {
                    if (this.chartConfig.renderTo === undefined) {
                        //rendered
                        this.chartConfig =
                            Highcharts.charts.find((oChart) => {
                                if (oChart) {
                                    return oChart.renderTo.id === "_" + this.getChartId();
                                } else {
                                    return false;
                                }
                            }) || {};
                    }
                }
            },

            getChartData: function (sPreset) {
                //getPresetData, process it
            },

            assembleConfig: function (sType) {
                let oConfig = {},
                    oTitle,
                    oSubtitle;
                switch (sType) {
                    case "basicPie":
                        oConfig = { ...HCTemplates.basicPie };
                        if (this.getLegendOnTheSide()) {
                            oConfig.legend = { ...HCUtil.templates.sideLegend };
                        }
                        break;
                    case "basicDonut":
                        oConfig = { ...HCTemplates.basicDonut };
                        if (this.getLegendOnTheSide()) {
                            oConfig.legend = { ...HCUtil.templates.sideLegend };
                        }
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
            updateTitle: function (sTitle) {
                this.setTitle(sTitle);
                this.getHeader().getContent()[0].setText(sTitle);
            },
            updateDescription: function (sDescription) {
                this.setDescription(sDescription);
                this.getHint().setTitle(sDescription);
            },
            updateType: function (sType) {
                this.setType(sType);
                this.getModel().setProperty(
                    this.getBindingContext("local").getPath() + "/isRendered",
                    false
                );
                this.invalidate();
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
