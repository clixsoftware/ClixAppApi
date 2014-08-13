/**
 * Projects.js
 *
 * @description :: Creates posts for the Project Manager data is saved in the cotent table.
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
            enum: ['forum-category', 'forum-topic', 'forum-post'],
            defaultsTo: 'project'
        },

        buildPath: function() {
            this.path =  '/' + this.parent_application_feature + '/'  + this.parent_application_alias + '/' + this.feature_alias + '/' +  this.id + '-' +   this.title.toLowerCase().split(' ').join('-');;
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
