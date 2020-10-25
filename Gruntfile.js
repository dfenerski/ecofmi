module.exports = function (grunt) {
    grunt.initConfig({
        openui5_preload: {
            app: {
                options: {
                    resources: {
                        cwd: "webapp",
                        expand: true,
                        prefix: "fmi.Eco",
                        src: [
                            "model/*.json",
                            "view/*.view.xml",
                            "fragment/*.fragment.xml",
                            "controller/*.controller.js",
                            "util/*.js",
                            "lib/classes/*.js",
                            "lib/controls/*.js",
                            "Component.js",
                        ],
                    },
                    dest: "dest",
                    compress: true,
                },
                components: true,
                filter: function (sPath) {
                    return !sPath.includes("lib")
                },
            },
        },
        exec: {
            compileapp: {
                cmd:
                    "npx babel webapp --out-dir dest --plugins=@babel/plugin-transform-spread,@babel/plugin-proposal-optional-chaining --presets=@babel/preset-env --copy-files",
            },
        },
    });
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-openui5");

    grunt.registerTask("default", "standard build", function () {
        const aTasks = [
            "exec:compileapp",
            "openui5_preload:app",
        ];
        grunt.task.run(aTasks);
    });
};
