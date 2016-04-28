'use strict';

const fs = require('fs');
const watch = require('gulp-watch');

const build = require('../lib/build-index');
const notifyChanged = require('../lib/notify-changed');
const paths = require('../lib/paths');

module.exports = (gulp) => {
  function process (file) {
    if (file) notifyChanged(file);
    return gulp.src('src/index.hbs')
      .pipe(build(['app.js'], ['app.css']))
      .pipe(gulp.dest(paths.devDir));
  }

  gulp.task('watch-html', () => {
    watch('src/index.hbs', process);
    return process();
  });

  const scriptsManifest = `${paths.prodDir}/scripts-manifest.json`;
  const stylesheetsManifest = `${paths.prodDir}/stylesheets-manifest.json`;

  gulp.task('html-prod', ['scripts-prod', 'stylesheets-prod'], function() {
    const scriptName = JSON.parse(fs.readFileSync(scriptsManifest))['app.js'];
    const stylesheetName = JSON.parse(fs.readFileSync(stylesheetsManifest))['app.css'];

    fs.unlinkSync(scriptsManifest);
    fs.unlinkSync(stylesheetsManifest);

    return gulp.src('src/index.hbs')
      .pipe(build([scriptName], [stylesheetName]))
      .pipe(gulp.dest(paths.prodDir));
  });
};