'use strict'

/**
 * module dependencies
 */
const storage = require('node-persist');
const _ = require('underscore');

/**
 * create the storage
 */
storage.create({dir: 'storage'});

/**
 * init synchronization
 */
storage.initSync();

/**
 * module exports
 */
module.exports = {

    contains: function(key) {
        let item = storage.getItemSync(key);
        return  item || item === 0;
    },

    save: async function(key, data) {
        return storage.setItem(key, data);
    },

    updateOrCreate: async function(key, data) {
        var _data = storage.getItemSync(key) || {};
        _data = _.extend(_data, data);
        return storage.setItem(key, _data);
    },

    clear: function() {
        return storage.clearSync();
    },
    
    get: function(key) {
        return storage.getItemSync(key);
    }
}