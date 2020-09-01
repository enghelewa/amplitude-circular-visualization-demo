const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const autoprefixer = require('autoprefixer');


style = () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(plugins.sass({
            includePaths: ['node_modules']
        }).on('error', swallowError))

        .pipe(plugins.sass().on('error', swallowError))

        .pipe(plugins.sourcemaps.init().on('error', swallowError))
        .pipe(plugins.postcss([autoprefixer()]).on('error', swallowError))
        .pipe(plugins.sourcemaps.write('.').on('error', swallowError))

        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

script = () => {
    return gulp.src('./src/js/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./dist/js'));
}

prefixer = () => {
    return gulp.src('./css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'));
}

image = () => {
    return gulp.src('./src/images/*')
        .pipe(plugins.imagemin([
            plugins.imagemin.gifsicle({interlaced: true}),
            plugins.imagemin.mozjpeg({quality: 60, progressive: true}),
            plugins.imagemin.optipng({optimizationLevel: 5}),
            plugins.imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/images'));
}

copyFiles = () => {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
}

watch = () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    browserSync.watch('./src/scss/**/*.scss', style).on('error', swallowError);
    browserSync.watch('./src/js/**/*.js', script).on('error', swallowError);
    browserSync.watch('./src/images/**/*', image).on('error', swallowError);
    browserSync.watch('./src/fonts/**/*', copyFiles).on('error', swallowError);
    browserSync.watch('./*.html').on('change', browserSync.reload).on('error', swallowError);
    browserSync.watch('./src/**/*').on('change', browserSync.reload).on('error', swallowError);
}

function swallowError(error){
    console.log(error.toString());
    this.emit('end');
}

exports.style = style;
exports.watch = watch;