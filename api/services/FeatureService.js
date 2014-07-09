/**
 * Manager Model
 *
 * @module      ::
 * @description :: Base for spaces model.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var _ = require('lodash');
var Q = require('q');
var baseService = require('../services/BaseService');

module.exports = _.merge(_.cloneDeep(baseService), {

    create: function(feature){

       return  Features.findOne()
            .where(
             {application_alias: feature.application_alias}
             )
            .then(function(model){
               console.log('<create>Feature Service</create>');
                if(!model){

                   Features.create(feature)
                      .done(function(err, success){

                          if(err) {
                              console.log('<err>Feature Service</err><create></create>');
                              console.log(err);
                              return(err);
                          }


                          return success;
                      });
                }else{
                    return model;
                }
            });

    },

    getModule: function(alias){
        var that = this;

        return Features.findOne()
            .where({application_alias: alias})
            .then(function(model){
                return model;
             })

    },

    countApps: function(cb){
        Features.find().done(function(err, success){

            if(err) return res.json(err);

            if(success){
                return cb(success.length);
            }

        });
    }

});

