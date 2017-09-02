
module.exports = {
    loadForBook:            require('./loadForBook'),
    validateConfig:         require('./validateConfig'),
    // develar: no need to install - just use yarn as in case of any other module (npm and npmi depdencies were removed in develar fork)
    // installPlugins:         require('./installPlugins'),
    listResources:          require('./listResources'),
    listBlocks:             require('./listBlocks'),
    listFilters:            require('./listFilters')
};

