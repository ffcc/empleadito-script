'use strict';

const constant = require('./constant');
const logger = require('./logger');
const requestPromise = require('request-promise');
const Table = require('cli-table');

let getHeaders = function (apiKey) {
    return {
        'X-Redmine-API-Key': apiKey
    };
};

class Redmine {
    constructor(url, apiKey) {
        this.url = url;
        this.apiKey = apiKey;
    }

    checkConnection() {
        return new Promise((resolve, reject) => {
            requestPromise(this.url).then(response => resolve(true)).catch(error => resolve(false));
        });
    }

    getUser() {
        return new Promise((resolve, reject) => {
            requestPromise({
                url: this.url + '/users/current.json',
                headers: getHeaders(this.apiKey),
                json: true
            }).then(response => {
                resolve(response.user);
            }).catch(error => {
                resolve(false);
            });
        });
    }

    createIssue(issue) {
        return new Promise((resolve, reject) => {
            requestPromise({
                method: 'POST',
                url: this.url + '/issues.json',
                headers: getHeaders(this.apiKey),
                body: {
                    issue: issue
                },
                json: true
            }).then(response => {
                resolve(response.issue);
            }).catch(error => reject(error));
        });
    }

    updateIssue(id, data) {
        return new Promise((resolve, reject) => {
            requestPromise({
                method: 'PUT',
                url: this.url + '/issues/' + id + '.json',
                headers: getHeaders(this.apiKey),
                body: {
                    issue: data
                },
                json: true
            }).then(() => {
                resolve();
            }).catch(error => {
                reject(error)
            });
        });
    }

    getIssue(id) {
        return new Promise((resolve, reject) => {
            requestPromise({
                url: this.url + '/issues/' + id + '.json',
                headers: getHeaders(this.apiKey),
                json: true
            }).then(response => {
                resolve(response.issue);
            }).catch(error => {
                reject(error)
            });
        });
    }

    static printIssue(issue) {
        let table = new Table({
            head: ['ID', 'Proyecto', 'Tipo', 'Estado', 'Asignado a', 'Asunto', 'Fecha Creación', 'Fecha Actualización']
        });
        table.push([issue.id, issue.project.name, issue.tracker.name, issue.status.name, issue.assigned_to.name, issue.subject,
            issue.created_on, issue.updated_on]);
        logger.simple(table.toString());
    }
}

module.exports = Redmine;