/**
 * Newspost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var appItemModel = require('../services/model/appItemModel');  //inherit from the base model
var _ = require('lodash');
var uuid = require('uuid-v4');
var moment = require('moment');
var Q = require('q');

var mv = require('mv');
// image converter
var gm = require('gm').subClass({ imageMagick: true });;
var mime = require('mime');
var sid = require('shortid');

// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);

module.exports = _.merge(_.cloneDeep(appItemModel), {
    schema: true,

    attributes: {

        active: {
            type: 'boolean'
        },

        content_type: {
            type: 'string',
            enum: ['attachment'],
            defaultsTo: 'attachment'
        },

        extension: {
            type: 'string'
        },

        height: {
            type: 'string'
        },

        mime: {
            type: 'string'
        },

        original_filename: {
            type: 'string'
        },

        parent_object: {
            type: 'string'
        },

        size: {
            type: 'integer'
        },

        title: {
            type: 'string',
            required: true
        },

        status: {
            type: 'string'
        },

        width: {
            type: 'string'
        },

        buildLinks: function () {

            this.urls = {
                edit: {
                    href: this.path + '/edit',
                    title: 'Edit Feature',
                    description: 'Click to edit this feature'
                },

                show: {
                    href: this.path + '/index.html',
                    title: 'Feature Manager Home',
                    description: 'Go to directory manager home'
                }
            };


            return;


        },

    toJSON: function () {


            this.buildLinks();
           // console.log(JSON.stringify(this.getMedia()));

            //console.log(JSON.stringify(this.media));

            var obj = this.toObject();

            return obj;

        }



    },

    // Lifecycle Callbacks
    beforeCreate: function (post, next) {

        //console.log('before create');
       // Applications.findOne(post.parent_application)
        //post.parent_application = 34;
        _.omit(post, 'type', 'filename', 'extra', 'field');

        console.log('Post Create Object');

        Applications.findOne({
            app_alias: 'attachments',
            alias: 'default'
        }).then(function (app) {

                console.log('app information');
                console.log(app);

            post.admin_path = app.admin_path + "/posts/{id}";

            post.parent_application = app.id;
            post.parent_application_alias = app.alias;
            post.parent_application_feature = app.app_alias;

            post.uuid = uuid();

            console.log('building attachment information');

            //    post = post_create;
            console.log(post);

                next();

            });

    },

    afterCreate: function (newPost, next) {

        console.log('inside of after create attachments');
         console.log(newPost);

        Attachments.update({
            id: newPost.id
        }, {
            admin_path: newPost.admin_path.replace('{id}', newPost.id)//,
            //path: newPost.path.replace('{id}', newPost.id)
        }, function (err, success) {
            if (err) return next(err);

             next();
        });

    },

    // Upload the files
    upload: function (file, callback) {

        file.extension = file.filename.split('.').pop();

        // TODO add support to files without extension
        if (!file.extension) {
            sails.log.error('File extension not found', file);
            return callback('File extension not found', null);
        }

        //file.title = sid.generate()+ '.' + file.extension;
        file.title = uuid() + '.' + file.extension;

        //var newFilePath = sails.config.appPath + '/' + sails.config.imageUploadPath + '/' + 'original' + '/' + file.title;
        var newFilePath = sails.config.appPath + '/' + sails.config.attachmentUploadPath + '/'  + file.title;
        var url = '/' + sails.config.attachmentUploadPath + '/'  + file.title;

        mv(file.path, newFilePath, {mkdirp: true}, function (err) {
            if (err) return callback(err, null);

            file.mime = mime.lookup(newFilePath);
            file.path = url;

            console.log('new file path:', newFilePath);
            // get image size

            if(file.mime === 'image/png' || file.mime === 'image/jpeg'|| file.mime === 'image/jpg'){
                gm(newFilePath)
                    .size(function (err, size) {

                        if (err){
                            console.log('GM sizing error');
                            console.log(err);
                            return callback(err);
                        }

                        file.width = size.width;
                        file.height = size.height;

                        console.log('gm file size processiong')
                        console.log(file);

                        callback(null, file);
                    });
            }else{
                callback(null, file);
            }


        });
    },

    getStyleUrlFromImage: function (image) {
        return {
            original: '/api/v1/images/original/' + image.name,
            thumbnail: '/api/v1/images/thumbnail/' + image.name,
            mini: '/api/v1/images/mini/' + image.name,
            medium: '/api/v1/images/medium/' + image.name,
            large: '/api/v1/images/large/' + image.name
        };
    },

    uploadMultiple: function (files, options,  callback) {
        var uploadedFiles = [];
        var fileUp;

        async.each(files, function (file, next) {

            file.path = '.tmp/uploads/' + file.filename;

            Attachments.upload(file, function (err) {

                if (err) {
                    console.log('in upload multiple - on the upload');
                    console.log(err);
                    next(err);

                } else {
                    fileUp = file;
                    fileUp.parent_object = options.parent_object;
                    fileUp.title = file.title;
                    fileUp.original_filename = file.filename;
                    fileUp.size = file.size;
                    fileUp.extension = file.extension;
                    fileUp.status = 'enabled';
                    fileUp.active = true;
                    console.log('fileup');
                    console.log(fileUp);

                   // fileUp.creator = creatorId;
                    uploadedFiles.push(fileUp);
                    next();

                }
            });

        }, function (err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, uploadedFiles);
            }
        });
    },


    safeFilename:  function(name) {
        name = name.replace(/ /g, '-');
        name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
        name = name.replace(/\.+/g, '.');
        name = name.replace(/-+/g, '-');
        name = name.replace(/_+/g, '_');
        return name;
    },

    fileMinusExt:  function(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
},

    fileExtension:  function(fileName) {
    return fileName.split('.').slice(-1);
    },

// Where you would do your processing, etc
// Stubbed out for now
    processImage:  function(id, name, path, cb) {
        console.log('Processing image');

        cb(null, {
            'result': 'success',
            'id': id,
            'name': name,
            'path': path
        });

    }
});
