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

    find: function(req, res){

        var eventId = req.param('id');

        //console.log('using tracker');

        Q(Events.findOne(eventId))
            .then(function(success){

                var viewCount = success.views_count + 1;
                console.log('Updating');

                success.view_count = viewCount;

               //return success;
               return Events.update({
                    id: success.id
                },{
                    views_count: viewCount
                }).then(function(posts){

                    //console.log(posts);
                    return posts[0];
                })
                   .fail(function(error){
                       console.log(error);
                   });


            })
            .then(function(updatedEvent){

               // console.log('updated eve =  ' + updatedEvent);
               // console.log('Get Tax mapping');

                updatedEvent.tags = [];
                updatedEvent.categories=[];
                updatedEvent.media = [];

              var tags = Taxmapping.find({object_id: updatedEvent.uuid})
                    .then(function(term_map){


                       // console.log('term map ' + JSON.stringify(term_map));
                        if(term_map.length === 0){
                            return;
                        }

                        var query = _.pluck(term_map, 'term');
                        //console.log(query);

                        //return tags
                        var tags = Taxonomy.find({
                            id: query,
                            enable_tagging: true
                        });

                        return tags;

                  });

                var categories =  Taxmapping.find({object_id: updatedEvent.uuid})
                    .then(function(term_map){


                        //console.log('term map ' + JSON.stringify(term_map));
                        if(term_map.length === 0){
                            return;
                        }

                        var query = _.pluck(term_map, 'term');
                        //console.log(query);

                        var categories = Taxonomy.find({
                            id: query,
                            enable_tagging: false
                        }).then(function(categories){
                            return categories;
                        });


                        return categories;

                    });

                //console.log('getting categories ' + JSON.stringify(categories) );

                return [updatedEvent, tags, categories];

            })
            .spread(function(updatedEvent, tags, categories){

               // console.log('tags - ' + JSON.stringify(tags));
               // console.log('categories - ' + JSON.stringify(categories));
                console.log(updatedEvent.uuid);


                var media = Q(Mediamaps.find({object_id: updatedEvent.uuid}))
                    .then(function(success){

                        if(success){

                            var groupings = _.groupBy(success, function(item){
                                return item.media_type;
                            });
                            console.log(JSON.stringify(groupings));
                            return groupings;
                        }else{
                            return [];
                        }

                    });

                console.log('passed media ' + JSON.stringify(media));
                return [updatedEvent, tags, media, categories];

            })
            .spread(function(updatedEvent, tags, media, categories){

                if(tags){
                    updatedEvent.tags= tags;
                }
                 if(categories){
                     updatedEvent.categories = categories;
                 }
                if(media){
                    updatedEvent.media = media;
                }



                return updatedEvent;
            })
            .then(function(event){

              //  console.log(JSON.stringify(event));

                return res.json(event);
            })
            .fail(function(error){
                console.log(error);
                return res.json(error, 500);
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

        Events.find(search)
            .done(function(err, success){
                if(err) return res.json(err, 500);

                return res.json(success);
            })
    },

    getByFeatureParent: function(req, res){

        var query = {
            parent_application_alias: req.param('app_alias'),
            parent_application_feature: req.param('feature')
        };

        Events.find(query)
            .sort('start_date desc')
            .exec(function(err, results){

                if(err) return res.json(err, 500);

                return res.json(results);
            })
    }
};
