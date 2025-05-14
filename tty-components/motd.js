'use strict';

var reflux = require('xcraft-reflux');
var colors = require('picocolors').createColors(true);

var motdStore = reflux.createStore(require('../stores/motdstore.js'));

module.exports = function () {
  motdStore.listen(function (data) {
    console.log(' Welcome aboard %s!', colors.blackBright(data.orcName));
    console.log();
    console.log(' Server:        %s', colors.blackBright(data.server));
    console.log(' Commands port: %s', colors.blackBright(data.commandsPort));
    console.log(' Events port:   %s', colors.blackBright(data.eventsPort));
    console.log();
    console.log(
      ' This is the %s of the %s...',
      colors.blackBright(data.motd.unit),
      colors.blackBright(data.motd.race)
    );
    console.log(colors.blackBright(' >> ') + colors.green(data.motd.text));
    console.log();
  });
};
