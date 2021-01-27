var gulp = require('gulp'),
    concat = require('gulp-concat'),
    templateCache = require('gulp-angular-templatecache'),
    gulpDocs = require('gulp-ngdocs'),
    //apidoc = require('gulp-apidoc'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename');

gulp.task('ngdocs', [], function () {

    var options = {
    html5Mode: false
  }
  return gulp.src('app/**/*.js')
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest('./docs'));
});

// gulp.task('apidoc', function(done){
//           apidoc({
//             src: "BACKEND_DOCS/",
//             dest: "BACKEND_DOCS/docs/"
//           },done);
// });


gulp.task('scripts', function() {
  return gulp.src( ["app/sqd.module.js",
             "app/sqd.config.js",
             "app/sqd.run.js",
             "app/sqd.controller.js",
                    "app/shared/params.constant.js",
                         "app/interfaces/menu/menu.module.js",
               "app/interfaces/menu/menu.config.js",
             "app/interfaces/menu/menu.controller.js",
             "app/components/squidles/squidles.module.js",
             "app/components/squidles/squidles.config.js",
             "app/components/squidles/squidles.controller.js",
             "app/components/squidles/squidle.controller.js",
             "app/components/squidles/sqdPause.directive.js",
             "app/components/info/info.module.js",
             "app/components/info/info.config.js",
             "app/components/info/info.controller.js",
             "app/components/help/help.module.js",
             "app/components/help/help.config.js",
             "app/components/help/help.controller.js",
               "app/components/welcome/welcome.module.js",
              "app/components/welcome/welcome.config.js",
             "app/components/welcome/welcome.controller.js",
             "app/components/blank/blank.module.js",
             "app/components/blank/blank.config.js",
               "app/shared/squidles.service.js",
               "app/shared/resources.service.js",
               "app/shared/credits.service.js",
               "app/shared/receipts.service.js",
               "app/shared/stores.service.js",
               "app/shared/exceptions.service.js",
               "app/shared/history.service.js",
               "app/shared/files.service.js",
               "app/shared/emails.service.js",
               "app/shared/profiles.service.js",
               "app/shared/time.service.js",
               "app/shared/faqs.service.js",
               "app/shared/sqdInput/noSpaces.directive.js",
               "app/shared/sqdInput/sqdInput.directive.js",
               "app/shared/sqdInput/sqdInput.controller.js",
               "app/shared/sqdNumber/restrictMinMax.directive.js",
               "app/shared/sqdNumber/sqdNumber.directive.js",
               "app/shared/sqdNumber/sqdNumber.controller.js",
               "app/shared/sqdAvatar/sqdAvatar.directive.js",
               "app/shared/sqdAvatar/sqdAvatar.controller.js",
               "app/shared/directiveIf.directive.js"




])
    .pipe(concat('js/production.js'))
    .pipe(gulp.dest(''));
});

var config = {
        htmltemplates : 'app/**/*.html',
        templateCache: {
            file: 'js/templates.js',
            options: {
                module: 'templates',
                root: 'app/',
                standalone: true
            }
        }
    };

gulp.task('templates', function() {
    return gulp.src(config.htmltemplates)
    .pipe(templateCache(config.templateCache.file, config.templateCache.options))
    .pipe(gulp.dest(''))
});

gulp.task('watch', function() {
    gulp.watch('app/**/*.js', ['scripts', 'ngdocs']);
     gulp.watch('app/**/*.html', ['templates']);
    gulp.watch('BACKEND_DOCS/*.js', ['apidoc']);
    gulp.watch('./scss/**/*.scss', ['sass']);
});


gulp.task('sass', function(done) {
  gulp.src('scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});

gulp.task('build', function(){

    gulp.src(['./index.html', '404.html', 'privacy.html', 'terms.html', 'faq.json', 'robots.txt', 'apple-app-site-association', 'verify.html','apple-touch-icon.png'])
        .pipe(gulp.dest('../www/'))
/*    gulp.src(['ng-grid/ng-grid.css', 'jquery.ui/themes/base/jquery.ui.theme.css'])
        .pipe(gulp.dest('build/css/'))*/
    gulp.src('./img/**/*')
        .pipe(gulp.dest('../www/img/'))
    gulp.src('./css/**/*')
        .pipe(gulp.dest('../www/css/'))
    gulp.src('./lib/**/*')
        .pipe(gulp.dest('../www/lib/'))
    gulp.src('./js/**/*')
        .pipe(gulp.dest('../www/js/'))
    gulp.src('./.well-known/**/*')
        .pipe(gulp.dest('../www/.well-known/'))

});

gulp.task('uglify', function(){
    require('./uglify.js');
})



gulp.task('default', ['scripts', 'templates', 'ngdocs', 'sass', 'watch']);
