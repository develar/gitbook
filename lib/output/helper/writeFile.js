var path = require('path');
var fs = require('../../utils/fs');
const fsExtra = require('fs-extra-p')
/**
    Write a file to the output folder

    @param {Output} output
    @param {String} filePath
    @param {Buffer|String} content
    @return {Promise}
*/
async function writeFile(output, filePath, content) {
    await fsExtra.outputFile(path.join(output.getRoot(), filePath), content)
    return output
}

module.exports = writeFile;
