'use strict';

/**
 * Dependencias del módulo
 */
const chalk = require('chalk');
const debug = require('debug')('true')

module.exports = {
    error: function(msg) {
        console.log(chalk.red.bold("[ERROR] ") + msg);
    },

    warn: function(msg) {
        console.log(chalk.yellow.bold("[WARN] ") + msg);
    },
    
    info: function(msg) {
        console.log(chalk.green.bold("[INFO] ") + msg);
    },

    simple: function(msg) {
        console.log(msg);
    },

    /**
     * For debug working must set DEBUG=true or DEBUG=* before `node archivo.js`
     */
    debug: function(msg) {
        debug(chalk.yellowBright.bold("[DEBUG] ") + msg)
    }
}