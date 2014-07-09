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
var Q = require('q');

module.exports = _.merge(_.cloneDeep(contentModel), {

    attributes: {

        content_type: {
            type: 'string',
            enums: ['channel', 'page'],
            defaultsTo: 'page'
        },

        approved_by: {
            type: 'integer'
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

        getMedia: function(){

            return Q(Mediamaps.findOne({
                object_id: this.uuid
            })).then(function(success){

                return success;
            });

        },


        toJSON: function () {


            this.buildLinks();
           // console.log(JSON.stringify(this.getMedia()));

            //console.log(JSON.stringify(this.media));

            var obj = this.toObject();

            return obj;

        }



    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {


        Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function (app) {

                console.log('building post informatioin');

                var mDate = moment().format('YYYY/MM/DD');

                post.path = app.path + '/{id}/' + post.short_title.toLowerCase().split(' ').join('-');
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

        Newspost.update({
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
