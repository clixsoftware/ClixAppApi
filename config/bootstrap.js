/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var mkdirp = require('mkdirp');

module.exports.bootstrap = function (cb) {
    // It's very important to trigger this callack method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    if(!sails.config.apiServerUrl){
        sails.log.info('sails.config.apiServerUrl not found, use the default http://localhost:3100/api/v1/');
        sails.config.apiServerUrl = 'http://localhost:3100/api/v1/';
    }

    if(!sails.config.clientServerUrl){
        sails.log.info('sails.config.clientServerUrl not found, use the default http://localhost:3001/');
        sails.config.clientServerUrl = 'http://localhost:3001/';
    }


    // set default upload configs folder
    if(!sails.config.fileUploadPath){
        sails.log.info('sails.config.fileUploadPath not found usong the default folder uploads/files');
        sails.config.fileUploadPath = 'blob_store/files';
    }

    if(!sails.config.imageUploadPath){
        sails.log.info('sails.config.imageUploadPath not found usong the default folder uploads/images');
        sails.config.imageUploadPath = 'blob_store/images';
    }

    if(!sails.config.attachmentUploadPath){
        sails.log.info('sails.config.fileUploadPath not found usong the default folder uploads/files');
        sails.config.attachmentUploadPath = 'blob_store/attachments';
    }

    if(!sails.config.videoUploadPath){
        sails.log.info('sails.config.imageUploadPath not found usong the default folder uploads/images');
        sails.config.videoUploadPath = 'blob_store/videos';
    }

    // create the image style if not exist
    sails.config.upload.image.availableStyles.forEach(function(style){
        var path = sails.config.appPath + '/'+ sails.config.imageUploadPath + '/' + style ;
        mkdirp(path,function(e){
            if(e){
                sails.log.error('Cant create image directory on sails bootstrap',style,e);
            }
        });
    });


    cb();
};

/*
module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};*/
