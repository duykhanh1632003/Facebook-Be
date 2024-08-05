const {  performance } = require('node:perf_hooks');

function benchmark(dictionary, word) {
    const startTime = performance.now()
    dictionary.contain(word)
    const endTime = performance.now()
    return endTime - startTime
} 

module.exports = { benchmark };
