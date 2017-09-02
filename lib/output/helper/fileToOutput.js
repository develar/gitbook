var path = require('path');

var PathUtils = require('../../utils/path');
var LocationUtils = require('../../utils/location');

/**
 * Convert a filePath (absolute) to a filename for output
 *
 * @param {Output} output
 * @param {String} filePath
 * @return {String}
 */
function fileToOutput(output, filePath, extension = '.html') {
    var book = output.getBook();
    var readme = book.getReadme();
    var fileReadme = readme.getFile();

    if (
        path.basename(filePath, path.extname(filePath)) == 'README' ||
        (fileReadme.exists() && filePath == fileReadme.getPath())
    ) {
        filePath = path.join(path.dirname(filePath), 'index' + extension);
    } else {
        filePath = PathUtils.setExtension(filePath, extension);
    }

    return LocationUtils.normalize(filePath);
}

module.exports = fileToOutput;
