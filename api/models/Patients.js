/**
 * Profiles.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var appItemModel = require('../services/model/appItemModel'); //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
//var sugar = require('sugar');
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(appItemModel), {

    connection: 'hmisDevelopment',

    attributes: {
        // display name and information
        first_name: {
            type: 'string'
        },

        middle_name: {
            type: 'string'
        },

        last_name: {
            type: 'string'
        },

        gender: {
            type: 'string',
            enum: ['female', 'male', 'unknown']
        },

        age: {
            type: 'integer'
        },

        birth_date: {
            type: 'date'
        },

        prefix: {
            type: 'string',
            enum: ['Dr', 'Mr', 'Ms', 'Mrs']
        },

        blood_group: {
            type: 'string',
            enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
        },

        condition_primary: {
            type: 'string'
        },

        content_type: {
            type: 'string',
            defaultsTo: 'patient'
        },

        insurance_path_id: {
            type: 'string'
        },

        height: {
          type: 'string'
        },

        weight: {
            type: 'string'
        },

        admit_date: {
            type: 'date'
        },

        room: {
            type: 'integer'
        },

        bed: {
           type: 'integer'
        },

        ward: {
            model: 'wards'
        },

        ward_on_date: {
            type: 'date'
        },

        patient_category: {
            type: 'string',
            enum: ['I', 'II', 'III', 'III']
        },

        patient_level:{
          type: 'string',
            enum: ['normal', 'vip', 'employee', 'relative'],
            defaultsTo: 'normal'
        },

        //this is used in the legacy system
        patient_no: {
            type: 'string'
        },

        //detailed information in the profile/contact database, application 'patients'
        profile: {
            type: 'integer'
        },

        marital_status: {  //values single, married
            type: 'string',
            defaultsTo: 'single',
            enum: ['single', 'married', 'unknown']
        },

        status: {
          type: 'string'
        },

        //*** model functions

        apiName: function(){
            return 'patients'
        },

        apiHelp: function(){
            return 'patients_api'
        },

        buildApiLinks: function(){

            var self = {
                method: 'GET',
                href: this.hostName() + this.apiName() + '/' + this.id,
                rel: this.hostName() + this.apiHelp() + '/self'
            };

            this.links = {
                self: self,

                parent: {
                    method: 'GET',
                    href: this.hostName() + this.apiName(),
                    rel: this.hostName() + this.apiHelp() + '/applications'
                }
            };

            return;

        },

        buildLinks: function(){

            this.urls = {
                edit: {
                    href: this.path + '/edit',
                    title: this.title,
                    description: 'Click to edit'
                },

                show: {
                    href: this.path + '/index.html',
                    title: this.title,
                    description: 'Go to profile'
                }
            };


            return;



        },

        toJSON: function () {


            this.buildLinks();
            this.buildApiLinks();

            var obj = this.toObject();
            //obj.profile = _.pick(obj.profile, 'title');
            // obj.creator = this.getCreator(1);

            //delete obj.password_salt;
            // delete obj.hashed_password;

            return obj;
            //delete obj._csrf;
        }

    },

    //*** Model Callbacks

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {


        Applications.findOne(post.parent_application)
            .populate('parent_feature')
            .then(function (app) {

               // console.log('paient ' + JSON.stringify(post));

                var mDate = moment().format('MMDD');

               // post.path = app.path +'/{id}/' + post.user_alias.toLowerCase();

                console.log(mDate);
                post.patient_no = mDate +'-' + '{id}';
                post.path = app.path + '/' + post.patient_no;

                post.admin_path = app.admin_path + "/patient/{id}";

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_feature.application_alias;

                post.uuid = uuid();

                console.log(JSON.stringify(post));
                next();

            });

    },


    afterCreate: function ( profile, next ) {

        console.log('In Profile afterCreate callback function');

        var id = ''; //profile.id.toString().padLeft(8, '0');
        Patients.update({
            id: profile.id
        }, {
            admin_path: profile.admin_path.replace('{id}', profile.id),
            path: profile.path.replace('{id}', id),
            patient_no: profile.patient_no.replace('{id}', id)
        }, function(err, app){
            if (err) return next(err);

            next();
        });


    }



});

