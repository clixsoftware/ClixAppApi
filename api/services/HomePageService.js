/**
 * Manager Model
 *
 * @module      ::
 * @description :: Base for spaces model.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var _ = require('lodash');
var Q = require('q');
var baseService = require('../services/BaseService');

module.exports = _.merge(_.cloneDeep(baseService), {

    install: function () {

        var that = this;
        return FeatureService.create(_moduleData)
            .then(function(model){
                return [model, that.createHomeApp()];
            })
            .spread(function(feature, app){
                feature.app = app;
                return feature;

            });

    },

    createHomeApp: function ()

    {

        console.log('inside the home page service create the home page');
        var app = _homePageAppData;
        app.app_alias = _moduleData.application_alias;

        return ApplicationService.create(app)
            .then(function (success) {
                return success;
            });


    },

    createApp: function(app){

        app.is_root = false;

        return this.getApplication(app.alias)
            .then(function(success){

                app.parent_application = success.id;
                app.parent_application_feature = success.parent_feature;

                //COPIED
                app.path = success.path + '/' + app.app_alias;
               // app.url = app.path + '/index.html';

                return app;
            })
            .then(function(app){
                console.log('App to Create ' + JSON.stringify(app));

                return ApplicationService.create(app)
                    .then(function (success) {
                         return success;
                    });
            });

    },

    getFeature: function(){

        return Features.findOne({application_alias: _moduleData.application_alias})
            .then(function(model){
                return model;
            });
    },

    getHomeApp: function(){
        var query = {
            app_alias: _moduleData.application_alias,
            alias: _homePageAppData.alias

        };
        return Applications.findOne(query)
            .then(function(app){
                return app;
            });
    },

    getApplication: function(alias){

        var query = {
            app_alias: _moduleData.application_alias,
            alias: alias
        };

        console.log('get application using - ' + JSON.stringify(query));
        return Applications.findOne(query)
            .then(function(success){
                return success;
            });
    },

    getApplications: function(){

        var query = {
            app_alias: _moduleData.application_alias
        };

        return Applications.find()
            .where(query)
            .then(function(success){
                return success;
            });
    },

    getSubApps: function(alias){

        return Applications.find()
            .where(
            {alias: alias,
             is_default: false
            })
            .then(function(models){

                if(!models){

                    throw new Error('No records found');
                }

                return models;
            })

    }

});


var validateEntry = function (entry) {

    var errors = [];

    if (!entry.first_name) {
        errors.push({
            type: 'validation',
            field: 'first_name',
            message: "Field <strong>first_name</strong> is required"
        });
    }

    if (!entry.user_alias) {
        errors.push({
            type: 'validation',
            field: 'user_label',
            message: "Field <strong>user_alias</strong> is required"
        });
    }

    if (!entry.profile_type) {
        errors.push({
            type: 'validation',
            field: 'profile_type',
            message: "Field <strong>profile_type</strong> is required"
        });
    }

    if (!entry.last_name) {
        errors.push({
            type: 'validation',
            field: 'last_name',
            message: "Field <strong>last_name</strong> is required"
        });
    }


    if (!entry.work_email) {
        errors.push({
            type: 'validation',
            field: 'work_email',
            message: "Field <strong>work_email</strong> is required"
        });
    }

    return errors;

};


var _moduleData = {
    title: 'Home Page Manager',
    description: 'Manages the home page of the intranet',
    admin_path: '/sitemanager/homepage',
    application_alias: 'home'
};

var _homePageAppData = {
    title: 'Home Page',
    description: 'Manages the Home page for the website',
    alias: 'main',
    is_root: true
};

var validateData;

validateData = function (app) {

    var errors = [];

    if (!app.alias) {
        errors.push({
            type: 'validation',
            field: 'alias',
            message: "Field <strong>alias</strong> is required"
        });
    }

    return errors;

};