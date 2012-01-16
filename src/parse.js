var fs = require('fs');

var py = require('./py');

var lnparse;

module.exports = function(file) {
    var lno = 1;
    var dict = [];
    var o;
    var lns = fs.readFileSync(file).toString().split(/(\r)?\n/); // TODO not reading the whole dictionary into memory would be good
    var i;
    for (i=0;i<lns.length;i++) {
        o = lnparse(lns[i], lno++);
        if (o)
            dict.push(o);
    }
    return dict;
}

lnparse = function(ln, lno) {
    if (ln.indexOf('#') == 0) {
        // skip comment
        return;
    }
    var mch = ln.match(/^([^ ]+) ([^ ]+) \[(.+)\] ((\/[^\/]+)+)/);

    if (!mch) {
        if (!ln.match(/^[\s]*$/)) {
            // not blank line
            console.error('invalid syntax on line ' + lno + ': ' + ln);
            console.error('...skipping.');
        }
        return;
    }

    var simplified = mch[1],
        traditional = mch[2],
        sene = simplified != traditional,
        pinyin = mch[3],
        pynyin = py(pinyin),
        englishs = mch[4].split("/").map(py); // TODO handle \/ correctly

    englishs.shift();

    var name = simplified + (sene ? '|' + traditional : '');
    var indexes = [].concat(englishs);
    indexes.push(simplified);
    if (sene)
        indexes.push(traditional);
    indexes.push(pinyin);
    indexes.push(pynyin);

    return {name: name, indexes: indexes, pronunciation: pynyin, definitions: englishs};
};
