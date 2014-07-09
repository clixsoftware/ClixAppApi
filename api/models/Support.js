/**
 * Newspost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var appItemModel = require('../services/model/appItemModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(appItemModel), {

	attributes: {

        content: {
            type: 'string'
        },

        content_type: {
            type: 'string',
            enum: ['support feedback', 'support ticket', 'support idea'],
            defaultsTo: 'support feedback'
        },

        support_category: {
            type: 'string',
            enum: ['request', 'other', 'feedback', 'idea'],
            defaultsTo: 'feedback'
        },

        email: {
            type: 'email',
            required: true
        },

        ip: {
          type: 'string'
        },

        status: {
            type: 'integer'
        },

        title: {
            type: 'string',
            required: true
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
            //  this.buildApiLinks();

            var obj = this.toObject();

            // delete obj.edit_url;
            //delete obj.manager_url;

            return obj;
            //delete obj._csrf;
        }

	},

    // Lifecycle Callbacks
    beforeCreate: function(post, next) {
        //get the application

       Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function(app){

              // console.log(app);
                console.log('building post informatioin');

               var slug = '/{id}/' + post.title.toLowerCase().split(' ').join('-');

               post.admin_path = app.admin_path + "/posts/{id}";
              post.uuid = uuid();
               post.path = app.path + "/" +  post.uuid;

               console.log(post);
                next();

            })


    },

    afterCreate: function ( newPost, next ) {

        console.log('inside of after create for the feedback post');
        Support.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id)/*,
            path: newPost.path.replace('{id}', newPost.id)*/
        }, function (err, success) {
            if (err) return next(err);

            next();
        });


    }


});
