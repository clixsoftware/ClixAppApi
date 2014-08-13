/**
 * Newspost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var appItemModel = require('appItemModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');

module.exports =  {

	attributes: {

        tax_id: {
            type: 'integer',
            model: 'category'
        },

       object_id: {
            type: 'string'

        },

        content_type:{
            type: 'string'
        },

        root_app_id: {
            type: 'string'
        },

        toJSON: function () {


            //this.buildLinks();
            //  this.buildApiLinks();

            var obj = this.toObject();

            // delete obj.edit_url;
            //delete obj.manager_url;

            return obj;
            //delete obj._csrf;
        }

	},

/*    // Lifecycle Callbacks
    beforeCreate: function(post, next) {
        //get the application

       Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function(app){

                console.log('building category informatioin');

               post.path = app.path + '/' + post.code; //slug to be created using eg. /2014/02/19/category/title/index.html
               post.admin_path = app.admin_path + "/posts/{id}"

               post.parent_application_alias = app.alias;
               post.parent_application_feature = app.parent_application_feature.application_alias;

               console.log(post);
               post.uuid = uuid();
               next();

            })


    },*/

/*    afterCreate: function ( newPost, next ) {

        console.log('inside of after create for the yp post');
        Category.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id),
            path: newPost.path.replace('{id}', newPost.id)
        }, function (err, success) {
            if (err) return next(err);

            next();
        });


    }*/


};
