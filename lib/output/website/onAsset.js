var path = require('path');
const fsExtra = require('fs-extra-p');

/**
    Copy an asset to the output folder

    @param {Output} output
    @param {Page} page
*/
async function onAsset(output, asset) {
    const outputPath = path.resolve(output.getOptions().get('root'), asset);
    await fsExtra.outputFile(outputPath, await output.getBook().getContentFS().read(asset))
    return output
}

module.exports = onAsset;
