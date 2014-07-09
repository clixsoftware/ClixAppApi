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
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(baseService), {

    install: function () {

        return FeatureService.create(_moduleData)
            .then(function (model) {
                return model;
            });

    },

    getFeature: function(){

        return Features.findOne({application_alias: _moduleData.application_alias})
            .then(function(model){
                return model;
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

    findByAlias: function(alias){
        var query = {
            app_alias: _moduleData.application_alias,
            alias: alias
        };

        return Applications.findOne()
            .where(query)
            .then(function(success){
                return success;
            });
    },

    createPost: function(post){

        //get the application
        return Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function(app){

                console.log('building post informatioin');

                var mDate = moment().format('YYYY/MM/DD');

                var slug = '/{id}/' + post.category.toLowerCase().split(' ').join('-') + '/' +  post.title.toLowerCase().split(' ').join('-');

                var path = app.path + slug; //slug to be created using e..g /2014/02/19/category/title/index.html
                var url = app.path + slug + '/index.html';
                var edit_url = app.manager_url + "/posts/{id}/edit";
                var admin_url = app.manager_url + "/posts/{id}";


                post.edit_url = edit_url;
                post.manager_url = admin_url;
                post.slug = slug;
                post.path = path;
                post.url = url;


                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_application_feature.application_alias;

                console.log(post);
                return post;
            })
            .then(function(post){

                return Yellowpages.create(post)
                    .then(function(post){
                        return post;
                    })


            })
    }



});


var validateEntry = function (entry) {

    var errors = [];


    return errors;

};


var _moduleData = {
    title: 'Yellow Pages Manager',
    description: 'Manages the how do i guides and tasks',
    manager_url: '/ypmanager',
    application_alias: 'yp',
    manager_alias: 'ypmanager'
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