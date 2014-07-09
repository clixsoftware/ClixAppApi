/**
 * NewspostController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var Q = require('q');
var _ = require('lodash');
var uuid = require('uuid-v4');

module.exports = {

    getFeatured: function(req, res){

        Newspost.find({
            parent_application_alias:  req.param('application_alias'),
            parent_application_feature: req.param('feature_alias')
        }).exec(function(err, posts){

                if(err){
                    return res.json(err, 500)
                }else{
/*
                    var models = _.find(posts, function(model){
                        return model.status & HelperService.postStatus.featured
                    });

                    // console.log(models);
                    return res.json( models);*/

                  var postsLength = posts.length - 1;

                    var models = [];
                    posts.forEach(function(post, i) {

                        console.log('item - ' + i);
                        if(post.status & HelperService.postStatus.featured){

                            models.push(post);
                        }

                        if(i >= postsLength){
                            return res.json(models);
                        }

                        // send request in last array item
                        //if (i >= postsLength) {

                            //var models = _.find(posts, function(model){
                           //     return model.status & HelperService.postStatus.featured
                           // });

                            // console.log(models);
                           // return res.json( models);

                        //}

                    });



                }
            })
    },

    getTrending: function ( req, res ) {

        Newspost.find({limit: 5}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function ( item ) {
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            } else {

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }


        });

    },

    getRelated: function ( req, res ) {

        Newspost.find({limit: 5}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function ( item ) {
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            } else {

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }


        });

    },

    getRecommended: function ( req, res ) {

        Newspost.find({limit: 5}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function ( item ) {
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            } else {

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }


        });

    },

    getLatest: function ( req, res ) {

        Newspost.find({limit: 5}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function ( item ) {
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            } else {

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }


        });

    },

    findHomeFeatured: function ( req, res ) {

        var params = {};
        params.id = req.param('id');

        if (!params.id) {

            // return res.json({error: 'Id is required'});

        }

        Newspost.find({show_on_homepage: true, is_featured: true}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function ( item ) {
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }

        });

    },

    findByApp: function ( req, res ) {

        var params = {};
        params.id = req.param('id');

        if (!params.id) {

            return res.json({error: 'Id is required'});

        }

        Newspost.find({parent_app: params.id}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function ( item ) {
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }

        });

    },

    find1: function ( req, res ) {

        console.log('finding post..');

        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(SystemMessages.method_not_allowed_error('GET'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);

        }


        //check if id is passed in params
        if (req.param('id')) {

            console.log('<< Finding Post using the ID >> ' + req.param('id'));

            if (req.param('id')) {

                console.log('Find by ID');

                Newspost.findOne(req.param('id')).exec(function ( err, success ) {

                    if (err) return res.json(err);

                    if (success) {
                        return res.json(success);
                    } else {

                        errors.push(SystemMessages.no_record_found_error);

                        req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                        return res.json(req.results, SystemMessages.noRecordsFoundError.status);
                    }


                });

            }

        } else {
            var query = require('url').parse(req.url, true).query;

            console.log('<< Finding Post using queryy >>');
            // console.log('find key ' + _.has(query, 'url'));

            console.log(query);
            var search = HelperService.merge({}, query);

            var q = {};

            if (_.has(query, 'limit')) {
                //remove the limit param
                //add to q
                q.limit = search.limit;

            }

            if (_.has(query, 'sort')) {
                //remove the limit param
                //add to q
                q.sort = search.sort;
                //query = _.remove(query, 'sort');
            }
            query = _.pull(query, 'limit', 'sort');
            console.log(query);

            //q.where = ;

            if (_.has(query, 'slug')) {
                console.log('using slug find one');
                Newspost.findOne(search).populate('createdby_user_id')
                    .exec(function ( err, user ) {

                        if (err) return res.json(err);

                        if (user) {
                            user.createdby_user_id = _.pick(user.createdby_user_id, 'title', 'email');
                            return res.json(user);
                        }

                        return res.json({error: 'record not found'});
                    });

            } else {
                console.log('Modified search ' + JSON.stringify(query));
                console.log('Modified q ' + JSON.stringify(q));

                Newspost.find(search).exec(function ( err, user ) {

                    if (err) return res.json(err);

                    if (user) return res.json(user);
                });

            }


        }


    },

    findAll: function ( req, res ) {

        console.log('finding feature..');

        var errors = {};

        //Only accept 'POST' request, all other request are rejected
        if (req.method != 'GET') {
            return res.json('Only GET request are accepted on this resource');
        }

        //use the query params instead
        var query = require('url').parse(req.url, true).query;

        console.log('find key ' + _.has(query, 'url'));

        console.log(query);

        var search = HelperService.merge({}, query);

        console.log(search);
        if (_.isEmpty(search)) {

            Newspost.find().done(function ( err, success ) {

                console.log('find all no query');

                if (err) return res.json(err);

                if (success) {
                    return res.json(success);

                } else {

                    return res.json({error: 'Record not found'}, 404);
                }

            });

        } else {

            Newspost.find(search).done(function ( err, success ) {

                console.log('using query ' + search);

                if (err) return res.json(err);

                if (!_.isEmpty(success)) {
                    return res.json(success);
                } else {

                    return res.json({error: 'Record not found'}, 404);
                }

            });

        }

    },

    update: function ( req, res ) {

        console.log('In the Newspost : controller : update');

        Newspost.update({
            id: req.param('id')
        }, {
            link_title: req.param('link_title'),
            content: req.param('content'),
            category: req.param('category'),
            title: req.param('title')
        }, function ( err, success ) {

            //if error
            if (err) return res.json(err);

            return  res.json(success);
        });


    },

    addCategory: function(req, res){

        var postId = req.param('id');
        var categoryCode = req.param('category_code');

        Q(Newspost.findOne(postId))
            .then(function (post) {

                //find the id of the
                var category = Category.findOne()
                    .where({
                        code: categoryCode
                    })
                    .then(function (category) {
                        return category;
                    });

                return [post, category];

            })
            .spread(function (post, category) {

                var addCategory = {
                    tax_id: category.id,
                    object_id: post.uuid,
                    content_type: 'News Post',
                    root_app_id: post.parent_application_alias
                };


                console.log(addCategory);

                Taxmap.findOne({
                    tax_id: addCategory.id,
                    object_id: addCategory.object_id
                }).done(function(err, success){

                        if(err) return res.json(err, 500);

                        if(success){
                            console.log('return ing  success');
                            return res.json(success);

                        } else{

                            Taxmap.create(addCategory)
                                .then(function(row){
                                    return res.json(row);
                                })
                                .fail(function(error){
                                    return res.json(error, 500);
                                });

                        }

                    })


            });
    },

    test: function(req, res){

        Q(Newspost.findOne(req.param('id')))
            .then(function(newspost){

              // console.log(newspost);

              var tes = Q(Taxmap.find({
                  object_id: '80af702e-aba2-4219-8bc1-67728fd190c1'
                   }))
                  .then(function(model){
                      //console.log(model);
                        return model;
                    });



              return ([tes, newspost]);
            })
            .spread(function(tes, newspost){
                console.log(JSON.stringify(tes));
                newspost.tes = tes;

                return res.json(newspost);
            })
    },

    search: function(req, res){

        var query = require('url').parse(req.url, true).query;

        console.log(query);


        var search = {};

        if(_.has(query, 'criterion')){
            search.title = {
                'contains': req.param('criterion')
            };


        }
        console.log(search);

        Newspost.find(search)
            .done(function(err, success){
                if(err) return res.json(err, 500);

                return res.json(success);
            })
    },

    getById: function(req, res){

        console.log('using tracker');
        Newspost.findOne(req.param('id'))
            .exec(function(err, success){

                if(err){
                    return res.json(err, 500);
                }else{

                    var viewCount = success.views_count + 1;
                    Newspost.update({
                        id: req.param('id')
                    }, {
                        views_count: viewCount
                    }).exec(function(err, posts){


                        return res.json(posts[0]);

/*                        var postsLength = posts.length - 1;

                        posts.forEach(function(post, i) {

                            console.log('item - ' + i);

*//*                            Mediamaps.findOne({
                                object_id: post.uuid
                            }).exec(function ( err, media ) {

                                if(media){
                                    posts[i].media = media;
                                }else{
                                    posts[i].media = {};
                                }


                                // send request in last array item
                                if (i >= postsLength) {

                                    // console.log(models);
                                    return res.json( posts[0]);

                                }

                            });*//*
                        });


                      //return res.json(updated[0]);*/

                    });
                    //return res.json(success);
                }
            });

    }

};
