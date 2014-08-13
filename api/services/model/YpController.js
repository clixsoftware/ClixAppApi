/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    //Get all 'How Do I' Applications
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

        Howdois.find({
            parent_application: req.param('id')
        }).done(function(err, success){

                if(err) return res.json(err, 500);

                return  res.json(success);

            });
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
        //newsPost.category = req.param('category');
        newsPost.content = req.param('content');
        newsPost.content_type = req.param('content_type');
        //newsPost.tags = req.param('tags');
        newsPost.status =  HelperService.postStatus.published;

        //auto
        newsPost.parent_application = req.param('id');

        Howdois.create(newsPost)
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
    },

    getPostbyCategory: function(req, res){


    }


};

var _moduleData = {
    title: 'How Do I Manager',
    description: 'Manages Tasks and guidelines',
    application_alias: 'how-do-i'

};
var validateData;

validateData = function (app) {

    var errors = [];

    if (!app.alias) {
        errors.push({
            type: 'validation',
            field: 'alias',
            message: "Field <strong>alias</strong> is required"
        });
    }

    return errors;

};