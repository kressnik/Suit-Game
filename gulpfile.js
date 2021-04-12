const browsersync = require("browser-sync").create();
const gulp = require('gulp');
const fs = require('fs');
const autoprefixer = require("gulp-autoprefixer");
const scss = require("gulp-sass");
const groupMedia = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const del = require("del");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const fileinclude = require("gulp-file-include");
const cleanCss = require("gulp-clean-css");
const newer = require('gulp-newer');

const webp = require('imagemin-webp');
const webpcss = require("gulp-webpcss");
const webphtml = require('gulp-webp-html');

const fonter = require('gulp-fonter');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

const PROJECT_DIR = 'dist';
const SOURCE_DIR = "src";
const BROWSER_PORT = 3000;

const path = {
	build: {
		html: `${PROJECT_DIR}/`,
		css: `${PROJECT_DIR}/css/`,
		js: `${PROJECT_DIR}/js/`,
		images: `${PROJECT_DIR}/img/`,
    fonts: `${PROJECT_DIR}/fonts/`,
		videos: `${PROJECT_DIR}/videos/`
	},
	src: {
		favicon: `${SOURCE_DIR}/img/favicon.{jpg,png,svg,gif,ico,webp}`,
		html: [`${SOURCE_DIR}/*.html`, `!${SOURCE_DIR}/_*.html`],
		css: `${SOURCE_DIR}/scss/style.scss`,
		js: [`${SOURCE_DIR}/js/app.js`, `${SOURCE_DIR}/js/vendors.js`],
		images: [`${SOURCE_DIR}/img/**/*.{jpg,png,svg,gif,ico,webp}`, '!**/favicon.*'],
    	fonts: `${SOURCE_DIR}/fonts/*.ttf`,
		videos: `${SOURCE_DIR}/videos/*.*`
	},
	watch: {
		html: `${SOURCE_DIR}**/*.html`,
		css: `${SOURCE_DIR}/scss/**/*.scss`,
		js: `${SOURCE_DIR}/js/**/*.js`,
		images: `${SOURCE_DIR}/img/**/*.{jpg,png,svg,gif,ico,webp}`
	},
	clean: `./${PROJECT_DIR}/`
}

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: `./${PROJECT_DIR}/`
		},
		port: BROWSER_PORT,
		notify: false
	})
}
function html() {
  return gulp.src(path.src.html)
    .pipe(plumber())
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(gulp.dest(path.build.html))
		.pipe(browsersync.stream())
}
function css() {
  return gulp.src(path.src.css)
    .pipe(plumber())
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(groupMedia())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss(
			{
				webpClass: "._webp",
				noWebpClass: "._no-webp"
			}
		))
		.pipe(gulp.dest(path.build.css))
		.pipe(cleanCss())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(gulp.dest(path.build.css))
		.pipe(browsersync.stream())
}
function js() {
  return gulp.src(path.src.js, {})
    .pipe(plumber())
		.pipe(fileinclude())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(gulp.dest(path.build.js))
		.pipe(browsersync.stream())
}
function images() {
	return gulp.src(path.src.images)
		.pipe(newer(path.build.images))
		.pipe(
			imagemin([
				webp({
					quality: 75
				})
			])
		)
		.pipe(
			rename({
				extname: ".webp"
			})
		)
		.pipe(gulp.dest(path.build.images))
		.pipe(gulp.src(path.src.images))
		.pipe(newer(path.build.images))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(gulp.dest(path.build.images))
}
function fonts() {
	gulp.src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(gulp.dest(path.build.fonts));
	return gulp.src(path.src.fonts)
		.pipe(ttf2woff2())
    .pipe(gulp.dest(path.build.fonts))
		.pipe(browsersync.stream());
};

function favicon() {
	return gulp.src(path.src.favicon)
		.pipe(plumber())
		.pipe(
			rename({
				extname: ".ico"
			})
		)
		.pipe(gulp.dest(path.build.html))
}
function videos() {
	return gulp.src(path.src.videos)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.videos))
}

function fontsOtf() {
	return gulp.src(`./${SOURCE_DIR}/fonts/*.otf`)
		.pipe(plumber())
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(gulp.dest(`./${SOURCE_DIR}/fonts/`));
}

function fontsStyle(params) {
	let fileContent = fs.readFileSync(`${SOURCE_DIR}/scss/fonts.scss`);
	if (fileContent == '') {
		fs.writeFile(`${SOURCE_DIR}/scss/fonts.scss`, '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let cFontname = '';
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (cFontname != fontname) {
						fs.appendFile(`${SOURCE_DIR}/scss/fonts.scss`, `@include font("${fontname}", "${fontname}", "400", "normal");\r\n`, cb);
					}
					cFontname = fontname;
				}
			}
		})
	}
}
function cb() { }
function clean(params) {
	return del(path.clean);
}
function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, fontsOtf, gulp.parallel(html, css, js, favicon, images, videos), fonts, gulp.parallel(fontsStyle));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.videos = videos;
exports.favicon = favicon;
exports.fonts_otf = fontsOtf;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
