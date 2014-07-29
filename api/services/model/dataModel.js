/**
 * Created by developer on 2/12/14.
 */

/** data model that supports title **/

var baseModel = require('../model/baseModel'); //inherit from the base model
var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(baseModel), {

    attributes: {

        content_type: {
            type: 'string'
        },

        author: {
            model: 'users'
        },

        approver:  {
            type: 'integer'
        },

        editor: {
            model: 'users'
        },

        owner: {
            model: 'users'
        },

        deletor: {
            model: 'users'
        },

        deleted_date: {    //id of person creating the record
            type: 'datetime'
        },

        deleted: {
            type: 'boolean',
            defaultsTo: false
        },

        uuid: { //guid of the record
            type: 'string',
            uuidv4: true
        },

        attachments: {
            type: 'json'
        },

        categories: {
            type: 'array'
        },
        tags: {
            type: 'array'
        }


    }

});
