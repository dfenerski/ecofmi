/* eslint-disable */
sap.ui.define([], function () {
  "use strict";

  const HCTemplates = {
    basicColumn: {
      chart: {
        type: "column",
        // height: 390,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        crosshair: true,
        type: "category",
      },
      yAxis: {
        title: false,
        min: 0,
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "",
          data: [],
        },
      ],
      legend: {
        enabled: false,
      },
    },
    basicPie: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        // height: 390,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: "<b>{point.y}</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Percentage",
          colorByPoint: true,
          data: [],
        },
      ],
    },
    basicLine: {
      chart: {
        // height: 390,
      },
      yAxis: {
        title: false,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: "category",
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      series: [
        {
          name: "",
          data: [],
        },
      ],
      legend: {
        enabled: false,
      },
    },
    basicBar: {
      chart: {
        type: "bar",
        // height: 390,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        title: false,
        labels: {
          overflow: "justify",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: "",
          data: [],
        },
      ],
      legend: {
        enabled: false,
      },
    },
    basicDonut: {
      credits: {
        enabled: false,
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        // height: 390,
      },
      tooltip: {
        pointFormat: "<b>{point.y}</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Percentage",
          colorByPoint: true,
          innerSize: "50%",
          data: [],
        },
      ],
    },
  };

  return HCTemplates;
});
