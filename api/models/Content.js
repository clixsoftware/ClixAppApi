/**
 * Content.js
 *
 * @description :: This is the base table for applications based on the content object.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var contentModel = require('../services/model/contentModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(contentModel), {

    attributes: {



    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {


        Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function (app) {

                post.feature_alias = app.app_alias;
                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_application_feature.application_alias;

                post.uuid = uuid();
                next();

            });

        // Create new user password before create

    }
 });
