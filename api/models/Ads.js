/**
 * Ads.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var contentModel = require('../services/model/contentModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');

module.exports = _.merge(_.cloneDeep(contentModel), {

    tableName: 'content',

    attributes: {

        content_type: {
            type: 'string',
            defaultsTo: 'ad-post'
        }

    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {

        Applications.findOne(post.parent_application)

            .populate('parent_feature')

            .then(function (app) {

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_feature.application_alias;

                console.log(post);
                post.uuid = uuid();
                next();

            });

        // Create new user password before create

    }

});
