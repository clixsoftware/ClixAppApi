/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


    //get all applications (home manager)
    applications: function ( req, res ) {

        var errors = [];

        //create a new application
        if (req.method === 'POST') {

            var app = {};
            // Fields to be entered
            app.title = req.param('title');
            app.description = req.param('description');
            app.alias = req.param('alias');

            HomePageService.createApp(app)
                .then(function ( success ) {
                    return res.json(success.item, success.status)
                })
                .fail(function ( err ) {
                    return res.json(err, err.status);
                });


        } else if (req.method === 'GET') {

            //check if id is passed in params
            if (req.param('id')) {

                Applications.findOne(req.param('id'))
                    .done(function(err, success){

                        var retMessage =  SystemMessages.recordNotFoundError;

                        if(err) return res.json(retMessage, retMessage.status);

                        if(success){
                            return res.json(success);
                        }

                        return res.json(retMessage, retMessage.status);

                    });

/*
                HomePageService.getApplication(req.param('id'))
                    .then(function ( success ) {
                        if (!success) {
                            return res.json(SystemMessages.recordNotFoundError, SystemMessages.recordNotFoundError.status);
                        }
                        return res.json(success);
                    });
*/

            } else {

                var query = require('url').parse(req.url,true).query;
                var search = HelperService.merge({}, query);


                if(_.has(query, 'alias')){

                    Applications.findOne(search)
                        .done(function(err, success){

                            if(err) return res.json(err, 500);

                            if(success){
                                return res.json(success);
                            }

                            return res.json({error: 'record not found'}, 404);
                        });

                }else{
                    HomePageService.getApplications()
                        .then(function ( models ) {

                            if (!models) {
                                return res.json(SystemMessages.recordNotFoundError, SystemMessages.recordNotFoundError.status);
                            }

                            return res.json(models);

                        });
                }





            }

        }


    },
    //Get the feature Information
    index: function ( req, res ) {
        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(SystemMessages.method_not_allowed_error('GET'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);

        }

        return HomePageService.getFeature()
            .then(function ( model ) {
                if (!model) {
                    throw Error({
                        name: 'Feature was not found',
                        description: 'feature not found'

                    });
                }
                return res.json(model);
            })
            .fail(function ( err ) {
                return res.json(err, 500);
            });

    },

    install: function ( req, res ) {
        var errors = [];

        if (req.method != 'POST') {

            res.setHeader('Allowed', 'POST');
            errors.push(SystemMessages.method_not_allowed_error('POST'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);
        }

        console.log('in the home page controller install');
        HomePageService.install()
            .then(
            function ( model ) {
                return res.json(model);
            },
            function ( error ) {
                console.log(error);
                return res.json(error, 500);
            });

    },

    create_home: function ( req, res ) {
        var errors = [];

        if (req.method != 'POST') {

            res.setHeader('Allowed', 'POST');
            errors.push(SystemMessages.method_not_allowed_error('POST'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);
        }

        HomePageService.create()
            .then(function ( model ) {
                return res.json(model);
            })
            .fail(function ( err ) {
                return res.json(err, 500);
            })
    },

    home: function(req, res){

        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(SystemMessages.method_not_allowed_error('GET'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);
        }

        HomePageService.getHomeApp()
            .then(function(model){
                return res.json(model);
            }, function(error){
                return res.json(error, 500);
            });


    },

    getApps: function(req, res){

        return HomePageService.getSubApps(req.param('alias'))
            .then(function(models){

                if(!models){
                    return res.json([]);
                }

                return res.json(models);
            }, function(error){
                console.log(error);
                return res.json(error);
            });
    },

    createApp: function(req, res){

        var app = {
            //title: req.param('title'),
            //description: req.param('description'),
            app_alias: req.param('app_alias'),
            alias: req.param('alias') //retrieve automatically from route/url
        };

        return HomePageService.createApp(app)
            .then(function(model){

                if(model) {
                    return res.json(model);
                }
            }, function(error){
                return res.json(error, 500);
            });


    }

};
