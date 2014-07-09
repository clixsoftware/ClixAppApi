/**
 * App.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


var dataModel = require('../services/model/dataModel'); //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var Q = require('q');

module.exports = _.merge(_.cloneDeep(dataModel), {

    attributes: {

        alias: {    //e.g. 'corporate' as in http://intranet/sites/corporate/news
            type: 'string',
            required: true
        },

        app_alias: {
            type: 'string'
        },


        features_enabled: {
            type: 'integer',
            defaultsTo: 0
        },

        icon: {
            type: 'string'
        },

        is_default: {
            type: 'boolean',
            defaultsTo: false
        },

        is_root: {
            type: 'boolean',
            defaultsTo: false
        },


        last_activity_date: {
            type: 'datetime'
        },

        parent_application: {
            type: 'integer' //  the application this appears as a sub-app in
        },

        parent_application_feature: {
            type: 'integer',    //the feature for the parent application
            model: 'features'
        },

        parent_feature: {
            model: 'features'//,
            //required: true
        },

        path: {
            type: 'string',  //  '/sites/corporate/news
            unique: true
        },

        view_template: {
            type: 'string',
            defaultsTo: 'default'
        },

        edit_template: {
            type: 'string',
            defaultsTo: 'default'
        },

        list_template: {
            type: 'string',  //  '/sites/corporate/news
            defaultsTo: 'default'
        },

        level: {
            type: 'string'
        },

        privacy_enabled: {
            type: 'boolean',
            defaultsTo: false
        },

        quota: {
            type: 'integer',
            defaultsTo: 0
        },

        quota_active: {
            type: 'boolean',
            defaultsTo: false
        },

        status: {
            type: 'string',
            defaultsTo: 'active',
            enum: ['deleted', 'inactive', 'active']
        },



        loadFeatures: function () {

            this.features = {};

            this.features.calendar = false;
            this.features.news = false;
            this.features.blog = false;
            this.features.pages = false;
            this.features.content = false;
            this.features.tasks = false;
            this.has_profiles = false;
            this.has_image = false;
            this.has_documents = false;
            this.has_messages = false;
            this.has_notes = false;
            this.has_comments = false;
            this.has_links = false;
            this.has_milestones = false;
            this.has_people = false;
            this.has_risks = false;
            this.has_announcements = false;


            if (this.features_enabled & HelperService.features.calendar) {
                this.features.calendar = true;
            }

            if (this.features_enabled & HelperService.features.news) {
                this.features.news = true;
            }

        },

        //*** model functions

        apiName: function () {
            return 'applications'
        },

        apiHelp: function () {
            return 'applications_api'
        },

        buildApiLinks: function () {

            var self = {
                method: 'GET',
                href: this.hostName() + this.apiName() + '/' + this.id,
                rel: this.hostName() + this.apiHelp() + '/self'
            };

            this.links = {
                self: self,
                parent: {
                    method: 'GET',
                    href: this.hostName() + 'features/',
                    rel: this.hostName() + this.apiHelp() + '/features'
                },
                find_by_uuid: {
                    method: 'GET',
                    href: this.hostName() + this.apiName() + '/find?uuid=' + this.uuid,
                    rel: this.hostName() + this.apiHelp() + '/findbyuuid'

                },
                find_by_alias: {
                    method: 'GET',
                    href: this.hostName() + this.apiName() + '/find?alias=' + this.alias,
                    rel: this.hostName() + this.apiHelp() + '/findbyalias'

                }


            };

            if (this.status === 'active') {
                this.links.disable = {
                    method: 'POST',
                    href: this.hostName() + this.apiName() + '/disable/' + this.id,
                    rel: this.hostName() + this.apiHelp() + '/disable'
                }
            } else {

                this.links.enable = {
                    method: 'POST',
                    href: this.hostName() + this.apiName() + '/enable/' + this.id,
                    rel: this.hostName() + this.apiHelp() + '/enable'
                }


            }


            return;

        },

        buildLinks: function () {

            var url = '/admin/features/feature/' + this.id;

            this.urls = {
                edit: {
                    href: this.admin_path + '/edit',
                    title: 'Edit Feature',
                    description: 'Click to edit this feature'
                },

                admin: {
                    href: this.admin_path,
                    title: 'SiteManager Home',
                    description: 'Go to site manager home'
                },

                navigate: {
                    href: this.path,
                    title: this.title,
                    description: this.description
                },

                friendly: {
                    href: this.path + '/index.html',
                    title: this.title,
                    description: this.description
                }
            };


            return;


        },

        //*** overridden functions

        toJSON: function () {


            this.buildLinks();
            this.buildApiLinks();
            this.loadFeatures();

            var obj = this.toObject();

            //delete obj.edit_url;

            return obj;
            //delete obj._csrf;
        }


    },



    // Lifecycle Callbacks
    beforeCreate: function ( app, next ) {

        Features.findOne()
            .where({application_alias: app.app_alias})
            .then(function(feature){

                //check if the site already exists
                console.log('Checking if the site exists ' + app.alias);

               var checkApp = Applications.findOne()
                    .where({
                        app_alias: app.app_alias,
                        alias: app.alias
                    });

                if(!app.is_root){
                    console.log('Not a root application');

                    return [feature, checkApp, Applications.findOne(app.parent_application)];

                }else{

                    return [feature, checkApp, null];
                }



            })
            .spread(function(feature, existing_app, parent_app){


                if(!existing_app){

                    if(app.is_root){
                        //Root applications like sites
                        app.path = '/' + feature.application_alias  + '/' + app.alias;

                    }else{

                        if(parent_app){
                            app.parent_application_feature = parent_app.parent_feature;
                            app.path = parent_app.path + '/' + app.app_alias;
                        }else{
                            throw new Error('Parent application not found ');
                        }

                    }

                    app.title = feature.title + '[ ' + app.alias +' ]';
                    app.description = feature.description;
                    app.parent_feature = feature.id;
                    app.admin_path = '/backend/' + feature.application_alias + '/applications/{id}';
                    app.uuid = uuid();

                    return app;

                }else{
                    throw new Error('Application already exists');
                }
            })
            .then(function(app){
                console.log('ready to go next');
                return  next();

            })
            .fail(function(error){
                //console.log(error);
                next(new Error({
                    error: error
                }));// return next(new Error());
            });

    },

    afterCreate: function ( newapp, next ) {

       // console.log('>< Application Created Successfully - Completing Setup ><' );

        Applications.update({
            id: newapp.id
        }, {
            admin_path: newapp.admin_path.replace('{id}', newapp.id)
        }, function(err, model){

            //Error handline
            if(err){
/*                console.log('error in after create');
                console.log(err);*/
                return next(err);
            }else{
                return next();
            }
        });


    }

});



