/**
 * Projects Manager Controller.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Q = require('q');

module.exports = {

    //Get all 'News' Applications
    index: function ( req, res ) {

        Applications.find({
            app_alias: _moduleData.application_alias
        }).done(function(err, success){

                if(err) return res.json(err, 500);

                return res.json(success);
            })
    },

    //Install the feature
    installFeature: function ( req, res ) {
        var errors = [];

        Features.create(_moduleData)
            .then(function(feature){
                return res.json(feature, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });



    },

    //get the feature information
    getFeature: function(req, res){

        Features.findOne({
            application_alias: _moduleData.application_alias
        }).done(function(err, success){

                if(err) return res.json(err, 500);

                return res.json(success);
            })
    },

    //get posts for an application using the 'Id'
 /*   getBlogPosts: function(req, res){

        Blogposts.find({
            parent_application: req.param('id')
        }).done(function(err, success){

                if(err) return res.json(err, 500);

                if(success){

                    //get the category that goes with it
                //                    success.getCategories();
                    return  res.json(success);
                }else{
                    return res.json({}, 404);
                }
            });
    },*/

    //create a new post for an application
     createBlogPost: function(req, res){

        var data = {};
         data.title = req.param('title');
         data.description = req.param('description');
         data.content = req.param('content');
         data.content_type  = 'Blog Post';
         data.short_title = req.param('short_title');
        //auto
         data.parent_application = req.param('id');

        Blogposts.create(data)
            .then(function(post){
                return res.json(post, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });


    },

    //get a blog using the application alias
    getBlogsByAppAlias: function(req, res){

        Blogs.find({
            parent_application_alias: req.param('application_alias'),
            parent_application_feature:  req.param('feature_alias')
        }).done(function(err, success){

                if(err)  return res.json(err, 500);

                return res.json(success);
            })
    },

    getBlogPosts: function(req, res){

        var blogId = req.param('id');

        Blogposts.find({
            parent_application: blogId
        })
            .populate('created_by')
            .exec(function(err, posts){
                if(err) return res.json(err, 500);

                return res.json(posts);
            })
    },

    getBlogRecentPosts: function(req, res){
        var blogId = req.param('id');
        var limit  = req.param('limit');

        if(!limit) limit = 5;

        Blogposts.find({
            where: {
                parent_application: blogId
            },
            sort: 'createdAt DESC',
            limit:  limit
        })
            .exec(function(err, posts){
                if(err) return res.json(err, 500);

                return res.json(posts);
            })

    }

};

var _moduleData = {
    title: 'Blogs Manager',
    description: 'Manages Blpgs',
    application_alias: 'blogs'

};
