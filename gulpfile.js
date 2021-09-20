const project_folder = "build";
const source_folder = "source";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/"
  },
  source: {
    html: source_folder + "/*.html",
    css: source_folder + "/sass/style.scss",
    js: source_folder + "/js/index.js",
    img: source_folder + "/img/**/*.{jpg,png,svg}",
    fonts: source_folder + "/fonts/*.{woff2,woff}",
    ico: source_folder + "/*.ico",
    webmanifest: source_folder + "/*.webmanifest"
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/sass/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg}"
  }
};


const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const squoosh = require("gulp-libsquoosh");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// HTML

const html = () => {
  return gulp.src(path.source.html)
    .pipe(gulp.dest(project_folder));
}

exports.html = html;

// Styles

const css = () => {
  return gulp.src(path.source.css)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest(path.build.css))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(path.build.css))
    .pipe(sync.stream());
}

exports.css = css;

// JavaScript

const scripts = () => {
  return gulp.src(path.source.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(terser())
    .pipe(
      rename({
        extname: ".min.js"
      })
      )
    .pipe(gulp.dest(path.build.js))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Optimize Images

const optimizeImages = () => {
  return gulp.src(project_folder + "/img/**/*.{jpg,png,svg}")
    .pipe(squoosh())
    .pipe(gulp.dest(path.build.img))
}

exports.optimizeImages = optimizeImages;

// Webp

const createWebp = () => {
  return gulp.src(source_folder + "/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest(path.build.img));
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src(source_folder + "/img/icons/*.svg")
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(path.build.img));
}

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
    path.source.fonts,
    path.source.ico,
    path.source.webmanifest,
    path.source.img,
  ], {
    base: source_folder
  })
  .pipe(gulp.dest(project_folder))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del(project_folder);
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: project_folder
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch(path.watch.css, gulp.series(css));
  gulp.watch(path.watch.js, gulp.series(scripts));
  gulp.watch(path.watch.html, gulp.series(html, reload));
}

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    html,
    css,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

exports.default = gulp.series(
  clean,
  copy,
  gulp.parallel(
    html,
    css,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
