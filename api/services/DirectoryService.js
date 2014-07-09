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
        console.log('get the directory feature');
        return this.getFeature()
            .then(function(feature){

                if(feature){
                  return feature;
                }else{

                    console.log('creating the directory feature');
                    return FeatureService.create(_moduleData)
                        .then(function (model) {
                            return model;
                        })
                        .then(function(model){

                            return [model,
                                that.create(_peopleAppData),
                                that.create(_workunitsAppData),
                                that.create(_companiesAppData),
                                that.create(_contactsAppData)]

                        })
                        .spread(function(feature, people, workunits, companies, contacts){
                            feature.apps= [people, workunits, companies, contacts];

                            return feature;

                        });
                }
            });
    },

    create: function (app) {

        app.app_alias = _moduleData.application_alias;

        return ApplicationService.create(app)
            .then(function (success) {
                var responseSuccess = SystemMessages.recordCreationSuccess;
                responseSuccess.item = success;
                return success;
            });

    },

    getDirectory: function(alias){

        var query = {
            app_alias: _moduleData.application_alias,
            alias: alias
        };

        console.log('get directory using - ' + JSON.stringify(query));
        return Applications.findOne(query)
            .then(function(success){
                return success;
            });
    },

    getDirectoryById: function(id){

        var query = {
            id: id
        };

        console.log('get directory using - ' + JSON.stringify(query));
        return Applications.findOne(query)
            .then(function(success){
                return success;
            });
    },
    getDirectories: function(){

        var query = {
            app_alias: _moduleData.application_alias
           };

        return Applications.find()
            .where(query)
            .then(function(success){
                return success;
            });
    },

    getEntry: function(query){

        return Profiles.findOne()
            .where(query)
            .then(function(profile){

                return profile;
            })
            .fail(function(err){
                console.log('in the fail function for getEntry');
                return err;
            });
    },

    createEntry: function ( entry ) {

        console.log(entry);

        var validationErrors;
        validationErrors = validateEntry(entry);

        if (validationErrors.length > 0) {
            // error on data or confirm password
            var err = SystemMessages.fieldValidationError;
            err.errors = validationErrors;
            throw err;

        }else{

        return Q.all([
                this.getDirectoryById(entry.parent_application),
                this.getEntry({user_alias: entry.user_alias})
            ])
            .spread(function(directory, profile){

                if(directory && !profile){

                    console.log('ready to create the profile ' + entry.title);
                    //go ahead and create the entry

                    entry.parent_application = directory.id;
                    entry.parent_application_alias = directory.alias;
                    entry.path = directory.path + '/' + entry.user_alias;
                    entry.url = entry.path + '/index.html';

                    //generated
                    entry.edit_url = directory.manager_url + '/posts/{id}/edit';
                    entry.manager_url = directory.manager_url + '/posts/{id}';
                    return entry;

                }else{
                    throw new Error({
                        err:{
                        name: 'No such directory or profile already exist',
                        description:''
                        }
                    });

                    //return new Error({
                   //     name: 'no such directory or profile'
                    //});
                }


            })
            .then(function(entry){

                console.log('create entry - ' + JSON.stringify(entry));
                return Profiles.create(entry)
                    .then(function (success ) {
                        var responseSuccess = SystemMessages.recordCreationSuccess;
                        responseSuccess.item = success;
                        return responseSuccess;
                    });
            });
    }
    },

    getDirectoryEntries: function(query){

        return Profiles.find()
            .then(function(models){
                if(!models){
                    return [];
                }
                return models;
            });
    },

    getFeature: function(){

        return Features.findOne({application_alias: _moduleData.application_alias})
            .then(function(model){
                console.log('directory ' + JSON.stringify(model));
                return model;
            });
    }

});


var validateEntry = function (entry ) {

    var errors = [];

    if(!entry.first_name){
        errors.push({
            type: 'validation',
            field: 'first_name',
            message:"Field <strong>first_name</strong> is required"
        });
    }

    if(!entry.user_alias){
        errors.push({
            type: 'validation',
            field: 'user_label',
            message:"Field <strong>user_alias</strong> is required"
        });
    }

    if(!entry.profile_type){
        errors.push({
            type: 'validation',
            field: 'profile_type',
            message:"Field <strong>profile_type</strong> is required"
        });
    }

    if(!entry.last_name){
        errors.push({
            type: 'validation',
            field: 'last_name',
            message:"Field <strong>last_name</strong> is required"
        });
    }


    if(!entry.work_email){
        errors.push({
            type: 'validation',
            field: 'work_email',
            message:"Field <strong>work_email</strong> is required"
        });
    }

    return errors;

};

var _moduleData = {
    title: 'Directory Manager',
    description: 'Manages profiles and contact information',
    manager_url: '/directorymanager',
    application_alias: 'directory',
    manager_alias: 'directorymanager'
};

var _peopleAppData = {
    title: 'People contacts manager',
    description: 'Manages the Home page for the website',
    alias: 'people',
    is_root: true
};

var _workunitsAppData = {
    title: 'Work Unit contacts manager',
    description: 'Manages the Home page for the website',
    alias: 'workunits',
    is_root: true

};


var _companiesAppData = {
    title: 'External contacts data',
    description: 'Manages the Home page for the website',
    alias: 'companies',
    is_root: true

};

var _contactsAppData = {
    title: 'Contacts data',
    description: 'Manages the Home page for the website',
    alias: 'contacts',
    is_root: true

};


var validateData;

validateData = function ( app ) {

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