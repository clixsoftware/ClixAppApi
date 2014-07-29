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

       content_type: {
            type: 'string',
            enum: ['Blog Post'],
            defaultsTo: 'Blog Post'
        }


    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {


        Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function (app) {

                console.log('building post informatioin');

                var mDate = moment().format('YYYY/MM/DD');

                var slug = '/{id}/' +  mDate + '/' + post.short_title.toLowerCase().split(' ').join('-');
                //post.slug = '/{id}/' + post.short_title.toLowerCase().split(' ').join('-');
                post.path = app.path + slug; //slug to be created using eg. /2014/02/19/category/title/index.html
                post.admin_path = app.admin_path + "/posts/{id}";

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_application_feature.application_alias;

                console.log(post);
                post.uuid = uuid();
                next();

            });

        // Create new user password before create

    }


 });
