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

/*        attachments: {
            type: 'array'
        },*/

        category: {
            type: 'string'
        },

/*        contact_person: {
            type: 'integer',
            model: 'users'
        },*/

        content: {
            type: 'string'
        },

        content_type: {
            type: 'string'
        },


/*        parent: {
            type: 'integer',
            model: 'yellowpages'
        },*/

        slug: {
            type: 'string'
        },


        tags: {
            type: 'string'
        },

        title: {

            type: 'string',
            required: true
        },

        work_unit: {
            type: 'integer'
        },

        views_count: {
            type: 'integer',
            defaultsTo: 0
        },

        visible: {
            type: 'boolean',
            defaultsTo: true
        },

        votes_count: {
            type: 'integer',
            defaultsTo: 0
        },

        votes_sum: {
            type: 'integer',
            defaultsTo: 0
        },


        published_status: function(){
            if(this.status &  HelperService.postStatus.published) {
                return 'Published';
            }

            return 'Waiting';
        }

	},

    // Lifecycle Callbacks
    beforeCreate: function(post, next) {

        // Create new user password before create
        post.uuid = uuid();
        next();
    },

    afterCreate: function ( newPost, cb ) {

        console.log('inside of after create for the news post');

        Yellowpages.update({
            id: newPost.id
        }, {
            manager_url: newPost.manager_url.replace('{id}', newPost.id),
            edit_url:  newPost.edit_url.replace('{id}', newPost.id),
            path:  newPost.path.replace('{id}', newPost.id),
            slug:  newPost.slug.replace('{id}', newPost.id),
            url:  newPost.url.replace('{id}', newPost.id)
        }, function(err, success){
            //if error
            if(err) {
                console.log(err);
                return cb(err);
            }

            return cb();
        });


    }


});
