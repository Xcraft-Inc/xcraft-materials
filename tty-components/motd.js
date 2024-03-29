'use strict';

var reflux = require('reflux');
var clc = require('cli-color');

var motdStore = reflux.createStore(require('../stores/motdstore.js'));

module.exports = function () {
  motdStore.listen(function (data) {
    console.log(' Welcome aboard %s!', clc.blackBright(data.orcName));
    console.log();
    console.log(' Server:        %s', clc.blackBright(data.server));
    console.log(' Commands port: %s', clc.blackBright(data.commandsPort));
    console.log(' Events port:   %s', clc.blackBright(data.eventsPort));
    console.log();
    console.log(
      ' This is the %s of the %s...',
      clc.blackBright(data.motd.unit),
      clc.blackBright(data.motd.race)
    );
    console.log(clc.blackBright(' >> ') + clc.green(data.motd.text));
    console.log();
  });
};
