#! /usr/bin/env node

require('../lib/cli/build').exec([], {
    format: 'website',
    log: 'info',
    timing: false,
});
