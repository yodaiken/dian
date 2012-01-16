var fs = require('fs');

var PRINT_EVERY = 5000;

var START;
module.exports = function(dict, loc) {
    var ws = fs.createWriteStream(loc);
    ws.write('<?xml version="1.0" encoding="UTF-8"?>\n');
    ws.write('<d:dictionary xmlns="http://www.w3.org/1999/xhtml" xmlns:d="http://www.apple.com/DTDs/DictionaryService-1.0.rng">\n');
    START = Date.now();
    wre(0, ws, dict, function(){ws.write('</d:dictionary>\n'); ws.end();});
};

var wre = function(no, ws, dict, cb) {
    var id = no+1,
        it = dict[no];

    ws.write('<d:entry id="ls_' + id + '" d:title="' + it.name + '">\n');
    it.indexes.forEach(function(index) {
        ws.write('  <d:index d:value="' + index.replace('"', '\\"') + '"/>\n');
    });
    ws.write('  <div d:priority="2"><h1>' + it.name + '</h1></div><span class="syntax"><span d:pr="tp">' +
                it.pronunciation + '</span></span>\n');
    ws.write('  <div><ol>\n');
    it.definitions.forEach(function(def) {
        ws.write('    <li>' + def + '</li>\n');
    });
    ws.write('  </ol></div>\n');
    ws.write('</d:entry>\n');

    if (!(id%PRINT_EVERY)) console.error(' -> Completed ' + id + ' in ' + ((Date.now() - START)/1000) + ' seconds');
    if (no == dict.length - 1) { // last entry
        console.error(' -> Completed ' + id + ' in ' + ((Date.now() - START)/1000) + ' seconds');
        console.error(' -> Closing stream (this may take a long time)');
        ws.on('close', function() {
            console.error(' -> Stream closed in ' + ((Date.now() - START)/1000));
        });
        if (cb)
            cb();
    } else {
        process.nextTick(function(){wre(no+1, ws, dict, cb)});
    }
};
