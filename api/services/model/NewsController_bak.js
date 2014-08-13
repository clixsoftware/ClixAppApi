/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    //Get the feature Information
    index: function ( req, res ) {
        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(SystemMessages.method_not_allowed_error('GET'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);

        }

        return NewsService.getFeature()
            .then(function ( model ) {
                if (!model) {
                    throw Error({
                        name: 'Feature was not found',
                        description: 'feature not found'

                    });
                }
                return res.json(model);
            })
            .fail(function ( err ) {
                return res.json(err, 500);
            });

    },

    install: function ( req, res ) {
        var errors = [];

        if (req.method != 'POST') {

            res.setHeader('Allowed', 'POST');
            errors.push(SystemMessages.method_not_allowed_error('POST'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);
        }

        NewsService.install()
            .then(
            function ( model ) {
                return res.json(model);
            },
            function ( error ) {
                console.log(error);
                return res.json(error, 500);
            });


    },

    applications: function ( req, res ) {

        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(SystemMessages.method_not_allowed_error('GET'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);
        }

        //check if id is passed in params
        if (req.param('id')) {

            Applications.findOne(req.param('id'))
                .done(function(err, success){

                    if(err) return res.json(err, 500);

                    if(success){
                        return res.json(success);
                    }
                })

        } else {

            var query = require('url').parse(req.url,true).query;
            var search = HelperService.merge({}, query);


            //if(_.has(query, 'alias')){

            //    NewsService.findByAlias(req.param('alias'))
            //        .then(function(model){

           //             if(model){
           //                 return res.json(model);
            //            }

              //      });
//

          //  }else{
                NewsService.getApplications(search)
                    .then(function ( models ) {

                        if (!models) {
                            return res.json(SystemMessages.recordNotFoundError, SystemMessages.recordNotFoundError.status);
                        }

                        return res.json(models);

                    });
           // }


        }


    },

    getPosts: function(req, res){

        return res.json({i: 'get all posts for this application ' + req.param('app_id')});
    },

    getPostsByAlias: function(req, res){

        return res.json({i: 'get all posts for this application ' + req.param('app_id')});
    },

    createPost: function(req, res){
        var errors = [];

        if (req.method != 'POST') {

            res.setHeader('Allowed', 'POST');
            errors.push(SystemMessages.method_not_allowed_error('POST'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);

        }

        var newsPost = {};
        newsPost.title = req.param('title');
        newsPost.description = req.param('description');
        newsPost.category = req.param('category');
        newsPost.content = req.param('content');
        newsPost.cover_image = req.param('cover_image');
        newsPost.created_by = req.param('created_by');
        newsPost.is_featured = req.param('is_featured');
        newsPost.link_title = req.param('link_title');
        newsPost.tags = req.param('tags');
        newsPost.thumbnail = req.param('thumbnail');
        newsPost.status =  HelperService.postStatus.published;

        //auto
        newsPost.parent_application = req.param('app_id');
        //console.log(newsPost);
/*        newsPost.updated_by = req.param('updated_by');
        newsPost.url = req.param('url');
        newsPost.path = req.param('path');
        newsPost.parent_app = req.param('parent_app');
        newsPost.edit_url = req.param('edit_url');*/

        NewsService.createPost(newsPost)
            .then(function(post){
                return res.json(post);
            }, function(err){
                return res.json(err, 500);
            })


    }


};
