const through = require('through2');
const { SourceNode, SourceMapConsumer } = require('source-map');
const { Buffer } = require('buffer');

// Helper 
function prependStream(prependText) {
	const stream = through();
	stream.write(prependText);

	return stream;
}

module.exports = function (str) {

	async function prependText(file, encoding, callback) {

		// Ignore empty file
		if (file.isNull()) {
			return callback(null, file);
		}

		// *** Update the source maps ***
		if (file.sourceMap) {
			const consumer = await new SourceMapConsumer(file.sourceMap);
			const sourceNode = SourceNode.fromStringWithSourceMap(file.contents.toString(), consumer);
			// Prepend the string
			sourceNode.prepend(str);
			// Update the source map of the file
			const generator = sourceNode.toStringWithSourceMap({ file: file.sourceMap.file });
			file.sourceMap = generator.map.toJSON();
		}

		// *** Update the file content ***
		// Handle buffers
		if (file.isBuffer()) {
			file.contents = Buffer.from(`${str}${file.contents}`);
		}

		// Handle streams
		if (file.isStream()) {
			file.contents = file.contents.pipe(prependStream(str));
		}

		return callback(null, file);
	}

	return through.obj(prependText);
};