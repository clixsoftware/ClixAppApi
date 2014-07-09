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

    create: function(req, res){

        var feedback = {
            title:  'Feedback at ' + moment().format('YYYY/MM/DD'),
            description: 'Feedback at ' + moment().format('YYYY/MM/DD'),
            content: req.param('description'),
            email: req.param('email'),
            ip: req.ip,
            status: 0

        };


        Q(Applications.findOne({
            app_alias: 'feedback',
            alias: 'default'
        })).then(function(app){

                feedback.parent_application = app.id;
                feedback.parent_application_alias = app.alias;
                feedback.parent_application_feature = _moduleData.application_alias;

                return feedback;
            })
            .then(function(new_feedback){

                Feedback.create(new_feedback)
                    .then(function(model){

                        console.log('model returned ');
                        //return res.json(model);
                        console.log(req.path);
                        console.log(req.url);

                        return res.json(model);
                    })
                    .fail(function(error){
                        console.log('error ');
                        return res.json(error, 500);
                    });

            });


    }


};

var _moduleData = {
    title: 'Feedback Manager',
    description: 'Feedback Manager',
    application_alias: 'feedback'

};
