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

        //indicate if the term is a clone of another this implies the uuid of the parent
        //must be used instead, therefore duplications of uuid possible

        cloned: {
            type: 'boolean',
            defaultsTo: false
        },

        clone_id: {
            type: 'integer'
        },

        content_type: {
          type: 'string',
          enum: ['Taxonomy Root', 'Taxonomy Group', 'Taxonomy Term Store', 'Taxonomy Term'],
          defaultsTo: 'Taxonomy Term'
        },

        enable_tagging: {
            type: 'boolean',
            defaultsTo: false
        },

        node_path: {
            type: 'array'
        },

        parent_node: {
            type: 'integer'
        },

       usage_count: {
          type: 'integer',
          defaultsTo: 0
        },

        buildLinks: function () {

            this.urls = {
                edit: {
                    href: this.path + '/edit',
                    title: 'Edit Category',
                    description: 'Click to edit this category'
                },

                show: {
                    href: this.path + '/index.html',
                    title: 'Display items tagged with this category',
                    description: 'Display item in this keyword'
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
    beforeCreate: function ( post, next ) {
        //get the application

        Applications.findOne(post.parent_application)
            .populate('parent_application_feature')
            .then(function ( app ) {

                console.log('building category informatioin');

              //  post.path = app.path + '/' + post.code; //slug to be created using eg. /2014/02/19/category/title/index.html
              //  post.admin_path = app.admin_path + "/posts/{id}"

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_application_feature.application_alias;

                console.log(post);
                post.uuid = uuid();
                next();

            })


    },

    afterCreate: function ( newPost, next ) {

/*        console.log('inside of after create for the yp post');
        Taxonomy.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id),
            path: newPost.path.replace('{id}', newPost.id)
        }, function ( err, success ) {
            if (err) return next(err);

            next();
        });*/


    }


});
