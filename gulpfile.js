const package = require("./package.json");
const webpack = require("webpack");
const path = require("path");
const gulp = require("gulp");
const build = require("@microsoft/sp-build-web");
const gulpSequence = require("gulp-sequence");

// check if gulp dist was called
if (process.argv.indexOf("dist") !== -1) {
  // add ship options to command call
  process.argv.push("--ship");
}

const getAcronym = (str) => str.match(/\b(\w)/g).join("");

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.plugins.push(
      new webpack.DefinePlugin({
        SC_PREFIX: JSON.stringify(getAcronym(package.name).toLowerCase()),
      })
    );
    generatedConfiguration.resolve.alias = {
      "ui-toolkit": path.resolve(__dirname, "./lib/ui-toolkit/"),
    };
    return generatedConfiguration;
  },
});

build.addSuppression(
  "Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe."
);

// Create clean distrubution package
gulp.task("dist", gulpSequence("clean", "bundle", "package-solution"));
// Create clean development package
gulp.task("dev", gulpSequence("clean", "bundle", "package-solution"));

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(gulp);
