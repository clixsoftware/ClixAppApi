/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var util = require('util');
var url = require('url');
var _ = require('lodash');
var Q = require('q');

module.exports = {

    //get the feature manager
    getManager: function(req, res){

        var criteria = actionUtil.parseCriteria(req);

        Features.findOne({
            application_alias: criteria.feature_alias
        }).exec(function(err, success){

            if(err) return res.json(err, 500);

            return res.json(success);
        })
    },

    //return all the applications
    index: function ( req, res ) {

        console.log('inside the index function');
        console.log(req.params.feature_alias);

       if(req.params.feature_alias === 'content'){
           return this.find(req, res);
       }

        Applications.find({
            app_alias: _moduleData.application_alias
        }).exec(function(err, success){

            if(err) return res.json(err, 500);

            return res.json(success);
        })
    },

    addTerms: function (req, res) {

        console.log('addTerms to Content');

        var terms = req.param('terms');
        var contentId = req.param('id');

        //console.log(req);
        console.log(req.params);
        console.log(req.query);

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
                    termString.push(    term.id+ ';# ' + term.title + '|' + term.uuid);
                })

                Content.update({
                    id: contentId
                }, {
                    categories: termString
                }).exec(function(err, posts){
                    return res.json(posts[0]);
                });

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

                _.forEach(terms, function(term){
                    termString.push( term.title);
                })

                Content.update({
                    id: contentId
                }, {
                    tags: termString
                }).exec(function(err, posts){
                    return res.json(posts[0]);
                });

            }else{
                res.json({});
            }



        });

    },

    find: function findRecords (req, res) {

        console.log('Inside the Content Find');
        console.log(req.params);
/*        console.log( url.parse(req.url));
        console.log( url.parse(req.url).path.split('/'));*/
        // Look up the model
        // var Model = actionUtil.parseModel(req);

        var criteria = actionUtil.parseCriteria(req);

        console.log(req.options);

        var Model = req._sails.models[req.params.feature_alias];

        console.log(req.params.feature_alias );


        if(req.params.feature_alias === 'content'){
             criteria = _.omit(criteria, 'feature_alias');
        }


        if(_.has(req.params, "parent_application")){
            criteria.parent_application = req.params.parent_application;
        };

        console.log(criteria);


        if ( !Model ) throw new Error(util.format('Invalid route option, "model".\nThis is not a valid content model: `%s`', criteria.feature_alias));

        var paging = {
            limit: actionUtil.parseLimit(req),
            skip:   actionUtil.parseSkip(req)
        };

        //.where( actionUtil.parseCriteria(req) )
        // Lookup for records that match the specified criteria
        var query = Model.find()
            .where(criteria )
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

                    return res.ok(matchingRecords);

            }else{

                if(matchingRecords){

                    if(matchingRecords.length > 0){
                        var post = matchingRecords[0];


                        var viewCount = post.views + 1;

                        Model.update({
                            id: post.id
                        }, {
                            views: viewCount
                        }).exec(function(err, posts){
                            return res.json(posts[0]);
                        });

                    }else{
                        return res.json({});
                    }

                }else{
                    return res.json({
                        message: 'Record not found'
                    }, 404);
                }

            }
        });

    },

    search: function findRecords (req, res) {


        console.log('Inside the Content Search');
        console.log(req.params);
        /*        console.log( url.parse(req.url));
         console.log( url.parse(req.url).path.split('/'));*/
        // Look up the model
        // var Model = actionUtil.parseModel(req);

        var criteria = actionUtil.parseCriteria(req);

        console.log(req.options);

        var Model = req._sails.models[req.params.feature_alias];

        criteria.feature_alias = req.params.feature_alias;

        if(_.has(req.params, "parent_application")){
            criteria.parent_application = req.params.parent_application;
        };

        console.log(criteria);


        if ( !Model ) throw new Error(util.format('Invalid route option, "model".\nThis is not a valid content model: `%s`', criteria.feature_alias));

        var paging = {
            limit: actionUtil.parseLimit(req),
            skip:   actionUtil.parseSkip(req)
        };

        //.where( actionUtil.parseCriteria(req) )
        // Lookup for records that match the specified criteria
        var query = Model.find()
            .where(criteria )
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

            var postsLength = matchingRecords.length - 1;

            matchingRecords.forEach(function(post, i){
                console.log('item - ' + i);

                console.log(post.id);

                Model.find()
                    .where({parent_node: post.id})
                    .exec(function(err, children){
                    // console.log('ofund children');
                    //console.log(children);
                    matchingRecords[i].children = children;
                        if (i >= postsLength) {

                            console.log('sending data;')
                            Model.count(criteria).exec(function (err, found) {

                                var ret = {
                                    models: matchingRecords,
                                    total: found,
                                    page: paging.skip ? paging.skip + 1 : 0,
                                    limit: paging.limit ? paging.limit : 0
                                };

                                return res.json(ret);


                            });

                        }
                });






            });

            //Get the Count of the records


        });

    },
    //create a new post
    create: function(req, res){

        console.log(req.params.all());
        var Model = req._sails.models[req.params.feature_alias];;

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = actionUtil.parseValues(req);

        /*        if(req.user && req.user.id){
         data.creator = req.user.id;
         }*/

        // Create new instance of model using data from params
        Model.create(data).exec(function created (err, newInstance) {
            if (err) return res.negotiate(err);

            res.status(201);
            res.json(newInstance.toJSON());
        });


    },

    update: function(req, res){

        // Look up the model
        var Model = Content;

        // Locate and validate the required `id` parameter.
        var pk = actionUtil.requirePk(req);

        // Create `values` object (monolithic combination of all parameters)
        // But omit the blacklisted params (like JSONP callback param, etc.)
        var values = actionUtil.parseValues(req);

        // Omit the path parameter `id` from values, unless it was explicitly defined
        // elsewhere (body/query):
        var idParamExplicitlyIncluded = ((req.body && req.body.id) || req.query.id);
        if (!idParamExplicitlyIncluded) delete values.id;

        // remove createdAt and updatedAt to let sails.js set it automaticaly
        delete values.createdAt;
        delete values.updatedAt;

        // Find and update the targeted record.
        //
        // (Note: this could be achieved in a single query, but a separate `findOne`
        //  is used first to provide a better experience for front-end developers
        //  integrating with the blueprint API.)
        Model.findOne(pk).populateAll().exec(function found(err, matchingRecord) {

            if (err) return res.serverError(err);
            if (!matchingRecord) return res.notFound();

            // dont change user password in user edit
            values.password = matchingRecord.password;

            Model.update(pk, values).exec(function updated(err, records) {

                // Differentiate between waterline-originated validation errors
                // and serious underlying issues. Respond with badRequest if a
                // validation error is encountered, w/ validation info.
                if (err) return res.negotiate(err);


                // Because this should only update a single record and update
                // returns an array, just use the first item.  If more than one
                // record was returned, something is amiss.
                if (!records || !records.length || records.length > 1) {
                    req._sails.log.warn(
                        util.format('Unexpected output from `%s.update`.', Model.globalId)
                    );
                }

                var updatedRecord = records[0];

                // Do a final query to populate the associations of the record.
                //
                // (Note: again, this extra query could be eliminated, but it is
                //  included by default to provide a better interface for integrating
                //  front-end developers.)
                /*
                 var Q = Model.findOne(updatedRecord[Model.primaryKey]);
                 Q = actionUtil.populateEach(Q, req);
                 Q.exec(function foundAgain(err, populatedRecord) {
                 if (err) return res.serverError(err);
                 if (!populatedRecord) return res.serverError('Could not find record after updating!');
                 console.warn('populated', populatedRecord);
                 res.ok(populatedRec
                 ord);
                 }); // </foundAgain>
                 */

                res.ok(updatedRecord);
            });// </updated>
        }); // </found>

    }

};

var _moduleData = {
    title: 'Content Manager',
    description: 'Manages the home page of the intranet',
    application_alias: 'classifieds'

};
