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

        //array of user names, email
        users: {
            type: 'array'
        },

        content_type: {
            type: 'string',
            defaultsTo: 'user group'
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

//console.log(post.parent_application);

        Applications.findOne(post.parent_application)
            .populate('parent_feature')
            .then(function (app) {

                console.log(app);

                post.path = app.path +'/{id}-' + post.title.toLowerCase().split(' ').join('-');
                post.admin_path = app.admin_path + "/posts/{id}";

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_feature.application_alias;

                post.uuid = uuid();
                next();

            });
        // Create new user password before create

    },

    afterCreate: function (newPost, next) {

        console.log('inside of after create for the news post');

        Usergroups.update({
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
