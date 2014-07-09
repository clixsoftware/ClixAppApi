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

    search: function ( req, res ) {

        var criterion = req.param('criterion');

        Howdois.find({
            title: {
                'contains': criterion
            }
        })
            .exec(function ( err, success ) {
                if (err) return res.json(err, 500);

                return res.json(success);
            })
    },

    addCategory: function ( req, res ) {

        var postId = req.param('id');
        var categoryCode = req.param('category_code');

        Q(Howdois.findOne(postId))
            .then(function ( post ) {

                //find the id of the
                var category = Category.findOne()
                    .where({
                        code: categoryCode
                    })
                    .then(function ( category ) {
                        return category;
                    });

                return [post, category];

            })
            .spread(function ( post, category ) {

                var addCategory = {
                    tax_id: category.id,
                    object_id: post.uuid,
                    content_type: 'How Do I',
                    root_app_id: post.parent_application_alias
                };


                console.log(addCategory);

                Taxmap.findOne({
                    tax_id: addCategory.id,
                    object_id: addCategory.object_id
                }).exec(function ( err, success ) {

                    if (err) return res.json(err, 500);

                    if (success) {
                        console.log('return ing  success');
                        return res.json(success);

                    } else {

                        Taxmap.create(addCategory)
                            .then(function ( row ) {
                                return res.json(row);
                            })
                            .fail(function ( error ) {
                                return res.json(error, 500);
                            });

                    }

                })


            })


    },

    getPostsByCategory: function ( req, res ) {

        // console.log('get posts by category '  + req.param('id'));
        var filter = req.param('q');


        //console.log('filter = ' + filter);
      return  Q(Taxonomy.findOne({code: req.param('id')}))
            .then(function ( term ) {

               // console.log(term);

                return Taxmapping.find({
                    term: term.id,
                    content_type: 'How Do I - Task'
                });

            })
            .then(function ( ids ) {


                console.log(ids.length);

                if (ids.length === 0) {

                    console.log('returning empty ids');
                    return;

                }else{

                var query = _.pluck(ids, 'object_id');


                console.log('ready filter search ' + filter);

                if (filter) {
                    return Howdois.find({
                        uuid: query,
                        title: {
                            'contains': filter
                        }
                    })

                } else {
                    return Howdois.find({
                        uuid: query
                    })

                }
                }

            })
            .then(function ( howdois ) {
                return res.json(howdois);
            })
            .fail(function ( error ) {
                console.log(error);
                return res.json(error, 500);
            });


    },

    getRecent: function(req, res){

        Howdois.find({
            limit: req.param('limit'),
            sort: 'updatedAt'
        })
            .exec(function(err, success){

                if(err){
                    return res.json(err, 500);
                }else{
                    return res.json(success);
                }
            });


    },

    getMostActive: function(req, res){

        Howdois.find({
            limit: req.param('limit'),
            sort: 'views_count DESC'
        })
            .exec(function(err, success){

                if(err){
                    return res.json(err, 500);
                }else{
                    return res.json(success);
                }
            });
    },

    getById: function(req, res){

        Howdois.findOne(req.param('id'))
            .exec(function(err, success){

                if(err){
                    return res.json(err, 500);
                }else{

                    var viewCount = success.views_count + 1;
                    Howdois.update({
                        id: req.param('id')
                    }, {
                        views_count: viewCount
                    }).exec(function(err, updated){

                            return res.json(updated);

                     });
                    //return res.json(success);
                }
            });

    }

    /*,

     find: function(req, res){
     return res.json({t: 'working ok'});
     }*/
};
