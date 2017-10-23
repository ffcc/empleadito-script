#!/usr/bin/env node
'use strict';

const configuration = require('./configuration');
const logger = require('./logger');
const program = require('commander');

let configuracionAction = function (accion) {
    if (accion && !/^(borrar)$/i.test(accion)) {
        logger.error('Unknown action: ' + accion);
        return;
    }
    if (accion === 'borrar') {
        configuration.clear();
    } else {
        logger.info('Configuración actual:');
    }
};

program.parse(process.argv);

configuracionAction(program.args[0]);