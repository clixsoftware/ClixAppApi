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

/*        var newsPost = {};
        newsPost.title = req.param('title');
        newsPost.description = req.param('description');
        newsPost.category = req.param('category');
        newsPost.content = req.param('content');
        newsPost.cover_image = req.param('cover_image');
        //  newsPost.created_by = req.param('created_by');
        newsPost.is_featured = req.param('is_featured');
        newsPost.link_title = req.param('link_title');
        newsPost.tags = req.param('tags');
        newsPost.thumbnail = req.param('thumbnail');
        newsPost.status =  HelperService.postStatus.published;

        //auto
        newsPost.parent_application = req.param('id');*/

  /*      Newspost.create(newsPost)
            .then(function(post){
                return res.json(post, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });
*/

    },

    //get posts for an application using the 'Id'
    getPosts: function(req, res){

        Newspost.find({
            parent_application: req.param('id')
        }).exec(function(err, posts){

                if(err) return res.json(err, 500);

                if(posts){

                    //get the category that goes with it
                //                    success.getCategories();

  /*                  var postsLength = posts.length - 1;

                    posts.forEach(function(post, i) {

                        console.log('item - ' + i);

                        Mediamaps.findOne({
                            object_id: post.uuid,
                            media_type: 'image'
                        }).exec(function ( err, media ) {

                            if(media){
                                posts[i].media = media;
                            }else{
                                posts[i].media = {};
                            }


                            // send request in last array item
                            if (i >= postsLength) {
*/
                                // console.log(models);
                                return res.json( posts);
/*
                            }

                        });
                    });*/

                    //return  res.json(success);
                }else{
                    return res.json({}, 404);
                }




            });
    },

    findPosts: function findRecords (req, res) {


       // Look up the model
        var Model = Newspost;

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

                   // return res.json(ret);
                    return res.json(matchingRecords);

                });
            }else{

                if(matchingRecords){
                    var post = matchingRecords[0];

                    var viewCount = post.views + 1;
                    Newspost.update({
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

    },

    searchPosts: function findRecords (req, res) {


        // Look up the model
        var Model = Newspost;

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

        });

    }
};

var _moduleData = {
    title: 'News Manager',
    description: 'Manages the home page of the intranet',
    application_alias: 'news'

};
