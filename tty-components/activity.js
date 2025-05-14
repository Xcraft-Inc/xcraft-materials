'use strict';

var colors = require('picocolors').createColors(true);
var reflux = require('xcraft-reflux');
var activityStore = reflux.createStore(require('../stores/activitystore.js'));

function printList(list) {
  const keys = Object.keys(list);
  keys.forEach(function (id) {
    const orc = list[id].orc;
    const cmd = list[id].cmd;
    const al1 = new Array(60 - orc.length).join(' ');
    const al2 = new Array(20 - id.length).join(' ');
    console.log(` ${colors.blackBright('°')} ${orc}${al1}${id}${al2}${cmd}`);
  });
  if (!keys.length) {
    console.log(` ${colors.blackBright('°')} N/A`);
  }
}

module.exports = function () {
  activityStore.listen(function (status) {
    console.log();
    console.log(colors.yellow(' Waiting'));

    printList(status.waiting);

    console.log();
    console.log(colors.green(' Running'));

    printList(status.running);

    console.log();
  });
};
