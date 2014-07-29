/**
 * FeaturesController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var uuid = require('uuid-v4');
//var messages = require('../services/messages');
//var utils = require('../services/utils');
var Q = require('q');

module.exports = {

    _config: {
        blueprints: { rest: true }
    },

    create: function ( req, res ) {
        return res.json(MessageService.method_not_implemented, MessageService.method_not_implemented.status);
    },

    search: function ( req, res ) {

        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(MessageService.method_not_allowed_error('GET'));
            req.results = MessageService.err_results(MessageService.methodNotAllowedError, errors);
            return res.json(req.results, MessageService.methodNotAllowedError.status);

        }


        var query = require('url').parse(req.url, true).query;
        var search = HelperService.merge({}, query);
        var q = {};

        if (_.has(query, 'limit')) {
            q.limit = search.limit;
        }

        if (_.has(query, 'sort')) {
            q.sort = search.sort;
        }

        query = _.pull(query, 'limit', 'sort');

        if (_.has(query, 'app_alias') || _.has(query, 'uuid')) {

            Features.findOne(search).exec(function ( err, success ) {
                if (err) return res.json(err);

                if (success) {
                    return res.json(success);
                } else {
                    errors.push(messages.no_record_found_error);
                    req.results = messages.err_results(messages.noRecordsFoundError, errors);
                    return res.json(req.results, messages.noRecordsFoundError.status);
                }
            });


        } else {

            Features.find(search).exec(function ( err, success ) {

                if (err) return res.json(err);

                if (success) {
                    return res.json(success);
                } else {
                    errors.push(messages.no_record_found_error);
                    req.results = messages.err_results(messages.noRecordsFoundError, errors);
                    return res.json(req.results, messages.noRecordsFoundError.status);
                }
            });

        }


    },

    deactivate: function ( req, res ) {
        var errors = [];

        //Only accept 'POST' request, all other request are rejected

        if (req.method != 'POST') {

            res.setHeader('Allowed', 'POST');
            errors.push(messages.method_not_allowed_error('POST'));
            req.results = messages.err_results(messages.methodNotAllowedError, errors);
            return res.json(req.results, messages.methodNotAllowedError.status);

        }

        var id = req.param('id');

        Features.update(id,
            {
                status: 'disabled',
                status_message: 'Feature currently disabled'
            },
            function ( err, model ) {
                if (err) return res.json(err);

                if (model) {
                    return res.json(model);
                }
            }
        );

    },

    activate: function ( req, res ) {
        var errors = [];

        //Only accept 'POST' request, all other request are rejected

        if (req.method != 'POST') {

            res.setHeader('Allowed', 'POST');
            errors.push(messages.method_not_allowed_error('POST'));
            req.results = messages.err_results(messages.methodNotAllowedError, errors);
            return res.json(req.results, messages.methodNotAllowedError.status);

        }

        var id = req.param('id');

        Features.update(id,
            {
                status: 'enabled',
                status_message: 'Feature currently enabled'
            },
            function ( err, model ) {
                if (err) return res.json(err);

                if (model) {
                    return res.json(model);
                }
            }
        );

    },

    help: function ( req, res ) {


        var settings = {
            name: 'Feature Management API',
            version: 1,
            description: 'Manages all the features in the website'
        };

        settings.links = {
            create: {
                method: 'POST',
                href: 'http://localhost:3100/' + 'features/items',
                rel: 'http://localhost:3100/features_api/items',
                fields: {
                    title: {
                        type: 'Text',
                        required: true,
                        description: 'Name of the feature'
                    },
                    description: {
                        type: 'Text',
                        required: true,
                        description: 'Name of the feature'
                    },
                    manager_alias: {
                        type: 'Text',
                        required: true,
                        description: 'Name of the feature'
                    },
                    manager_url: {
                        type: 'Text',
                        required: true,
                        description: 'Name of the feature'
                    },
                    app_alias: {
                        type: 'Text',
                        required: true,
                        description: 'Name of the feature'
                    }

                }
            }


        };

        return res.json(settings);

    },

    apps: function ( req, res ) {

        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(messages.method_not_allowed_error('GET'));
            req.results = messages.err_results(messages.methodNotAllowedError, errors);
            return res.json(req.results, messages.methodNotAllowedError.status);

        }

        //check if id is passed in params
        if (req.param('id')) {

            Features.findOne(req.param('id')).
                populate('apps').
                exec(function ( err, success ) {

                    if (err) return res.json(err);

                    if (success) {
                        return res.json(success.apps);
                    } else {
                        errors.push(messages.no_record_found_error);
                        req.results = messages.err_results(messages.noRecordsFoundError, errors);
                        return res.json(req.results, messages.noRecordsFoundError.status);
                    }
                });
        } else {

            errors.push(messages.id_missing_err);
            req.results = messages.err_results(messages.idMissingError, errors);
            return res.json(req.results, messages.idMissingError.status);

        }


    },

    alias: function(req, res){

       Features.findOne({
           application_alias: req.param('id')
       }).exec(function(err, success){

               //console.log(success);

               if(err) return res.json(err, 500);

               if(success){
                   return res.json(success);
               }else{
                   return res.json({
                       name: 'Record not found',
                       description: 'Record not found'
                   }, 404);
               }

           })
    }


};
