var autoprefixer = require('autoprefixer');
var bs = require('browser-sync');
var cssnano = require('gulp-cssnano');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var inject = require('gulp-inject');
var postcss = require('gulp-postcss');
var pump = require('pump');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var src = './src/',
	dist = './dist/',
	pkg = JSON.parse(fs.readFileSync('package.json'));

gulp.task('build:index', ['sass:prod', 'uglify:js'], function() {
	var target = gulp.src(src + 'index.html'),
		css = gulp.src(dist + '_res/css/main.min.' + pkg.version + '.css', {read: false}),
		js = gulp.src(dist + '_res/js/app.min.' + pkg.version + '.js', { read: false}),
		ga = gulp.src(src + '_res/js/ga.js');

	return target.pipe(inject(css, {ignorePath: '/dist/'}))
		.pipe(inject(js, {ignorePath: '/dist/'}))
		.pipe(inject(ga, {
			starttag: '<!-- inject:tracking:{{ext}} -->',
			transform: function(filePath, file) {
				return file.contents.toString('utf8');
			}
		}))
		.pipe(gulp.dest(dist));
});

gulp.task('clean:css', function() {
	return del([
		src + '_/res/css/*.css'
	]);
});

gulp.task('clean:js', function() {
	return del([
		src + '_res/js/*.js'
	]);
});

gulp.task('clean:dist', function() {
	return del([
		dist + '**/*',
		dist + '.htaccess',
		dist + '!.keep'
	]);
});

gulp.task('copy:res', ['clean:dist'], function() {
	return gulp.src([
			'**/*',
			'!**/audio/**',
			'!**/audio',
			'!**/css/**',
			'!**/css',
			'!**/js/**',
			'!**/js',
			'!**/sass/**',
			'!**/sass'
		],
		{
			cwd: src + '_res/'
		})
		.pipe(gulp.dest(dist + '_res/'));
});

gulp.task('sass:dev', ['clean:css'], function() {
	return gulp.src(src + '_res/sass/*.scss')
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(src + '_res/css/'))
		.pipe(bs.stream());
});

gulp.task('sass:prod', ['clean:dist'], function() {
	return gulp.src(src + '_res/sass/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(postcss([
			autoprefixer({browsers: ['last 2 versions']})
		]))
		.pipe(cssnano({safe: true}))
		.pipe(rename('main.min.' + pkg.version + '.css'))
		.pipe(gulp.dest(dist + '_res/css/'));
});

gulp.task('uglify:js', ['clean:dist'], function() {
	return pump([
		gulp.src(src + '_res/js/app.js'),
		uglify({mangle: false}),
		rename('app.min.' + pkg.version + '.js'),
		gulp.dest(dist + '_res/js/')
	]);
});

gulp.task('watch', function() {
	bs.init({
		files: [
			src + '_res/sass/*.scss',
			src + '_res/views/*.html',
			src + '_res/js/*.js'
		],
		open: false,
		proxy: 'hotcan.dev'
	});

	gulp.watch(src + '_res/sass/*.scss', ['sass:dev']);
	gulp.watch(src + '_res/views/*.html').on('change', bs.reload);
	gulp.watch(src + '_res/js/*.js').on('change', bs.reload);
});

gulp.task('build:prod', ['copy:res', 'build:index' ], function() {
	return gulp.src([
			src + '.htaccess',
			src + 'favicon.ico'
		])
		.pipe(gulp.dest(dist));
});
