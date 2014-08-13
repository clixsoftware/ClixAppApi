/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var sid = require('shortid');
var fs = require('fs');
var mkdirp = require('mkdirp');
//var io = require('socket.io');

module.exports = {

    upload: function (req, res) {

        var options = {};

        options.parent_object = req.body['parent_object'];

        //console.log(req);

        console.log('options');
        console.log(options);


        req.file('attachments').upload(function (err, files) {

            console.log('initial upload');
            console.log(files);
            if (err) return res.serverError(err);

            Attachments.uploadMultiple(files,  options, function(err, uploadedFiles){

                if(err){

                    console.log('Error on upload Multiple');

                    console.log(uploadedFiles);

                    res.send( {
                        "files":[],
                        "error": err
                    });

                } else {

                    Attachments.create(uploadedFiles).exec(function(error, savedFiles) {

                       // console.log('on create error');
                       // console.log(error);
                        if (err) return res.serverError(err);

                        sails.log.warn('savedFiles', savedFiles);

                        res.json({
                            attachments: savedFiles
                        });

                    });

                }
            });
        });
/*
        req.file('user_photo').upload(function(err, files){
            if(err) return res.serverError(err);

            return res.json({
                message: files.length + 'files(s) uploaded successfully',
                files: files
            });

        })
*/

/*
        var file = req.files.user_photo,
            id = sid.generate(),
            fileName = id + "." + fileExtension(safeFilename(file.name)),
            dirPath = UPLOAD_PATH + '/' + id,
            filePath = dirPath + '/' + fileName;

        try {
            mkdirp.sync(dirPath, 0755);
        } catch (e) {
            console.log(e);
        }

        fs.readFile(file.path, function (err, data) {
            if (err) {
                res.json({'error': 'could not read file'});
            } else {
                fs.writeFile(filePath, data, function (err) {
                    if (err) {
                        res.json({'error': 'could not write file to storage'});
                    } else {
                        processImage(id, fileName, filePath, function (err, data) {
                            if (err) {
                                res.json(err);
                            } else {
                                res.json(data);
                            }
                        });
                    }
                })
            }
        });*/
    }



};