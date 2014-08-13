/**
 * Content.js
 *
 * @description :: This is the base table for applications based on the content object.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var contentModel = require('../services/model/contentModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');

module.exports = {

    attributes: {

        site_name: {
            type: 'string',
            defaultsTo: 'Default Website'
        },

        description: {
            type: 'string',
            defaultsTo: 'The description of the website.'
        },

        theme: {
            type: 'string',
            defaultsTo: 'default'
        },

        api_server_url: {
            type: 'string',
            defaultsTo: 'http://192.168.2.122:3100/api/v1/'
        },

        client_server_url: {
            type: 'string',
            defaultsTo: 'http://localhost:3001'
        },

        back_office_path: {
            type: 'string',
            defaultsTo: '/backoffice/{0}/apps/{1}'
        },

        home_action: {
            type: 'string',
            defaultsTo: 'sites:default:show'
        },

        error_action: {
            type: 'string',
            defaultsTo: 'core:error:show'
        },

        default_site: {
            type: 'string',
            defaultsTo: '/sites/corporate'
        },

        offline_action: {
            type: 'string',
            defaultsTo: 'sites:offline:show'
        },

        login_action: {
            type: 'string'
        },

        //0 = online, 1 = offline
        status: {
            type: 'integer',
            defaultsTo: 0
        },

        email_server: {
            type: 'string'
        },

        email_user: {
            type: 'string'
        },

        email_password:{
            type: 'string'
        },

        categories: {
            type: 'array'
        },

        tags: {
            type: 'array'
        },

        custom_fields: {
            type: 'json'
        }
    }

 };
