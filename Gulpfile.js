var gulp = require('gulp');
var glob = require('glob');
var fs = require('fs-extra');

gulp.task('copy', function() {
  ['index.js', 'app.js', 'Gulpfile.js', 'package.json',
    'app/global', 'app/index'
  ].forEach(function(f) {
    var src = '../predator-demo/' + f;
    var dest = __dirname + '/app/templates/' + f;
    fs.copySync(src, dest);
  });

  // remove view_build
  glob.sync('app/templates/app/*/view_build').forEach(function(d) {
    fs.removeSync(__dirname + '/' + d);
  });
});