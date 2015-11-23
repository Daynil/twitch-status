var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var tsProject = tsc.createProject('tsconfig.json');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var jasmine = require('gulp-jasmine');

// Start a local server in base directory after compile-ts runs
gulp.task('serve', ['compile-ts', 'compile-scss'], function() {
	browserSync.init({
		server: {
			baseDir: ['./dist', './']
		}
	});
	
	// Watch for changes in html and ts files in base directory, reload if they occur
	gulp.watch(['./dist/html/*.html', './dist/index.html'], browserSync.reload);
	gulp.watch(['./src/ts/*.ts', './src/scss/*.scss'], ['src-watch']);
	
});

// Make sure the compile-ts task completes before reloading browsers
gulp.task('src-watch', ['compile-ts', 'compile-scss', 'reload']);

gulp.task('reload', ['compile-ts', 'compile-scss'], function() {
	browserSync.reload();
});

gulp.task('compile-scss', function() {
	var sourceScssFiles = [
		'./src/scss/*.scss'
	];
	
	var scssResult = gulp
		.src(sourceScssFiles)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError));
		
	var stream = scssResult
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist/css'));
		
	return stream;
});

gulp.task('compile-ts', function() {
	var sourceTsFiles = [
		'./src/ts/*.ts'			// Path to typscript files
		  // Reference to typings so tsc knows where it is
	];
	
	var tsResult = gulp
		.src(sourceTsFiles)
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));
	
	var stream = tsResult
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist/js'));
		
	return stream;
});

gulp.task('test', function() {
	gulp.run('run-test');
	gulp.watch(['./dist/js/display-service.spec.js'], ['run-test']);
});

gulp.task('run-test', function() {
	var filesForTest = ['./dist/js/display-service.spec.js'];
	return gulp.src(filesForTest)
		.pipe(jasmine());
});