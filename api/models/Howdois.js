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
            enum: ['How Do I - Task', 'How Do I - Guide'],
            defaultsTo: 'How Do I - Task'
        },

        status: {
            type: 'integer'
        },


        parent: {
            type: 'integer',
            model: 'howdois'
        },

        title: {

            type: 'string',
            required: true
        },

        work_unit: {
            type: 'integer',
            model: 'profiles'
        },

        views_count: {
            type: 'integer',
            defaultsTo: 0
        },


        votes_count: {
            type: 'integer',
            defaultsTo: 0
        },

        published_status: function(){
            if(this.status &  HelperService.postStatus.published) {
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

                console.log('building post informatioin');

               //post.slug = '/{id}/' + post.category.toLowerCase().split(' ').join('-') + '/' + post.title.toLowerCase().split(' ').join('-');
               post.slug = '/{id}/' + post.title.toLowerCase().split(' ').join('-');
               post.path = app.path + post.slug; //slug to be created using eg. /2014/02/19/category/title/index.html
               post.admin_path = app.admin_path + "/posts/{id}"

               post.parent_application_alias = app.alias;
               post.parent_application_feature = app.parent_application_feature.application_alias;

               console.log(post);
               post.uuid = uuid();
               next();

            })


    },

    afterCreate: function ( newPost, next ) {

        console.log('inside of after create for the yp post');
        Howdois.update({
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
