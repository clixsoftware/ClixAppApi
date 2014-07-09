/**
 * FrontPageController.js
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
    getPosts: function(req, res){

        Events.find({
            parent_application: req.param('id')
        }).done(function(err, posts){

                if(err) return res.json(err, 500);

                if(posts){

                    //get the category that goes with it
                    //                    success.getCategories();

                    var postsLength = posts.length - 1;

                    posts.forEach(function(post, i) {

                        console.log('item - ' + i);

                        Mediamaps.findOne({
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
                                return res.json( posts);

                            }

                        });
                    });


                }else{
                    return res.json({}, 404);
                }




            });
    },

    //create a new post for an application
     createPost: function(req, res){

        var  post_record = {};
         post_record.title = req.param('title');
         post_record.description = req.param('description');
         post_record.location = req.param('location');
         post_record.organizer_name = req.param('organizer_name');
         post_record.organizer_description = req.param('organizer_description');
         post_record.start_date = req.param('start_date');
         post_record.end_date = req.param('end_date');
         post_record.content = req.param('content');

        //auto
         post_record.parent_application = req.param('id');

         console.log(post_record);


        Events.create(post_record)
            .then(function(created_record){
                return res.json(created_record, 201);
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
    title: 'Calendar Manager',
    description: 'Manages the Events',
    application_alias: 'calendar'

};
