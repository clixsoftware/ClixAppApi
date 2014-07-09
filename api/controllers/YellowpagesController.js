/**
 * NewspostController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var Q = require('q');
var _ = require('lodash');
var uuid = require('uuid-v4')

module.exports = {

    getTrending : function ( req, res ) {

        Yellowpages.find( {limit: 5} ).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function(item){
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }else{

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }



        });

    },

    getRelated : function ( req, res ) {

        Yellowpages.find( {limit: 5} ).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function(item){
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }else{

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }



        });

    },

    getRecommended : function ( req, res ) {

        Yellowpages.find( {limit: 5} ).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function(item){
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }else{

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }



        });

    },

    getLatest : function ( req, res ) {

        Yellowpages.find( {limit: 5} ).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function(item){
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }else{

                var errors = [];

                errors.push(SystemMessages.no_record_found_error);

                req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                return res.json(req.results, SystemMessages.noRecordsFoundError.status);
            }



        });

    },

    findHomeFeatured: function ( req, res ) {

        var params = {};
        params.id = req.param('id');

        if (!params.id) {

           // return res.json({error: 'Id is required'});

        }

        Yellowpages.find({show_on_homepage: true, is_featured: true}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function(item){
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }

        });

    },

    findByApp: function ( req, res ) {

        var params = {};
        params.id = req.param('id');

        if (!params.id) {

            return res.json({error: 'Id is required'});

        }

        Yellowpages.find({parent_app: params.id}).done(function ( err, success ) {

            if (err) return res.json(err);

            if (success) {

                _.forEach(success, function(item){
                    item._id = item.id;
                    item.published = item.published_status();
                });


                return res.json(success);
            }

        });

    },

    find1: function(req, res){

        console.log('finding post..');

        var errors = [];

        if (req.method != 'GET') {

            res.setHeader('Allowed', 'GET');
            errors.push(SystemMessages.method_not_allowed_error('GET'));
            req.results = SystemMessages.err_results(SystemMessages.methodNotAllowedError, errors);
            return res.json(req.results, SystemMessages.methodNotAllowedError.status);

        }


        //check if id is passed in params
        if (req.param('id')) {

            console.log('<< Finding Post using the ID >> ' + req.param('id'));

            if(req.param('id')){

                console.log('Find by ID');

                Yellowpages.findOne(req.param('id')).exec(function(err, success){

                    if(err) return res.json(err);

                    if(success) {
                        return res.json(success);
                    }else{

                        errors.push(SystemMessages.no_record_found_error);

                        req.results = SystemMessages.err_results(SystemMessages.noRecordsFoundError, errors);

                        return res.json(req.results, SystemMessages.noRecordsFoundError.status);
                    }


                });

            }

        }else{
            var query = require('url').parse(req.url,true).query;

            console.log('<< Finding Post using queryy >>');
           // console.log('find key ' + _.has(query, 'url'));

            console.log(query);
            var search = HelperService.merge({}, query);

            var q = {};

            if(_.has(query, 'limit')){
                //remove the limit param
                //add to q
                q.limit = search.limit;

            }

            if(_.has(query, 'sort')){
                //remove the limit param
                //add to q
                q.sort = search.sort;
                //query = _.remove(query, 'sort');
            }
            query = _.pull(query, 'limit', 'sort');
            console.log(query);

            //q.where = ;

            if(_.has(query, 'slug')){
                console.log('using slug find one');
                Yellowpages.findOne(search).populate('createdby_user_id')
                    .exec(function(err, user){

                    if(err) return res.json(err);

                    if(user) {
                        user.createdby_user_id = _.pick(user.createdby_user_id, 'title', 'email');
                        return res.json(user);
                    }

                    return res.json({error: 'record not found'});
                });

            }else{
                console.log('Modified search ' + JSON.stringify(query));
                console.log('Modified q ' + JSON.stringify(q));

                Yellowpages.find(search).exec(function(err, user){

                    if(err) return res.json(err);

                    if(user) return res.json(user);
                });

            }


        }


/*            Newspost.findOne(req.param('id')).done(function(err, success){

                if(err) return res.json(err);

                if(success){
                    success.published =  success.published_status();
*//*                     Q.fcall(function(){

                         }
                    ).then(function(value){
                           console.log(value);
                             console.log(success);
                     });*//*

                    return res.json(success);
               }
            });*/






        //check for the uuid parameter
/*        if (req.param('uuid')) {

            console.log('Find by UUID');
            //
            Newspost.findOne({uuid: req.param('uuid')}).done(function(err, success){

                if(err) return res.json(err);

                if(success){

                    success.published =  success.published_status();
                    return res.json(success);
                }
            });

        }*/


        //use the query params instead


  /*    Newspost.findOne(search).done(function(err, success){

            console.log('in newspost findone');

            if(err) return res.json(err);

            if(success){

             *//*var outputPromise = success.published_status()
                    .then(function(input){
                       console.log('the promise ' + outputPromise);
                    });*//*

                Q.fcall(function(){
                    success.published =  success.published_status();}
                ).then(function(value){
                        console.log('q promise' +  success.published);
                        return res.json(success);
                    });



            }else{

                return res.json({error: 'Record not found'}, 404);
            }

        });*/

    },

   create: function(req, res){


       //Only accept 'POST' request, all other request are rejected
       if (req.method != 'POST') {
           return res.json('Only POST request are accepted on this resource');
       }



    },

    findAll: function ( req, res ) {

        console.log('finding feature..');

        var errors = {};

        //Only accept 'POST' request, all other request are rejected
        if (req.method != 'GET') {
            return res.json('Only GET request are accepted on this resource');
        }

        //use the query params instead
        var query = require('url').parse(req.url, true).query;

        console.log('find key ' + _.has(query, 'url'));

        console.log(query);

        var search = HelperService.merge({}, query);

        console.log(search);
        if (_.isEmpty(search)) {

            Newspost.find().done(function ( err, success ) {

                console.log('find all no query');

                if (err) return res.json(err);

                if (success) {
                    return res.json(success);

                } else {

                    return res.json({error: 'Record not found'}, 404);
                }

            });

        } else {

            Newspost.find(search).done(function ( err, success ) {

                console.log('using query ' + search);

                if (err) return res.json(err);

                if (!_.isEmpty(success)) {
                    return res.json(success);
                } else {

                    return res.json({error: 'Record not found'}, 404);
                }

            });

        }

    },

    update: function(req, res){

        console.log('In the Newspost : controller : update');

        var post = {};
        post.title = req.param('title');
        post.description = req.param('description');
        post.category = req.param('category');
        post.content = req.param('content');
        post.content_type = req.param('content_type');
        post.tags = req.param('tags');
        post.status =  HelperService.postStatus.published;

        Yellowpages.update({
            id: req.param('id')
        }, post, function(err, success){

            //if error
            if(err) return res.json(err);

            return  res.json(success);
        });


    },

    findById: function(req, res){

        //console.log('finding yp entry be id');

        var id = req.param('id');

        return Yellowpages.findOne()
            .where({
                id: id
            })
            .then(function(model){

              //  console.log(JSON.stringify(model));
                if(model){
                var views_count = model.views_count;

                views_count = views_count + 1;

                model.views_count = views_count;
                model.save(function(err){
                    console.log(err);
                });

                return res.json(model);
                }else{
                    return res.json({
                        message: 'Record not found'
                    }, 404);
                }

         }).fail(function(error){
                console.log(error);
                return res.json(error , 500);
            })
    }

};
