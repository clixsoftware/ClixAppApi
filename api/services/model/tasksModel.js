/**
 * Spaces Model
 *
 * @module      ::
 * @description :: Base for spaces model.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var appItemModel = require('../model/appItemModel'); //inherit from the base model
var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(appItemModel), {

    attributes: {

        assigned_to: {
            type:'integer'
        },

        completed_by: {
            model: 'users'
        },

        completed_date: {
            type: 'datetime'
        },

        content: {
            type: 'string'
        },

        due_date: {
            type: 'datetime'
        },

        //Time in minutes estimated for this task
        estimated_mins: {
            type: 'integer',
            defaultsTo: 30
        },

        is_private: {
            type: 'boolean',
            defaultsTo: false
        },

        //If this task as a parent
        parent_task: {
            type: 'integer'
        },

        priority: {
            type: 'integer',
            defaultsTo: 1
        },

        progress: {
            type: 'integer',
            defaultsTo: 0
        },

        state: {
          type: 'string',
          enum: ['new', 'deleted', 'completed', 'open'],
          defaultsTo: 'new'
        },

        start_date:{
            type: 'datetime'
        }

    }

});
