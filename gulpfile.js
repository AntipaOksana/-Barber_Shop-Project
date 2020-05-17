const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel');


gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});


gulp.task('styles:compile', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('scripts', () =>
    gulp.src('src/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(rename('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/js/'))
);

gulp.task('copy:html', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('build'));
});

gulp.task('copy:image', function () {
    return gulp.src('./src/image')
      .pipe(gulp.dest('build'));
});

gulp.task('watch',  () => {
    gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('src/scripts/**/*.js', gulp.series('scripts'));
    gulp.watch('src/index.html', gulp.series('copy:html'));
    gulp.watch('src/image/**.*', gulp.series('copy:image'));
});

gulp.task('default', gulp.series(
    gulp.parallel('styles:compile', 'scripts', 'copy:html', 'copy:image'),
    gulp.parallel('watch', 'server')
));
