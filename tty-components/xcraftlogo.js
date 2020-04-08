'use strict';

const {log} = require('xcraft-core-utils');

var actions = require('../actions/ttyComponentsActions.js');
var displayLogo = actions.displayLogo;

module.exports = function () {
  displayLogo.listen(() =>
    log.graffiti('Xcraft', (err, data) => {
      console.log();
      console.log(data);
      console.log();
    })
  );
};
