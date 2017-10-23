'use strict';

/**
 * Dependencias del módulo
 */
const logger = require('./logger');
const fs = require('fs');
const prompt = require('./prompt');
const Redmine = require('./redmine');
const storage = require('./storage');
const expression = require('./expression');

let promptRedmineConfig = function () {
    logger.info('Datos de conexión al redmine');
    return new Promise((resolve, reject) => {
        prompt.get([{
            name: 'url',
            description: 'URL del redmine',
            pattern: /^https?:\/\/[^\/\s]+(\/.*)?$/gi,
            message: 'URL inválida',
            required: true
        }, {
            name: 'apiKey',
            description: 'API Key de tu usuario del redmine',
            message: 'Debe ingresar el API Key',
            required: true
        }], (e, redmineConfig) => {
            logger.info('Comprobando conexión...');
            let redmine = new Redmine(redmineConfig.url, redmineConfig.apiKey);                    
            redmine.checkConnection().then(isValidConnection => {
                if (isValidConnection) {
                    logger.info("Conexión exitosa");
                    logger.info("Cargando los datos del usuario...");
                    redmine.getUser().then(user => {
                        if (user) {
                            logger.info("Datos cargados correctamente");
                            redmineConfig.userId = user.id;
                            resolve(redmineConfig);
                        } else {
                            logger.error("No ha sido posible verificar el api key." +
                                " Verifique que la api rest del redmine esté habilitado y que su usuario tenga los permisos necesarios");
                            resolve(false);
                        }
                    });
                } else {
                    logger.error("No se ha podido conectar al " + redmineConfig.url + ". Verifique su conexión");
                    resolve(false);
                }
            });
        });
    });
}

let promptIssueConfig = function (data) {
    logger.info('Cargando archivo de configuración por defecto...');
    let issueConfig = JSON.parse(fs.readFileSync('./issue.default.json'));
    issueConfig.assigned_to_id = expression.evaluate(issueConfig.assigned_to_id, data);
    logger.info('Datos de la petición de marcación');
    return new Promise((resolve, reject) => {
        prompt.get([{
            name: 'project_id',
            description: 'ID del proyecto',
            type: 'integer',
            default: issueConfig.project_id,
            required: false
        }, {
            name: 'subject',
            description: 'Asunto',
            type: 'string',
            default: issueConfig.subject,
            required: false
        }, {
            name: 'priority_id',
            description: 'ID de la prioridad',
            type: 'integer',
            default: issueConfig.priority_id,
            required: false
        }, {
            name: 'tracker_id',
            description: 'ID del tipo de petición',
            type: 'integer',
            default: issueConfig.tracker_id,
            required: false
        }, {
            name: 'status_id_new',
            description: 'ID para el estado "Nuevo"',
            type: 'integer',
            default: issueConfig.status_id.new,
            required: false
        }, {
            name: 'status_id_resolve',
            description: 'ID para el estado "Resuelto"',
            type: 'integer',
            default: issueConfig.status_id.resolve,
            required: false
        }], (e, r) => {
            r.status_id = {
                "new": r.status_id_new,
                "resolve": r.status_id_resolve
            };
            delete r.status_id_new;
            delete r.status_id_resolve;
            r.assigned_to_id = issueConfig.assigned_to_id;
            resolve(r);
        });
    });
}

const CONFIG_KEY = 'config';

module.exports = {
    init: function () {
        logger.info('Empezando configuración...');
        promptRedmineConfig().then((redmineConfig) => {
            if (redmineConfig) {
                promptIssueConfig({userId: redmineConfig.userId}).then(issueConfig => {
                    logger.info("Guardando configuración...");
                    console.log(redmineConfig);
                    console.log(issueConfig);
                    storage.save(CONFIG_KEY, {
                        redmine: redmineConfig,
                        issue: issueConfig
                    }).then(() => {
                        logger.info("Configuración finalizada!")
                    });
                });
            }
        });
    },

    existConfig: function () {
        return storage.contains(CONFIG_KEY);
    },
    
    getConfig: function () {
        return storage.get(CONFIG_KEY);
    },

    clear: function () {
        return storage.clear(CONFIG_KEY);
    }
};