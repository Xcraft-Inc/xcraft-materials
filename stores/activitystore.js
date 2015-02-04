'use strict';

var Reflux          = require ('reflux');

var activityStore = {
  mixins: [Reflux.ListenerMixin],

  eventDependencies: [{
    eventName: 'activityStarted',
    handle: function () {
      this.handleStarted.apply (this, arguments);
    }
  }],

  activities: [],

  init: function () {
    var events          = require ('../actions/xcraftEvents.js');
    this.eventDependencies.forEach (function (dep) {
      var action = events[dep.eventName];
      this.listenTo (action, dep.handle);
    });
  },

  handleStarted: function (msgData) {
    if (msgData.id) {
      this.activities.push ({
        activityId: msgData.id,
        text: msgData.cmd,
        route: 'packagelist'
      });
    }

    this.trigger (this.activities);
  }

};

module.exports = activityStore;
