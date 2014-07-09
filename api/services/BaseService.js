/**
 * Applicaiton Manager Model
 *
 * @module      ::
 * @description :: Base for spaces model.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var _ = require('lodash');
module.exports = {

    handleError: function(err){

    },

    handleSuccess: function(model, msg, next){
        msg.data = model;
        return next(msg);

    }

};
