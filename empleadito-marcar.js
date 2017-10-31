#!/usr/bin/env node
'use strict';

const _ = require('underscore');
const configuration = require('./configuration');
const constant = require('./constant');
const expression = require('./expression');
const logger = require('./logger');
const moment = require('moment');
const program = require('commander');
const Redmine = require('./redmine');
const storage = require('./storage');

let empleaditoMarcar = function (accion) {
    if (!/^(entrada|salida)$/gi.test(accion)) {
        logger.error('Unknown action: ' + accion);
        return;
    }
    let config = configuration.getConfig();
    let redmine = new Redmine(config.redmine.url, config.redmine.apiKey);
    if (accion === 'entrada') {
        let issue = _.extend({}, config.issue);
        issue.status_id = issue.status_id.new;
        issue.subject = expression.evaluate(issue.subject, { today: moment(new Date()).format('DD/MM/YYYY') });
        logger.info('Creando marcación de ' + accion + '...');
        redmine.createIssue(issue).then(issue => {
            let currenDateFormat = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
            issue.created_on = currenDateFormat;
            issue.updated_on = currenDateFormat;
            storage.save(constant.CURRENT_ISSUE_KEY, issue);
            logger.info('Marcación realizada con éxito!');
            logger.info('Datos de la marcación:');
            Redmine.printIssue(issue);
        }).catch(error => logger.error('Error realizando la marcación'));
    } else {
        let currentIssue = storage.get(constant.CURRENT_ISSUE_KEY);
        if (!currentIssue) {
            logger.error("No se ha encontrado una marcación actual");
            return;
        }
        let config = configuration.getConfig();
        logger.info('Resolviendo marcación con ID ' + currentIssue.id + '...');
        redmine.updateIssue(currentIssue.id, { status_id: config.issue.status_id.resolve }).then(() => {
            let currenDateFormat = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
            logger.info('Marcación resuelta con éxito!');
            logger.info('Recuperando datos de marcación actualizada...')
            redmine.getIssue(currentIssue.id).then(issue => {
                issue.created_on = currentIssue.created_on;
                issue.updated_on = currenDateFormat;
                storage.save(constant.CURRENT_ISSUE_KEY, issue);
                logger.info('Datos de la marcación:');
                Redmine.printIssue(issue);
            });
        }).catch((error) => {
            logger.error('Error resolviendo la marcación');
        });
    }
};

program.parse(process.argv);

empleaditoMarcar(program.args[0]);
