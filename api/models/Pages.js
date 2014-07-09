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

    attributes: {

        content_type: {
            type: 'string',
            enum: ['page post'],
            defaultsTo: 'page post'
        },

        approved_by: {
            type: 'integer'
        },

        parent: {
            type: 'integer',
            model: 'pages'
        },

        title: {

            type: 'string',
            required: true
        },

        published_status: function () {
            if (this.status & HelperService.postStatus.published) {
                return 'Published';
            }

            return 'Waiting';
        },


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


        Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function (app) {

                 post.path = app.path + '/{id}/' + post.title.toLowerCase().split(' ').join('-');
                post.admin_path = app.admin_path + "/posts/{id}";

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_application_feature.application_alias;

                console.log(post);
                post.uuid = uuid();
                next();

            });

        // Create new user password before create

    },

    afterCreate: function (newPost, next) {

        console.log('inside of after create for the news post');

        Pages.update({
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
