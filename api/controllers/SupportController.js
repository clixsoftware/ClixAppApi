/**
 * NewspostController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var Q = require('q');
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var util = require('util');

module.exports = {

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

    //*** SERVICES ***/

    //Get all services for an Application
    getServices: function(req, res){

        Services.find({
            parent_application: req.param('id')
        }).exec(function(err, posts){

            if(err) return res.json(err, 500);

            if(posts){
                return res.json(posts);
            }else{
                return res.json({}, 404);
            }


        });
    },

    getService: function(req, res){


        Services.findOne({
            id: req.param('id')
        }).exec(function(err, post){

            if(err){
                return res.json(err, 500);
            }

            if(post){
                return res.json(post);
            }
        })
    },

    //create a new post for an application
    createService: function(req, res){

        var  post_record = {};
        post_record.title = req.param('title');
        post_record.description = req.param('description');
        post_record.content = req.param('content');
        post_record.service_code = req.param('service_code');
        post_record.service_type = req.param('service_type');
        post_record.form_trigger_load = req.param('form_trigger_load');
        post_record.form_trigger_submit = req.param('form_trigger_submit');

        //auto
        post_record.parent_application = req.param('id');

        console.log(post_record);


        Services.create(post_record)
            .then(function(created_record){
                return res.json(created_record, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });


    },


    //Tickets

    getTickets: function(req, res){

        Tickets.find({
            parent_application: req.param('id')
        }).done(function(err, posts){

            if(err) return res.json(err, 500);

            if(posts){
                return res.json(posts);
            }else{
                return res.json({}, 404);
            }


        });
    },

    createTicket: function(req, res){

        var ticket = {
            title:  req.param('title'),
            parent_application:  req.param('parent_application'),
            parent_application_alias:  req.param('parent_application_alias'),
            parent_application_feature:  req.param('parent_application_feature'),
            service:  req.param('service'),
            due_date: req.param('due_date'),
            support_queue: req.param('support_queue'),
            content: req.param('content'),
            content_type: req.param('content_type'),
            ip: req.ip,
            status: 0,
            custom_fields:req.param('custom_fields'),
            requestor_name:  req.param('requestor_name'),
            requestor_email:  req.param('requestor_email'),
        };
        /*JSON.parse(req.param('custom_fields'))*/
        console.log('inside support request');
        console.log(ticket);
/*
        if(req.param('title')){
            support.title = req.param('title');
        }
*/

        //console.log(JSON.parse(req.param('other')));


/*        Q(Applications.findOne({
            app_alias: 'support',
            alias: 'global'
        })).then(function(app){

                support.parent_application = app.id;
                support.parent_application_alias = app.alias;
                support.parent_application_feature = _moduleData.application_alias;

                 return support;

            })
            .then(function(support_post){*/

                Tickets.create(ticket)
                    .then(function(model){

                        console.log('model returned ');
                        //return res.json(model);
                        console.log(req.path);
                        console.log(req.url);

                        return res.json(model);
                    })
                    .fail(function(error){
                        console.log(error);
                        return res.json(error, 500);
                    });

/*            });*/
   },

    updateTicket: function(req, res) {
        // Look up the model
        var Model = Tickets;

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
           // values.password = matchingRecord.password;

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
    title: 'Support Manager',
    description: 'Support Manager',
    application_alias: 'support'

};
