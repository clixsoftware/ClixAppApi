/**
 * TaxController.js
 *
 * @description :: Manages the categories, taxonomy for the website
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Q = require('q');

module.exports = {

    //Get all 'Taxonomy' Applications
    apps: function ( req, res ) {

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

        console.log('getting posts for the categories');

        Category.find({
            parent_application: req.param('id')
        }).exec(function(err, success){

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
        }).exec(function(err, success){

                if(err)  return res.json(err, 500);

                return res.json(success);
            })
    },

    addTermToObject: function (req, res) {

        var map = {
            term: req.param('id'),
            object_id: req.param('object_id'),
            content_type:  req.param('content_type'),
            root_app_id:  req.param('root_app_id')
        };


        Q(Taxmapping.findOne(map))
            .then(function (post) {


                if(!post){

                    Taxmapping.create(map)
                        .then(function(row){
                            return res.json(row);
                        })
                        .fail(function(error){
                            return res.json(error, 500);
                        });

                }else{
                    return res.json(post);
                }


            })
            .fail(function(error){
                return res.json(error, 500);
            });


    },

    getObjectTerms: function(req, res){

        var tags = req.param('tags');

        Q(Taxmapping.find({object_id: req.param('id')}))
            .then(function(term_map){


                //console.log('term map ' + term_map);
                if(term_map.length === 0){
                    return;
                }

                var query = _.pluck(term_map, 'term');
                console.log(query);

                if(tags){
                    return Taxonomy.find({
                        id: query,
                        enable_tagging: true
                    })

                }else{
                    return Taxonomy.find({
                        id: query,
                        enable_tagging: false
                    })

                }


            })
            .then(function(terms){
              return res.json(terms);
            })
            .fail(function(error){
                return res.json(error, 500);
            });

    },

    getAppTerms: function(req, res){

        var tags = req.param('tags');

        Q(Taxmapping.find({root_app_id: req.param('id')}))
            .then(function(term_map){


                //console.log('term map ' + term_map);
                if(term_map.length === 0){
                    return res.json({});
                }

                //var query = _.uniq(_.pluck(term_map, 'term'));


                var query = _.uniq(_.pluck(term_map, 'term'),function(i){

                    return i;   //'a','b'
                });

                console.log(query);

                if(tags){
                    return Taxonomy.find({
                        id: query,
                        enable_tagging: true
                    })

                }else{
                    return Taxonomy.find({
                        id: query,
                        enable_tagging: false
                    })

                }


            })
            .then(function(terms){
                return res.json(terms);
            })
            .fail(function(error){
                return res.json(error, 500);
            });

    },

    getTerm: function(req, res){

        Q(Taxonomy.findOne({code: req.param('id')}))
            .then(function(term){
                return res.json(term);
            })
            .fail(function(err){
                return res.json(err, 500);
            })
    },

    getChildrenTerms: function(req, res){

        Q(Taxonomy.find({parent: req.param('id')}))
            .then(function(terms){

                if(!terms){
                    return res.json({});
                }else{
                    return res.json(terms);
                }

                //return Taxonomy.find({parent: term.id});

/*
                var query = _.pluck(term_map, 'term');
                console.log(query);

                if(tags){
                    return Taxonomy.find({
                        id: query,
                        enable_tagging: true
                    })

                }else{
                    return Taxonomy.find({
                        id: query,
                        enable_tagging: false
                    })

                }
*/


            })
            .fail(function(error){

                return res.json(error, 500);

            });
    }

};

var _moduleData = {
    title: 'Taxonomy Manager',
    description: 'Manages the keywords and categorization of the intranet',
    application_alias: 'taxonomy'

};
