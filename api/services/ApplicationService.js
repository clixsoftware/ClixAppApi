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

    create: function ( app ) {

        //check if the application already exist

        return Applications.findOne({
            alias: app.alias,
            app_alias: app.app_alias
        }).done(function(err, success){

              if(err) {
                  console.log(err);
                  throw new Error('An error occurred');
              }

              if(success){
                  console.log('Application already exist');
                  return success;
              }else{
                  //get the feature information
                  return Features.findOne()
                      .where({application_alias: app.app_alias})
                      .then(function ( feature ) {

                          if (!feature) {
                              throw SystemMessages.recordNotFoundError;
                          }

                          var validationErrors;
                          validationErrors = validateData(app);

                          if (validationErrors.length > 0) {
                              // error on data or confirm password
                              var err = SystemMessages.fieldValidationError;
                              err.errors = validationErrors;
                              throw err;

                          } else {
                              //copied
                              if(app.is_root){
                                  app.path = '/' + feature.application_alias  + '/' + app.alias;
                              }
                              app.title = feature.title + '[ ' + app.alias +' ]';
                              app.description = feature.description;
                              app.parent_feature = feature.id;
                              //app.url = app.path + '/index.html';
                              app.app_alias = feature.application_alias;

                              //generated
                              //app.edit_url = feature.manager_url + '/applications/{id}/edit';
                              app.admin_path = '/backend/' + feature.application_alias + '/applications/{id}';

                              return app;
                          }


                      })
                      .then(function ( app ) {

                          console.log('Creating Application ' + JSON.stringify(app));

                          return Applications.create(app)
                              .then(function (success ) {
                                  return success;
                              })
                              .fail(function(err){
                                  console.log('Error occurred in Creating Application ' + JSON.stringify(err));
                                  var responseError = SystemMessages.recordCreationError;
                                  responseError.errors.push(err);
                                  throw responseError;
                              })
                      })
              }


        });



    }




});

var _moduleData = {
    title: 'Directory Manager',
    description: 'Manages profiles and contact information',
    manager_url: '/directorymanager',
    application_alias: 'directory',
    manager_alias: 'directorymanager'
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