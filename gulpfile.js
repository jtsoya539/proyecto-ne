var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('compress', function (cb) {
  pump([
        gulp.src('web/js/*.js'),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest('web/dist')
    ],
    cb
  );
});