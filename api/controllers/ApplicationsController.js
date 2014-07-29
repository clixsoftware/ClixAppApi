/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var util = require('util');

module.exports = {

    find: function (req, res) {

        // Look up the model
        var Model = Applications;

        // var modelName = req.options.model || req.options.controller;

        var paging = {
            limit: actionUtil.parseLimit(req),
            skip:   actionUtil.parseSkip(req)
        };

        // Lookup for records that match the specified criteria
        var query = Model.find()
            .where( actionUtil.parseCriteria(req) )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );

        // TODO: .populateEach(req.options);
        //query = actionUtil.populateEach(query, req.options);

        query.exec(function found(err, matchingRecords) {
            if (err) return res.serverError(err);

            // Only `.watch()` for new instances of the model if
            // `autoWatch` is enabled.
            if (req._sails.hooks.pubsub && req.isSocket) {

                Model.subscribe(req, matchingRecords);
                if (req.options.autoWatch) {
                    Model.watch(req);
                }

                // Also subscribe to instances of all associated models
                _.each(matchingRecords, function (record) {
                    actionUtil.subscribeDeep(req, record);
                });

            }

            //Check if only requesting one record
            if(!req.param('id')){
                //Get the Count of the records
                Model.count(actionUtil.parseCriteria(req)).exec(function (err, found) {
                    var ret = {
                        models: matchingRecords,
                        total: found,
                        page: paging.skip ? paging.skip + 1 : 0,
                        limit: paging.limit ? paging.limit : 0
                    };
                    return res.json(ret);

                });
            }else{

                if(matchingRecords){
                       return res.json(matchingRecords[0]);
                }else{
                    return res.json({
                        message: 'Record not found'
                    }, 404);
                }

            }
        });

    },

      /*  var query = require('url').parse(req.url, true).query;
        console.log(query);

        if (req.param('id')) {

            Applications.findOne(req.param('id'))
                .populate('parent_application_feature')
                .exec(function (err, success) {

                    if (err) return res.json(err, 500);

                    if (success) {
                        return res.json(success);
                    }
                })

        } else {
            Applications.find(query)
                .exec(function (err, success) {

                    if (err) return res.json(err, 500);

                    return res.json(success);
                });
        }
        // return res.json({hi: ''});*/

    getApplication: function(req, res){

        console.log('get application');
        var query = require('url').parse(req.url,true).query;


        console.log(query);


        Applications.findOne({
            parent_feature: req.param('feature_id'),
            alias:  req.param('alias')

        }).exec(function(err, success){

                if (err ) return res.json(err, 500);

                if(success){
                    return res.json(success);
                }else{
                    return res.json({
                        name: 'No record found'
                    }, 404);
                }


            });
    },


    addTerms: function (req, res) {

        var terms = req.param('terms');
        var contentId = req.param('id');

        var col = terms.split(',');

        Taxonomy.find({
            id: col
        }).exec(function (err, terms){

            if(err) {res.json(err)};


            if(terms){
                var counter = 0;
                var termString = [];
               // var termString = "";

                _.forEach(terms, function(term){

/*                    if(counter >= 1){
                        termString =   termString + ',' + '"'+ term.id+ ';#' + term.title + '|' + term.uuid + '"'
                    }else{
                        termString = termString + '"'+ term.id+ ';#' + term.title + '|' + term.uuid + '"'
                    }*/

                 //  termString.push(  "'"+ term.id+ ';#' + term.title + '|' + term.uuid + "'");

                    termString.push(    term.id+ ';# ' + term.title + '|' + term.uuid);
                })

                Applications.update({
                    id: contentId
                }, {
                    categories: termString
                }).exec(function(err, posts){
                    return res.json(posts[0]);
                });
                //console.log(query);
                // return res.json(termString);
            }else{
                res.json({});
            }



        });

    },

    addTags: function (req, res) {

        var terms = req.param('tags');
        var contentId = req.param('id');

        var col = terms.split(',');

        Taxonomy.find({
            title: col
        }).exec(function (err, terms){

            if(err) {res.json(err)};

            console.log(terms);

            if(terms){
                var counter = 0;
                var termString = [];
                //var termString = "";

                _.forEach(terms, function(term){
                    termString.push( term.title);

/*                    if(counter >= 1){
                        termString =   termString + ',' + '"'+ term.title + '"'
                    }else{
                        termString = termString + '"'+ term.title + '"'
                    }
                    counter++;*/

                })

                Applications.update({
                    id: contentId
                }, {
                    tags: termString
                }).exec(function(err, posts){
                    return res.json(posts[0]);
                });

                //console.log(query);
                // return res.json(termString);
            }else{
                res.json({});
            }



        });

    }

};
