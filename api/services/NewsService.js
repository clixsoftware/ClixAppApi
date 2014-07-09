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

                var slug = '/{id}/' + post.category.toLowerCase().split(' ').join('-') + '/' +mDate + '/' +  post.short_title.toLowerCase().split(' ').join('-');

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

                return Newspost.create(post)
                    .then(function(post){
                        return post;
                    })


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
    title: 'News Manager',
    description: 'Manages the home page of the intranet',
    manager_url: '/newsmanager',
    application_alias: 'news',
    manager_alias: 'newsmanager'
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