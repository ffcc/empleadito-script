'use strict';

/**
 * Dependencias del módulo
 */
const chalk = require('chalk');

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
    }
}