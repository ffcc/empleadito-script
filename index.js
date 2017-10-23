#!/usr/bin/env node
'use strict';

/**
 * module dependencies
 */
const configuration = require('./configuration');
const logger = require('./logger');
const pkg = require('./package.json');
const program = require('commander');
const prompt = require('./prompt');

/**
 * program version
 */
program.version(pkg.version);

/**
 * comamnd 'marcar'
 */
program
    .command('marcar <entrada|salida>', 'Permite registrar una marcación');

/**
 * command 'configuracion'
 */
program
    .command('configuracion [borrar]', 'Configura los datos del programa del empleadito');

/**
 * check if there is any configuration
 */
if (!configuration.existConfig()) {
    logger.error('No se ha encontrado ninguna configuración.');
    logger.info('Debe realizar una configuración.');
    prompt.get([{
        name: 'continuar',
        description: '¿Desea continuar? (s|n)',
        type: 'string',
        pattern: /^(s|n)+$/gi,
        message: 'Entrada inválida',
        before: function (value) {
            return value.toLowerCase() === 's';
        }
    }], function (e, r) {
        if (r.continuar) {
            configuration.init();
        }
    });
} else {
    /**
     * process of arguments
     */
    program.parse(process.argv);

    /**
     * default command
     */
    if (program.args.length === 0) {
        program.help();
    }
}