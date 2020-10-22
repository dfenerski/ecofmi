sap.ui.define(["sap/ui/core/Control", "../video/video"], function (Control) {
  "use strict";
  const oControl = Control.extend("fmi.Eco.lib.controls.Video", {
    oModel: null,
    metadata: {
      properties: {
        url: {
          type: "string",
          defaultValue: "",
        },
        contentType: {
          type: "string",
          defaultValue: "",
        },
        ownerId: {
          type: "string",
          defaultValue: "",
        },
        height: {
          type: "string",
          defaultValue: "",
        },
        width: {
          type: "string",
          defaultValue: "",
        },
        poster: {
          type: "string",
          defaultValue: "/asset/video-placeholder.png",
        },
      },
    },
    renderer: {
      apiVersion: 2,
      render: function (oRm, oControl) {
        oRm
          .openStart("video", oControl)
          .class("video-js")
          .attr("controls")
          .attr("preload", "auto")
          .attr("width", "400")
          .attr("height", "400")
          .attr("poster", oControl.getPoster())
          .attr("data-setup", "{}")
          .openEnd();
        oRm
          .voidStart("source")
          .attr("src", oControl.getUrl())
          .attr("type", oControl.getContentType())
          .voidEnd();
        oRm.openStart("p").class("vjs-no-js").openEnd();
        oRm.text(
          "To view this video please enable JavaScript, and consider upgrading to a web browser that"
        );
        oRm
          .openStart("a")
          .attr("href", "https://videojs.com/html5-video-support/")
          .attr("target", "_blank");
        oRm.text("supports HTML5 video");
        oRm.close("a");
        oRm.close("p");
        oRm.close("video");
      },
    },
  });
  return oControl;
});
