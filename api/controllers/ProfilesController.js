/**
 * ProfilesController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Q = require('q');
module.exports = {

    search: function(req, res){

        var criterion = req.param('query');
        var parent_application = req.param('parent_application');
        var page = req.param('page');
        var limit = req.param('limit');

        if(!page){
            page = 1;
        }

        if(!limit){
            limit = 30
        }

        var query = {};

        if(criterion) {
            query = {
                title : {
                    'contains' : criterion
                },
                parent_application: parent_application
            };
        }else{
            query = {
                parent_application: parent_application
            };

        }

       // console.log(query);
        Profiles.find(query)
            .paginate({
                page: page,
                limit: limit
            })
            .exec(function(err, results){

                if(err) return res.json(err, 500);



                if(results){

                    Profiles.count(query).exec(function(err, found){
                            var ret = {
                                models: results,
                                total: found,
                                page: page,
                                limit: limit
                            };

                            return res.json(ret);

                        });

                }


            })


    },
/*
    find: function(req, res){


        var parent_application = req.param('parent_application');
        var page = req.param('page');
        var limit = req.param('limit');

        if(!page){
            page = 1;
        }

        if(!limit){
            limit = 30
        }

        console.log('using the find action');


        Profiles.find()
            .paginate({
                page: page,
                limit: limit
            })
            .done(function(err, results){

                if(err) return res.json(err, 500);

                if(results){

                    Profiles.count()
                        .exec(function(err, found){
                            var ret = {
                                models: results,
                                total: found,
                                page: page,
                                limit: limit
                            };

                            return res.json(ret);

                        });

                }


            })

    },*/

    findByAlias: function(req, res){

        Profiles.findOne({
            user_alias: req.param('alias')
        }).exec(function(err, success){

                if(err) return res.json(err, 500);

                if(success){
                    return res.json(success);
                }else{
                    return res.json({
                        name: 'Record not found'
                    }, 404);
                }


            })
    },

    findProfileViaUser: function(req, res){

        Q(Users.findOne(req.param('id')))
            .then(function(user){

                Profiles.findOne(user.profile)
                .exec(function(err, profile){

                    if(err){
                        return res.json(err, 600);
                    }else{
                        return res.json(profile);
                    }
                })


            })
            .fail(function(error){
                return res.json(error, 500);
            })
    }
};
