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

        term: {
            type: 'integer',
            model: 'taxonomy'
        },

       object_id: {
            type: 'string'

        },

        content_type:{
            type: 'string'
        },

        root_app_id: {
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

	},


   afterCreate: function (newMap, next ) {

        console.log(JSON.stringify(newMap));


        Taxonomy.findOne(newMap.term)
            .done(function(err, model){

                console.log(model);
                if(err) next(err);

                var count = model.views_count + 1;
                model.views_count = count;

                model.save(function(error, s){

                });

                next();

            });


    }


};
