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

    connection: 'hmisDevelopment',

    attributes: {

        beds: {
            type: 'integer'
        },

        beds_occupied: {
            type: 'integer'
        },

        code: {
            type: 'string'
        },

        content_type: {
            type: 'string',
            enum: ['ward', 'department']
         },

        manager: {
            type: 'integer'
        },

        location: {
          type: 'string'
        },

        profile: {
            type: 'integer'
        },

        status: {
            type: 'integer'
        },

        views_count: {
            type: 'integer',
            defaultsTo: 0
        },

        votes_count: {
            type: 'integer',
            defaultsTo: 0
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
            .then(function(app){

                post.admin_path = '/backoffice/hmis/wards/{id}';
                post.uuid = uuid();
                post.path = app.path + "/wards/" +  post.code;

                console.log(post);
                next();

            })

    },

    afterCreate: function (newPost, next) {

        Wards.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id)
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
