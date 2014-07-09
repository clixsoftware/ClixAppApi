/**
 * Generic Content Model
 *
 * @module      :: Model
 * @description :: Base content model for generic content, news, blog,
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var appItemModel = require('../model/appItemModel'); //inherit from the base model
var _ = require('lodash');
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(appItemModel), {

    attributes: {

        content: {
            type: 'string'
        },

        expiry_date: {
            type: 'datetime'
        },

        publication_date: {
            type: 'string'
        },

        short_title: {
            type: 'string'
        },

        start_date: {
            type: 'datetime'
        },

        status: {
            type: 'integer'
        },

        version: {
            type: 'integer'
        },

        views_count: {
            type: 'integer',
            defaultsTo: 0
        },

        votes_count: {
            type: 'integer',
            defaultsTo: 0
        }
    }

});
