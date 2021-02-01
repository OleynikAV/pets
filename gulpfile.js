//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var gtag = require('gulp-gtag');
const ftp = require('vinyl-ftp');



//Порядок подключения css файлов
const cssFiles = [
    'node_modules/normalize.css/normalize.css',
   './src/scss/style.scss',
   './src/scss/header.scss',
   './src/scss/main.scss',
    './src/scss/aside.scss',
   './src/scss/footer.scss',
   './src/scss/media.scss',


];
//Порядок подключения js файлов
const jsFiles = [
   'node_modules/jquery/dist/jquery.min.js',
   './src/js/customs.js',
];

//Таск на стили CSS
function styles() {
   //Шаблон для поиска файлов CSS
   //Всей файлы по шаблону './src/css/**/*.css'
   return gulp.src(cssFiles)
   .pipe(sourcemaps.init())
   .pipe(sass())
   //Объединение файлов в один
   .pipe(concat('style.css'))
   //Добавить префиксы
   .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
   //Минификация CSS
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write('./'))
   //Выходная папка для стилей
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
}

//Таск на скрипты JS
function scripts() {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src(jsFiles)
       .pipe(babel())
   //Объединение файлов в один
   .pipe(concat('script.js'))
   //Минификация JS
   .pipe(uglify({
      toplevel: true
   }))
   //Выходная папка для скриптов
   .pipe(gulp.dest('./build/js'))
   .pipe(browserSync.stream());
}

//Удалить всё в указанной папке
function clean() {
   // return del(['build/!*'])
    return del.sync(['build/!*']);

}

//Просматривать файлы
function watch() {
   browserSync.init({
      server: {
          baseDir: ["src","build"]
      }
  });
  //Следить за CSS файлами
  gulp.watch('./src/scss/**/*.scss', styles)
  //Следить за JS файлами
  gulp.watch('./src/js/**/*.js', scripts)
  //При изменении HTML запустить синхронизацию
  gulp.watch("./src/*.html").on('change', browserSync.reload);
}

function runUseref(){
    return gulp.src('./src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('build'))
}

function images(){
    return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('build/images'))
}

let fontList = [
    'src/fonts/**/*'
];

function fonts() {
    return gulp.src(fontList)
        .pipe(gulp.dest('build/fonts'))
}

function gtagFunc(){
    gulp.src('src/index.html')
        .pipe(gtag({uid: 'UA-153778930-4'}))
        .pipe(gulp.dest('build/'));
}
gulp.task('deploy', function() {
    const conn = ftp.create({
        host:      'mememe.uastar.space',
        user:      'mememe-ftp',
        password:  '2jEArc39kkP2bfmC',
        parallel:  10,
        log: 'ftp.log',

    });

    const globs = [
        'build/**',
    ];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest('/html/'));/* url hosting*/
});

//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск для очистки папки build
gulp.task('del', clean);
//Копируем index.html в dist
gulp.task('useref', runUseref);
gulp.task('images', images);
gulp.task('fonts', fonts);
//Таск для отслеживания изменений
gulp.task('watch', watch);
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(gulp.parallel(images,styles,scripts,fonts,runUseref)));
//Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build','watch'));

