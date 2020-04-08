'use strict';

var xcraftReaction = require('./actions/xcraftReaction.js');

module.exports = function (type, reaction, busClient) {
  if (reaction) {
    if (busClient) {
      xcraftReaction(busClient);
    } else {
      xcraftReaction();
    }
  }

  switch (type) {
    case 'web': {
      return {};
    }

    default:
    case 'tty': {
      return {
        XcraftLogo: require('./tty-components/xcraftlogo.js'),
        Motd: require('./tty-components/motd.js'),
        GameOver: require('./tty-components/gameover.js'),
        Activity: require('./tty-components/activity.js'),
        PackageList: require('./tty-components/packagelist.js'),
        Text: require('./tty-components/text.js'),
        Progress: require('./tty-components/progress.js'),
        Actions: require('./actions/ttyComponentsActions.js'),
      };
    }
  }
};
