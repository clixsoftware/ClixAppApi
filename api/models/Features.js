/**
 * Feature.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var baseModel = require('../services/model/baseModel'); //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');


module.exports = _.merge(_.cloneDeep(baseModel), {

    attributes: {

        application_alias: {    //the alias that denotes an application for this feature e.g. 'calendar'
            type: 'string',
            required: true,
            unique: true
        },

        icon: { //icon for the application
            type: 'string'
        },

        is_root: {
            type: 'boolean',
            defaultsTo: false
        },

        status_message: {
            type: 'string',
            defaultsTo: 'Feature is installed'
        },

        uuid: { //guid of the record
            type: 'string',
            unique: true
        },

        version_no: {
            type: 'string',
            defaultsTo: '1.0'
        },

        apps: {
            collection: 'applications',
            via: 'parent_feature'
        },

        //*** model functions

        apiName: function () {
            return 'features'
        },

        apiHelp: function () {
            return 'features_api'
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
                    href: this.hostName() + this.apiName(),
                    rel: this.hostName() + this.apiHelp() + '/parent'
                },
                list_applications: {
                    method: 'GET',
                    href: this.hostName() + this.application_alias + '/applications',
                    rel: this.hostName() + this.application_alias + '/applications/list'
                },
                create_application: {
                    method: 'POST',
                    href: this.hostName() + this.application_alias + '/applications',
                    rel: this.hostName() + this.application_alias + '_api/applications/create'
                },
                find_by_alias: {
                    method: 'GET',
                    href: this.hostName() + this.apiName() + '/find?application_alias=' + this.application_alias,
                    rel: this.hostName() + this.apiHelp() + '/find_by_alias'

                },
                find_by_uuid: {
                    method: 'GET',
                    href: this.hostName() + this.apiName() + '/find?uuid=' + this.uuid,
                    rel: this.hostName() + this.apiHelp() + '/find_by_uuid'

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

            var url = '/backend/features/' + this.id;

            this.urls = {
                edit: {
                    href: url + '/edit',
                    title: 'Edit Feature',
                    description: 'Click to edit this feature'
                },

                show: {
                    href: url,
                    title: 'Feature Manager Home',
                    description: 'Go to directory manager home'
                }
            };


            return;


        },

        //*** overridden functions

        toJSON: function () {


            this.buildLinks();
            this.buildApiLinks();

            var obj = this.toObject();

           // delete obj.edit_url;
            //delete obj.manager_url;

            return obj;
            //delete obj._csrf;
        }

    },

    // Lifecycle Callbacks
    beforeCreate: function (feature, next) {

        // Create new user password before create
        feature.uuid = uuid();
        next();
    },

    afterCreate: function (newRecord, next) {

        Features.update({
            id: newRecord.id
        }, {
            admin_path: '/backend/features/' + newRecord.id
        }, function (err, app) {

            if (err) next(err);

            next();
        });


    }

});
