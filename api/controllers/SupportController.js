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
            custom_fields:req.param('custom_fields')

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
   }


};

var _moduleData = {
    title: 'Support Manager',
    description: 'Support Manager',
    application_alias: 'support'

};
