# gulp-prepend
[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/bGute/gulp-prepend/blob/master/LICENSE)

Simple Gulp plugin to prepend a string (e.g. license text) with gulp-sourcemaps support.

## Installing
Install the plugin as development dependency:
```
npm install gulp-prepend --save-dev
```

## Basic Usage
```javascript
const { src, dest } = require('gulp');
const prepend = require('gulp-prepend');

function prependString() {
	return src('./bundle.js')
		.pipe(prepend('/** \n* @version 0.1.0 \n*/'))
		.pipe(dest('./build'));
}

exports.prependString = prependString;
```

And with gulp-sourcemaps (example with browserify):
```javascript
const { src, dest } = require('gulp');
const prepend = require('gulp-prepend');

const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

function bundle() {
	return browserify({ debug: true, entries: './main.js' })
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(prepend('/** \n* @version 0.1.0 \n*/'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./build'));
}

exports.build = bundle;
```

## Licensing
The code in this project is licensed under MIT license.
