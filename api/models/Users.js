/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var crypto = require('crypto');
var appItemModel = require('../services/model/appItemModel'); //inherit from the base model
var uuid = require('uuid-v4');
var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(appItemModel), {

    schema: true,

    attributes: {

    content_type:{
        type: 'string',
        defaultsTo: 'account'
    },

     email: {
            type: 'email',
            required: true,
            index: true,
            unique: true,
            email: true
        },

        hashed_password: {
            type: 'string'
        },

        is_admin: {  //Application administrator
            type: 'boolean',
            defaultsTo: false
        },

        is_server_admin: {    //Server administrator
            type: 'boolean',
            defaultsTo: false
        },

        language: {
            type: 'string',
            defaultsTo: 'en'
        },

        last_login_date: {  //updated when the user logs out
            type: 'datetime'
        },

        password_salt: {
            type: 'string'
        },

        profile: {
          model: 'profiles'
        },
        // Status values
        // Unverified = 1,
        // Verified = 2,
        // Verfication Pending = 4,
        // Active = 8
        // Disabled = 16
        // Validation Sent = 32
        // Online = 64
        status: {
            type: 'integer',
            defaultsTo: 1
        },

        username: {
            type: 'string',
            unique: true,
            required: true
        },

        verification_code: {
            type: 'string'
        },

        verification_sent: {
            type: 'datetime'
        },

        //*** model functions
        apiName: function(){
            return 'users'
        },

        apiHelp: function(){
            return 'users_api'
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
                    rel: this.hostName() + this.apiHelp() + '/features'
                }
            };

            return;

        },

        buildLinks: function(){


            this.urls = {
                edit: {
                    href: this.edit_url,
                    title: 'Edit Feature',
                    description: 'Click to edit this feature'
                },

                manager: {
                    href: this.manager_url,
                    title: 'SiteManager Home',
                    description: 'Go to site manager home'
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

    beforeCreate: function ( values, next ) {
        values.password_salt = Math.round((new Date().valueOf() * Math.random())) + '';

        values.hashed_password = crypto.createHmac('sha1', values.password_salt).update(values.password).digest('hex');

        //set username to email
        //TODO : remove @mail.com, and just use the firstname.lastname format
       // values.username = values.email.split('@')[0];
        values.uuid = uuid();


        values.verification_code = Math.round((new Date().valueOf() * Math.random())) + '';
        console.log('successfuly create salt etc. ');
        next();

    },

    afterCreate: function ( user, cb ) {
        console.log('In Users afterCreate callback function');

        Users.update({
            id: user.id
        }, {
            admin_path: user.admin_path.replace('{id}', user.id),
            path:  user.path.replace('{id}', user.id)
        }, function(err, app){
            //if error
            if(err) return cb(err);

            return cb();
        });


    }
    /*,

    beforeUpdate: function ( valuesToUpdate, cb ) {
        cb();
    }
*/
});

