/**
 * TaxController.js
 *
 * @description :: Manages the categories, taxonomy for the website
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    //Get all 'Taxonomy' Applications
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
    getPosts: function(req, res){

        console.log('getting posts for the categories');

        Category.find({
            parent_application: req.param('id')
        }).done(function(err, success){

                if(err) return res.json(err, 500);

                return  res.json(success);

            });
    },

    //create a new post for an application
     createPost: function(req, res){

        var newsPost = {};
        newsPost.title = req.param('title');
        newsPost.description = req.param('description');
        newsPost.code = req.param('code');


        //auto
        newsPost.parent_application = req.param('id');

        Category.create(newsPost)
            .then(function(post){
                return res.json(post, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });


    },

    //get posts by the feature and the application alias
    getPostsByAlias: function(req, res){

        Newspost.find({
            parent_application_alias: req.param('application_alias'),
            parent_application_feature:  req.param('feature_alias')
        }).done(function(err, success){

                if(err)  return res.json(err, 500);

                return res.json(success);
            })
    }

};

var _moduleData = {
    title: 'Taxonomy Manager',
    description: 'Manages the keywords and categorization of the intranet',
    application_alias: 'taxonomy'

};
