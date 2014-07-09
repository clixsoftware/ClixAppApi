/**
 * Projects Manager Controller.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

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
    getProjects: function(req, res){

        Project.find({
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
    },

    //create a new post for an application
     createProject: function(req, res){

        var data = {};
         data.title = req.param('title');
         data.description = req.param('description');
         data.content = req.param('content');
        //auto
         data.parent_application = req.param('id');

        Project.create(data)
            .then(function(post){
                return res.json(post, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });


    },

    //get posts by the feature and the application alias
    getProjectsByAppAlias: function(req, res){

        Project.find({
            parent_application_alias: req.param('application_alias'),
            parent_application_feature:  req.param('feature_alias')
        }).done(function(err, success){

                if(err)  return res.json(err, 500);

                return res.json(success);
            })
    }

};

var _moduleData = {
    title: 'Project Manager',
    description: 'Manages Projects',
    application_alias: 'projects'

};
