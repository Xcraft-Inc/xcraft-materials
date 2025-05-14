'use strict';

var reflux = require('xcraft-reflux');

var textStore = reflux.createStore(require('../stores/textstore.js'));

// https://github.com/medikoo/cli-color/blob/b9080d464c76930b3cbfb7f281999fcc26f39fb1/erase.js#L8
const eraseLineLeft = '\x1b[1K';
// https://github.com/medikoo/cli-color/blob/b9080d464c76930b3cbfb7f281999fcc26f39fb1/window-size.js#L6
const windowSizeWith = process.stdout.columns || 0;
// https://github.com/medikoo/cli-color/blob/b9080d464c76930b3cbfb7f281999fcc26f39fb1/move.js#L8
const moveLeft = (num) => {
  num = isNaN(num) ? 0 : Math.max(Math.floor(num), 0);
  return num ? '\x1b[' + num + 'D' : '';
};

module.exports = function () {
  var log = require('xcraft-core-utils').log;

  let previous = null;

  textStore.listen(function (mode, data) {
    const begin = mode + data.prefix + data.mod;
    const stripBegin = begin === previous;

    /* Do not repeat the begining for each line in the case of embedded logs */
    if (!stripBegin) {
      previous = begin;
    }

    process.stdout.write(eraseLineLeft);
    process.stdout.write(moveLeft(windowSizeWith - 1));
    console.log(
      log.decorate(mode, data.prefix, data.mod, data.text, null, stripBegin)
    );
  });
};
