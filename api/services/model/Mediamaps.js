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

        caption: {
            type: 'string'
        },

        class_name: {
            type: 'string'
        },

        content_type:{
            type: 'string'
        },

        media_type: {
            type: 'string',
            enum: ['image', 'image gallery', 'video', 'attachment', 'form', 'application form', 'online form', 'youtube video', 'vimeo video', 'other video'],
            defaultsTo: 'image'

        },

        object_id: {
            type: 'string'

        },

        settings: {
            type: 'string',
            enum: ['embed', 'standalone', 'modal', 'link'],
            defaultsTo: 'standalone'
        },

        source_url: {
            type: 'string'
        },

        thumbnail_url: {
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

	}

};
