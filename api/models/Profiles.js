/**
 * Profiles.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var appItemModel = require('../services/model/appItemModel'); //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');

module.exports = _.merge(_.cloneDeep(appItemModel), {

    attributes: {

        // social fields
        about_me: {    //about me
            type: 'string'
        },

        //Address
        assistant: {
            model: 'profiles'
        },

        address_city: {
            type: 'string'
        },

        address_country: {
            type: 'string'
        },

        address_line1: {
            type: 'string'
        },

        address_line2: {
            type: 'string'
        },

        address_state: {
            type: 'string'
        },

        address_zip: {
            type: 'string'
        },

        birth_date: {
            type: 'date'
        },

        content_type: {
            type: 'string',
            defaultsTo: 'Profile'
        },

        //Reporting options
/*        daily_report_option: {    //receiveDailyReports = 1, receiveDailyReportsWeekend = 2
            type: 'integer'
        },

        daily_report_sort: {  //values workspace, date
            type: 'string',
            defaultsTo: 'workspace'
        },*/

        department: {
            type: 'string'
        },

        employee_no: {
            type: 'string'
        },

/*
        facebook: {
            type: 'string'
        }*/

        fax: {
            type: 'string'
        },

        // display name and information
        first_name: {
            type: 'string'
        },

        gender: {
          type: 'string'
        },
/*
        googleplus: {
            type: 'string'
        },
*/

        home_phone: {
            type: 'string'
        },

        job_title: {
            type: 'string'
        },

        preferred_job_title:{
          type:'string'
        },

        job_level: {
            type: 'string'
        },

        job_category: {
            type: 'string'
        },

        //instant messaging
/*        im_name: {
            type: 'string'
        },

        im_service: {
            type: 'string'
        },*/

        interests: {
            type: 'string'
        },

        last_colleague_date_added: {
            type: 'datetime'
        },

        last_name: {
            type: 'string'
        },
/*

        linkedin: {
            type: 'string'
        },
*/

        manager: {
            model: 'profiles'
        },

        marital_status: {  //values single, married
            type: 'string',
            defaultsTo: 'single',
            enum: ['single', 'married', 'unknown']
        },

        middle_name: {
            type: 'string'
        },

        mobile_phone: {    //mobile phone
            type: 'string'
        },

        office: {
            type: 'string'
        },


        office_location: {
            type: 'string'
        },

        past_projects: {
            type: 'string'
        },

        preferred_name: {  //display name
            type: 'string'
        },

        personal_space: {  //personal website (my site)
            type: 'string'
        },

        picture_url: {
            type: 'string'
        },
/*

        pinterest: {
            type: 'string'
        },
*/

        prefix: {
            type: 'string',
            enum: ['Dr', 'Mr', 'Ms', 'Mrs']
        },

        responsibility: { //ask me about
            type: 'string'
        },

/*        school: { //schools
            type: 'string'
        },*/

        skills: { //array of skills
            type: 'string'
        },

        status_message: {
            type: 'string'
        },

/*        twitter_name: {
            type: 'string'
        },*/

        website: {
            type: 'string'
        },

        work_email: {
            type: 'string'
        },

        work_ext: {
            type: 'string'
        },

        work_phone: {
            type: 'string'
        },

        work_unit: { //department, section, division (linked to WorkUnit)
            model: 'profiles'
        },

        user_alias: {   //username in the format firstname.lastname
            type: 'string',
            required: true
           // unique: true
        },
        //*** model functions

        apiName: function(){
            return 'profiles'
        },

        apiHelp: function(){
            return 'profiles_api'
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

    createUser: function(id, cb){

        Profiles.findOne(id)
            .exec(function(err, profile){
                if(err) return cb(err);

                if(!profile) return cb(new Error('Profile not found'));

                Users.create({
                    title: profile.title,
                    username: profile.work_email,
                    email: profile.work_email,
                    password: 'password'
                }).exec(function(err, created_user){
                    if(err) return cb(err);

                    return cb(created_user);
                })
            })
    },
    //*** Model Callbacks

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {


        Applications.findOne(post.parent_application)
            .populate('parent_feature')
            .then(function (app) {

                console.log('application found ' + JSON.stringify(app));

               // post.path = app.path +'/{id}/' + post.user_alias.toLowerCase();
                post.path = app.path +'/'+ post.user_alias.toLowerCase();
                post.admin_path = app.admin_path + "/posts/{id}"

                post.parent_application_alias = app.alias;
                post.parent_application_feature = app.parent_feature.application_alias;

                post.uuid = uuid();

                console.log(JSON.stringify(post));
                next();

            });

    },


    afterCreate: function ( profile, next ) {

        console.log('In Profile afterCreate callback function');

        Profiles.update({
            id: profile.id
        }, {
            admin_path: profile.admin_path.replace('{id}', profile.id),
            path: profile.path.replace('{id}', profile.id)
        }, function(err, app){
            if (err) return next(err);

            next();
        });


    }



});

