// Manage building the XML file

var DICT_LOC = __dirname + '/../res/DICT';
var XML_LOC = __dirname + '/../res/xcprj/dian.xml';

console.log('Parsing ' + DICT_LOC);
var dict = require('./parse')(DICT_LOC);

console.log('Making XML at ' + XML_LOC);
require('./xmliz')(dict, XML_LOC);
