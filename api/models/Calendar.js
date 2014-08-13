/**
 * Newspost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var contentModel = require('../services/model/contentModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(contentModel), {

    tableName: 'content',

    attributes: {

/*   custom_fields: {
            event_type: 0,
            event_topic: 'HR',
            end_date: '8/21/2014',
            location: 'Locatio of the event',
            organizer: 'Name of the organizer',
            organizer_about: 'About the organizer'
            organizer_contact: {
                email: 'organizer@email.com',
                phone: '87655555'
            },
            privacy_type: "company, project, personal",
            repeat_type: 'weekly'
        },*/

        content_type: {
            type: 'string',
            defaultsTo: 'calendar-event'
        }

    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {

        Applications.findOne(post.parent_application)

            .populate('parent_application_feature')

            .then(function (app) {

                post.feature_alias = 'calendar';
                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_application_feature.application_alias;

                post.uuid = uuid();
                next();

            });

    }


});
