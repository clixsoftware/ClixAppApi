/**
 * Created by developer on 2/12/14.
 */

/** data model that supports title **/

var baseModel = require('../model/baseModel'); //inherit from the base model
var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(baseModel), {

    attributes: {

        created_by: {
            model: 'users'
        },

        deleted_by: {
            model: 'users'
        },

        owned_by: {
            model: 'users'
        },

        deleted_date: {    //id of person creating the record
            type: 'datetime'
        },

        is_deleted: {
            type: 'boolean',
            defaultsTo: false
        },

        uuid: { //guid of the record
            type: 'string',
            uuidv4: true
        },

        updated_by: {
            model: 'users'
        }

    }

});
