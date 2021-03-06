/**
 * Newspost.js
 *
 * @description :: Creates posts for the NewsManager data is saved in the cotent table.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var contentModel = require('../services/model/contentModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');
var Q = require('q');

module.exports = _.merge(_.cloneDeep(contentModel), {

    tableName: 'content',

    attributes: {

        content_type: {
            type: 'string',
            enum: ['incident-item', 'service-item'],
            defaultsTo: 'service-item'
        },

        description: {
            type: 'string',
            required: 'true'
        },

        short_title: {
            type: 'string',
            required: 'true'
        },

        buildPath: function() {
            this.path = this.feature_alias + '/'  + this.parent_application_alias + '/'  +  this.id + '-' +   this.title.toLowerCase().split(' ').join('-');

            this.form_triggers = {
                create: 'service:' + this.custom_fields.service_data.code.replace('-', '_') + ':new',
                edit: 'service:' + this.custom_fields.service_data.code.replace('-', '_') + ':edit'
            };

        }

    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {

        Applications.findOne(post.parent_application)

            .populate('parent_feature')

            .then(function (app) {

                console.log('Update Post before Create');

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_feature.application_alias;

                post.uuid = uuid();
                console.log(post);
                console.log('Completed Update  Post before Create');
                next();

            });

    }


});
