/**
 * Classifieds.js
 *
 * @description :: Classified ad posting.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var contentModel = require('../services/model/contentModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');
var Q = require('q');
var S = require('string');


module.exports = _.merge(_.cloneDeep(contentModel), {

    tableName: 'content',

    attributes: {

        content_type: {
            type: 'string',
            enum: ['classified-ad'],
            defaultsTo: 'classified-ad'
        }

/*
        status: {
            type: 'string',
           enum: ['available', 'withdrawn', 'completed', 'cancelled', 'pending'],
            defaultsTo: 'pending'
        },

        price: {
            type: 'float',
             defaultsTo: 0
        },


        publish_status: {
            type: 'string',
            enum: ['pending', 'active', 'expired', 'blocked', 'removed'],
            defaultsTo: 'pending'
        },

        transaction: {
            type: 'string',
            enum: ['trade', 'lend', 'sell', 'free'],
            defaultsTo: 'sell'
        },
 */


    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {


        console.log('Classifieds before create');
      //  .populate('parent_application_feature')

        Applications.findOne()
            .where({id: post.parent_application})
            .then(function (app) {
               // var settings = JSON.parse(dtoPost.custom_fields);

               // var user = Profiles.

                post.feature_alias = 'classifieds';
                post.parent_application_alias = app.alias;
                post.parent_application_feature = 'classifieds';
                //post.parent_application_feature = app.parent_application_feature.application_alias;

                post.start_date = moment();
                post.expiry_date  = moment().add('days', 30);
                post.publication_date = moment().add('days', 2);
                post.status = 2
                post.description = S(post.content).left(50) + "...";

                post.uuid = uuid();
                console.log(post);

                next();

            });

        // Create new user password before create

    }

/*    afterCreate: function (newPost, next) {


    console.log('Classifieds - afterCreate Event');
 *//*
        Classifieds.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id),
            path: newPost.path.replace('{id}', newPost.id)
        }, function (err, success) {
            if (err) return next(err);

             next();
        });*//*

    }*/



});
