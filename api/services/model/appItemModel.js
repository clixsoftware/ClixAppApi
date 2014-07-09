/**
 * Spaces Model
 *
 * @module      ::
 * @description :: Base for spaces model.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var dataModel = require('../model/dataModel'); //inherit from the base model
var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(dataModel), {

    attributes: {

        attachments: {
            type: 'json'
        },

        content_type: {
            type: 'string'
        },

        parent_application: {   //parent application where the item was created
            type: 'integer'
        },

        parent_application_alias: {
            type: 'string'
        },

        parent_application_feature:{
           type: 'string'
        },

        path: { //  /sites/news/category
            type: 'string'
        },

        categories: {
            type: 'array'
        },
        tags: {
            type: 'array'
        }

    }

});
