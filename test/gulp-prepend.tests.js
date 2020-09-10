'use strict';

const { assert } = require('chai');
const File = require('vinyl');
const eventStream = require('event-stream');
const { Readable } = require('stream');
const { Buffer } = require('buffer');

const prepend = require('../index');

const content = 'class TestCase { constructor() { this._my = null; } }';

function createReadableStream(arr) {
	const readableStream = new Readable();
	arr.forEach((item) => readableStream.push(item));
	readableStream.push(null);

	return readableStream;
}

function removeBlanks(str) {
	return str.replace(/ /g, '');
}

describe('Prepend single line', () => {
	const singleLine = '/** @version 0.1.0 **/';

	it('With a stream', (done) => {
		const fakeFile = new File({
			contents: createReadableStream(content.split(' ')),
		});

		const textPrepend = prepend(singleLine);
		textPrepend.write(fakeFile);

		textPrepend.once('data', (file) => {
			assert.isTrue(file.isStream());

			// Buffer the content of the result
			file.contents.pipe(eventStream.wait((err, data) => {
				assert.isNull(err);
				assert.strictEqual(data.toString(), `${singleLine}${removeBlanks(content)}`);
				done();
			}));
		});
	});

	it('With a buffer', (done) => {
		const fakeFile = new File({
			contents: Buffer.from(content),
		});

		const textPrepend = prepend(singleLine);
		textPrepend.write(fakeFile);

		textPrepend.once('data', (file) => {
			assert.isTrue(file.isBuffer());

			assert.strictEqual(file.contents.toString('utf8'), `${singleLine}${content}`);
			done();
		});
	});

	it('With null content', (done) => {
		const fakeFile = new File({
			contents: null
		});

		const textPrepend = prepend(singleLine);
		textPrepend.write(fakeFile);

		textPrepend.once('data', (file) => {
			assert.isTrue(file.isNull());
			done();
		});
	});
});