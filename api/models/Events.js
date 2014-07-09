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


/*        attendees_can_edit: {

        },


        all_day: {
            type: 'boolean',
            defaultsTo: false

        },
*/

        event_type: {
            type: 'integer',
            defaultsTo: 0
        },

        event_topic: {
            type: 'integer',
            defaultsTo: 0
        },

        end_date: {
            type: 'datetime'
        },

        content: {
          type: 'string'
        },

        content_type: {
            type: 'string',
            enum: ['event item'],
            defaultsTo: 'event item'
        },

        location: {
            type: 'string'

        },

        organizer_name: {
            type: 'string'
        },

        organizer_description: {
            type: 'string'
        },

        privacy_type: {
            type: 'string',
            enum: ['company', 'project', 'personal'],
            defaultsTo: 'company'
        },

        repeat_type: {
            type: 'integer',
            defaultsTo: 0
        },


        start_date: {
            type: 'datetime'
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


        Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function (app) {

                console.log('app - ' + JSON.stringify(app.parent_application_feature));

                console.log('building post information');

                var mDate = moment().format('YYYY/MM/DD');

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

        Events.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id),
            path: newPost.path.replace('{id}', newPost.id)
        }, function (err, success) {

            if (err) return next(err);

             next();
        });

    }

    /*   beforeValidation: function(post_record, next){

     Newspost.findOne(post_record.id).exec(function(err, post){

     if(err) return next(err);

     next();
     })
     },*/

    /*    beforeUpdate: function(post_record, next){

     //get the parent applicaiton

     console.log('Post_record  ' +  JSON.stringify(post_record));

     console.log('<<< beforeUpdate callback >>>');
     console.log('<<< title  ' + post_record.title );
     App.findOne(post_record.parent_app).done(function(err, parent_app){


     console.log('find parent application ' + post_record.parent_app);

     if(err) return next(err);

     if(parent_app){

     var mDate = moment().format('YYYY/MM/DD');

     var slug = post_record.category.toLowerCase().split(' ').join('-')+ '/' +mDate + '/' +  post_record.short_title.toLowerCase().split(' ').join('-');

     var path = parent_app.path + slug; //slug to be created using e..g /2014/02/19/category/title/index.html
     var url = parent_app.path + slug + '/index.html';

     post_record.path = path;
     post_record.url = url;
     post_record.slug = slug;

     console.log(JSON.stringify(post_record));


     next();

     }else{
     next();
     }

     });



     }*/

});
