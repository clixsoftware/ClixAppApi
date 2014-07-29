/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var util = require('util');

module.exports = {
    //get all applications
    index: function ( req, res ) {

        Applications.find({
            app_alias: _moduleData.application_alias
        }).exec(function(err, success){

            if(err) return res.json(err, 500);

            return res.json(success);
        })
    },

    //get application with the :id
    find: function(req, res){
        Applications.findOne(req.param('id'))
            .then(function(app){

                return res.json(app);
            });
    },

    //create a new application
    create: function(req, res){
        return res.json({
            message: 'To be implemented'
        })
    },

    //get the feature manager
    getManager: function(req, res){

        Features.findOne({
            application_alias: _moduleData.application_alias
        }).exec(function(err, success){

            if(err) return res.json(err, 500);

            return res.json(success);
        })
    },

    //install the feature manager
    install: function ( req, res ) {
        var errors = [];

        Features.create(_moduleData)
            .then(function(feature){
                return res.json(feature, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });
    },

    //create a new post
    createPost: function(req, res){

        var Model = Newspost;

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = actionUtil.parseValues(req);

        /*        if(req.user && req.user.id){
         data.creator = req.user.id;
         }*/

        // Create new instance of model using data from params
        Model.create(data).exec(function created (err, newInstance) {
            if (err) return res.negotiate(err);

            res.status(201);
            res.json(newInstance.toJSON());
        });

    },

     findPosts: function findRecords (req, res) {


        // Look up the model
        var Model = CalendarEvent;

        // var modelName = req.options.model || req.options.controller;

        var paging = {
            limit: actionUtil.parseLimit(req),
            skip:   actionUtil.parseSkip(req)
        };

        // Lookup for records that match the specified criteria
        var query = Model.find()
            .where( actionUtil.parseCriteria(req) )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );

        // TODO: .populateEach(req.options);
        //query = actionUtil.populateEach(query, req.options);

        query.exec(function found(err, matchingRecords) {
            if (err) return res.serverError(err);

            // Only `.watch()` for new instances of the model if
            // `autoWatch` is enabled.
            if (req._sails.hooks.pubsub && req.isSocket) {

                Model.subscribe(req, matchingRecords);
                if (req.options.autoWatch) {
                    Model.watch(req);
                }

                // Also subscribe to instances of all associated models
                _.each(matchingRecords, function (record) {
                    actionUtil.subscribeDeep(req, record);
                });

            }

            //Check if only requesting one record
            if(!req.param('id')){
                //Get the Count of the records
                Model.count(actionUtil.parseCriteria(req)).exec(function (err, found) {
                    var ret = {
                        models: matchingRecords,
                        total: found,
                        page: paging.skip ? paging.skip + 1 : 0,
                        limit: paging.limit ? paging.limit : 0
                    };
                    return res.json(ret);

                });
            }else{

                if(matchingRecords){
                    var post = matchingRecords[0];

                    var viewCount = post.views + 1;
                    CalendarEvent.update({
                        id: post.id
                    }, {
                        views: viewCount
                    }).exec(function(err, posts){
                        return res.json(posts[0]);
                    });

                }else{
                    return res.json({
                        message: 'Record not found'
                    }, 404);
                }

            }
        });

    }
}

var _moduleData = {
    title: 'Calendar Manager',
    description: 'Manages the Events',
    application_alias: 'calendar'

};
