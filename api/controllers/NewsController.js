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
        }).exec(function(err, success){

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
        }).exec(function(err, success){

                if(err) return res.json(err, 500);

                return res.json(success);
            })
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

                    var postsLength = posts.length - 1;

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

                                // console.log(models);
                                return res.json( posts);

                            }

                        });
                    });

                    //return  res.json(success);
                }else{
                    return res.json({}, 404);
                }




            });
    },

    //create a new post for an application
     createPost: function(req, res){

        var newsPost = {};
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
        newsPost.parent_application = req.param('id');

        Newspost.create(newsPost)
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
        }).exec(function(err, success){

                if(err)  return res.json(err, 500);

                return res.json(success);
            })
    }

};

var _moduleData = {
    title: 'News Manager',
    description: 'Manages the home page of the intranet',
    application_alias: 'news'

};
