'use strict';

var actions = require('../actions/ttyComponentsActions.js');
var display = actions.displayGameOver;
var colors = require('picocolors').createColors(true);

module.exports = function () {
  display.listen(function () {
    console.log();
    console.log(
      '             ' +
        colors.blackBright('.') +
        colors.white(':') +
        colors.green('G') +
        colors.greenBright('ame') +
        colors.green('O') +
        colors.greenBright('ver') +
        colors.white(':') +
        colors.blackBright('.')
    );
    console.log();
  });
};
