/**
 * Newspost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var appItemModel = require('../services/model/appItemModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(appItemModel), {

    attributes: {
        //form to be used
        content: {
          type: 'string'
        },

        content_type: {
            type: 'string',
            enum: ['service request'],
            defaultsTo: 'service request'
        },

        //custom form trigger
        form_trigger_load: {
            type: 'string',
            defaultsTo: 'services:submit:common'
        },

        form_trigger_submit: {
            type: 'string',
            defaultsTo: 'services:submit:common'
        },

        help:{
            model: 'howdois'
        },

        metadata: {
            type: 'boolean',
            defaultsTo: true
        },

        service_code: {
            type: 'string'
        },

        service_type: {
            type: 'string',
            enum: ['realtime', 'batch', 'blackbox'],
            defaults: 'realtime'
        },
        sla: {
            type: 'integer',
            defaultsTo: 7

        },

        sla_reminder: {
            type: 'integer',
            defaultsTo: 3
        },

        status: {
          type: 'integer',
          defaultsTo: 0

        },

        views_count: {
            type: 'integer',
            defaultsTo: 0

        },

        votes_count: {
            type: 'integer',
            defaultsTo: 0

        },

        work_unit: {
            model: 'profiles'
        },

        title: {

            type: 'string',
            required: true
        },

/*
        published_status: function () {
            if (this.status & HelperService.postStatus.published) {
                return 'Published';
            }

            return 'Waiting';
        },
*/


        buildLinks: function () {

            this.urls = {
                edit: {
                    href: this.path + '/edit',
                    title: 'Edit Feature',
                    description: 'Click to edit this feature'
                },

                show: {
                    href: this.path + '/index.html',
                    title: 'Feature Manager Home',
                    description: 'Go to directory manager home'
                }
            };


            return;


        },

        toJSON: function () {


            this.buildLinks();
            var obj = this.toObject();

            return obj;

        }



    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {

console.log(post.parent_application);

        Applications.findOne(post.parent_application)
            .populate('parent_feature')
            .then(function (app) {

                console.log(app);

                post.path = app.path +'/{id}/' + post.title.toLowerCase().split(' ').join('-');
                post.admin_path = app.admin_path + "/posts/{id}"

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_feature.application_alias;

                post.uuid = uuid();
                next();

            });
        // Create new user password before create

    },

    afterCreate: function (newPost, next) {

        console.log('inside of after create for the news post');

        Service.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id),
            path: newPost.path.replace('{id}', newPost.id)
        }, function (err, success) {

            if (err) return next(err);

             next();
        });

    }


});
