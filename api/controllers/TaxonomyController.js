/**
 * TaxController.js
 *
 * @description :: Manages the categories, taxonomy for the website
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var util = require('util');
var Q = require('q');
var _ = require('lodash');

module.exports = {

    create: function(req, res){

        //console.log('inside of classifieds create post');

        var Model = Taxonomy;

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = actionUtil.parseValues(req);

        console.log('Classified - submitted data');
        console.log(data);

        /*        if(req.user && req.user.id){
         data.creator = req.user.id;
         }*/

        // Create new instance of model using data from params
        Model.create(data).exec(function created (err, newInstance) {
            if (err) {
                console.log('Classified create error');
                console.warn(err);

                return res.negotiate(err);
            }

            console.log('New Classified row');
            console.log(newInstance);

            res.status(201);
            res.json(newInstance.toJSON());
        });

    },

    find: function findRecords (req, res) {

        // Look up the model
        var Model = Taxonomy;

        console.log(req.params);

        var paging = {
            limit: actionUtil.parseLimit(req),
            skip:   actionUtil.parseSkip(req)
        };

        console.log(actionUtil.parseCriteria(req));
        var criteria = actionUtil.parseCriteria(req);

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
            if(req.param('id') || _.has(criteria, 'uuid')){

                if(matchingRecords){
                    var post = matchingRecords[0];
                    return res.ok(post);
                }else{
                    return res.json({
                        message: 'Record not found'
                    }, 404);
                }


            }else{

                // return res.json(ret);
                return res.json(matchingRecords);

            }
        });

    },

    search: function findRecords (req, res) {


        // Look up the model
        var Model = Classifieds;

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

        });

    },

    update: function(req, res){

        // Look up the model
        var Model = Classifieds;

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
    title: 'Taxonomy Manager',
    description: 'Manages the keywords and categorization of the intranet',
    application_alias: 'taxonomy'

};
