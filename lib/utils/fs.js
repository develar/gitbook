var fs = require('graceful-fs');
var destroy = require('destroy');
var tmp = require('tmp');
var path = require('path');

const fsExtra = require('fs-extra-p')

var Promise = require('./promise');

// Write a stream to a file
function writeStream(filename, st) {
    var d = Promise.defer();

    var wstream = fs.createWriteStream(filename);
    var cleanup = function() {
        destroy(wstream);
        wstream.removeAllListeners();
    };

    wstream.on('finish', function () {
        cleanup();
        d.resolve();
    });
    wstream.on('error', function (err) {
        cleanup();
        d.reject(err);
    });

    st.on('error', function(err) {
        cleanup();
        d.reject(err);
    });

    st.pipe(wstream);

    return d.promise;
}

// Return a promise resolved with a boolean
function fileExists(filename) {
    var d = Promise.defer();

    fs.exists(filename, function(exists) {
        d.resolve(exists);
    });

    return d.promise;
}

// Generate temporary file
function genTmpFile(opts) {
    return Promise.nfcall(tmp.file, opts)
        .get(0);
}

// Generate temporary dir
function genTmpDir(opts) {
    return Promise.nfcall(tmp.dir, opts)
        .get(0);
}

// Download an image
function download(uri, dest) {
    return writeStream(dest, request(uri));
}

// Find a filename available in a folder
function uniqueFilename(base, filename) {
    var ext = path.extname(filename);
    filename = path.resolve(base, filename);
    filename = path.join(path.dirname(filename), path.basename(filename, ext));

    var _filename = filename+ext;

    var i = 0;
    while (fs.existsSync(filename)) {
        _filename = filename + '_' + i + ext;
        i = i + 1;
    }

    return Promise(path.relative(base, _filename));
}

// Create all required folder to create a file
function ensureFile(filename) {
    var base = path.dirname(filename);
    return fsExtra.ensureDir(base);
}

/**
    Assert a file, if it doesn't exist, call "generator"

    @param {String} filePath
    @param {Function} generator
    @return {Promise}
*/
function assertFile(filePath, generator) {
    return fileExists(filePath)
    .then(function(exists) {
        if (exists) return;

        return generator();
    });
}

/**
    Pick a file, returns the absolute path if exists, undefined otherwise

    @param {String} rootFolder
    @param {String} fileName
    @return {String}
*/
function pickFile(rootFolder, fileName) {
    var result = path.join(rootFolder, fileName);
    if (fs.existsSync(result)) {
        return result;
    }

    return undefined;
}

module.exports = {
    exists: fileExists,
    existsSync: fs.existsSync,
    readFile: Promise.nfbind(fs.readFile),
    writeFile: Promise.nfbind(fs.writeFile),
    assertFile: assertFile,
    pickFile: pickFile,
    stat: Promise.nfbind(fs.stat),
    statSync: fs.statSync,
    readdir: Promise.nfbind(fs.readdir),
    writeStream: writeStream,
    readStream: fs.createReadStream,
    copy: fsExtra.copy,
    tmpFile: genTmpFile,
    tmpDir: genTmpDir,
    download: download,
    uniqueFilename: uniqueFilename,
    ensureFile: ensureFile,
};
