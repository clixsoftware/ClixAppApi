/**
 * Newspost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
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
            enum: ['How Do I - Task', 'How Do I - Guide'],
            defaultsTo: 'How Do I - Task'
        }

	},

    // Lifecycle Callbacks
    beforeCreate: function(post, next) {
        //get the application

       Applications.findOne(post.parent_application)
            .populate('parent_feature')
            .then(function(app){

                console.log('building post informatioin');

               console.log(app);

               post.parent_application_alias = app.alias;
               post.parent_application_feature = app.parent_feature.application_alias;

               console.log(post);
               post.uuid = uuid();
               next();

            })


    }/*,

    afterCreate: function ( newPost, next ) {

        console.log('i  nside of after create for the yp post');
        Howdois.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id),
            path: newPost.path.replace('{id}', newPost.id)
        }, function (err, success) {
            if (err) return next(err);

            next();
        });


    }*/


});
