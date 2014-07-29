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

        parent_application: {   //parent application where the item was created
            type: 'integer'
        },
        parent_application_alias: {
            type: 'string'
        },

        parent_application_feature:{
           type: 'string'
        },

        feature_alias: {
            type: 'string'
        }
        /*,

        path: { //  /sites/news/category
            type: 'string'
        }*/


    }

});
