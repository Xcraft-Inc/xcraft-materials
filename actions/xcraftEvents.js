'use strict';

var Reflux = require ('reflux');
var xFs    = require ('xcraft-core-fs');
var path   = require ('path');

var modules = [];
var eventsDeps = [];


var loadStoreEventDependencies = function () {
  var modulePath   = path.join (__dirname, '../stores');
  var filterRegex  = /store\.js$/;
  var modulesFiles = xFs.ls (modulePath, filterRegex);
  modulesFiles.forEach (function (fileName) {
    modules[fileName] = require (path.join (modulePath, fileName))();
    if (modules[fileName].hasOwnProperty ('eventDependencies')) {
      modules[fileName].eventDependencies.forEach (function (dep) {
        eventsDeps.push (dep.eventName);
      });
    }
  });
};

/* WebPack resolving method */
var loadStoreEventDependencies4Web = function () {
  var req = require.context('../stores/', false, /store\.js$/);
  req.keys().forEach (function (storeDep) {
    var store = req.resolve (storeDep);
    if (store.hasOwnProperty ('eventDependencies')) {
      store.eventDependencies.forEach (function (dep) {
        eventsDeps.push (dep.eventName);
      });
    }
  });
};


module.exports = function (isWeb) {
  if (isWeb) {
    loadStoreEventDependencies4Web ();
  } else {
    loadStoreEventDependencies ();
  }
  return Reflux.createActions(eventsDeps);
};
