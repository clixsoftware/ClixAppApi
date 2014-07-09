/**
 * DirectoryController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    //Install the feature
    installFeature: function ( req, res ) {
        var errors = [];

        Features.create(_moduleData)
            .then(function ( feature ) {
                return res.json(feature, 201);
            })
            .fail(function ( error ) {
                return res.json(error, 500);
            });

    },

    //get the feature information
    getFeature: function ( req, res ) {

        Features.findOne({
            application_alias: _moduleData.application_alias
        }).done(function ( err, success ) {

                if (err) return res.json(err, 500);

                return res.json(success);
            })
    },

    //Get all 'Directory' Applications
    index: function ( req, res ) {

        Applications.find({
            app_alias: _moduleData.application_alias
        }).done(function ( err, success ) {

                if (err) return res.json(err, 500);

                return res.json(success);
            })
    },


    create: function ( req, res ) {

        var app = {};
        //get the alias for the application being created
        app.alias = req.param('alias');
        app.title = _moduleData.title + ' [ ' + app.alias + '  ] ';
        app.description = _moduleData.description;
        app.app_alias = _moduleData.application_alias;
        app.is_root = true;

        Applications.create(app)
            .then(function ( newapp ) {
                return res.json(newapp, 201);
            })
            .fail(function ( error ) {
                console.log('application creation failed ' + JSON.stringify(error));
                return res.json(error, 500);
            });
    },

    createDefault: function ( req, res ) {

        var app = _defaultAppData;
        app.is_default = true;


        app.title = _moduleData.title + ' [ ' + app.alias + '  ] ';
        app.description = _moduleData.description;
        app.app_alias = _moduleData.application_alias;
        app.is_root = true;

        console.log(app);

        Applications.create(app)
            .then(function ( newapp ) {
                return res.json(newapp, 201);
            })
            .fail(function ( error ) {
                console.log('application creation failed ' + JSON.stringify(error));
                return res.json(error, 500);
            });

    },

    getDefault: function ( req, res ) {

        Applications.find({
            app_alias: _moduleData.application_alias,
            alias: _defaultAppData.alias
        }).done(function ( err, success ) {
                if (err) return res.json(err, 500);

                if (success) return res.json(success);
            })

    },

    getDirectoryProfiles: function ( req, res ) {

        Profiles.find({
            parent_application: req.param('id')
        }).done(function ( err, success ) {

                if (err) return res.json(err, 500);

                if (success) {

                    //get the category that goes with it
                    //                    success.getCategories();
                    return  res.json(success);
                } else {
                    return res.json({}, 404);
                }
            });
    },

    createProfile: function ( req, res ) {
        var errors = [];

         var entry = {};
        // Fields to be entered
        entry.title = req.param('title');
        entry.last_name = req.param('last_name');
        entry.first_name = req.param('first_name');
        entry.user_alias = req.param('user_alias');
        entry.department = req.param('department');
        entry.job_title = req.param('job_title');
        entry.profile_type = 'people';
        entry.work_phone = req.param('work_phone');
        entry.mobile_phone = req.param('mobile_phone');
        entry.work_email = req.param('work_email');

        entry.parent_application = req.param('id');

        Profiles.create(entry)
            .then(function ( success ) {
                return res.json(success, 201)
            })
            .fail(function ( error ) {

                console.log(JSON.stringify(error));
                if (error.ValidationError) {

                    // wrong email format
                    if (error.ValidationError.work_email) {

                        var errors = [];
                        var errorsLength = error.ValidationError.work_email.length;
                        errorsLength--;

                        error.ValidationError.work_email.forEach(function ( err, index ) {

                            err.field = 'work_email';
                            err['type'] = 'validation';
                            errors.push(err);

                            if (errorsLength === index) {
                                return res.json({
                                    responseMessage: {
                                        errors: errors
                                    }
                                }, 403);
                            }
                        });

                    }else{
                        return res.json(error, 500);
                    }

                } else {
                    return res.json(error, 500);
                    //return res.json({error: res.i18n("DB Error") }, 500);
                }


            });


    }

};

var validateEntry = function ( entry ) {

    var errors = [];

    if (!entry.first_name) {
        errors.push({
            type: 'validation',
            field: 'first_name',
            message: "Field <strong>alias</strong> is required"
        });
    }

    if (!entry.user_label) {
        errors.push({
            type: 'validation',
            field: 'first_name',
            message: "Field <strong>alias</strong> is required"
        });
    }

    if (!entry.profile_type) {
        errors.push({
            type: 'validation',
            field: 'first_name',
            message: "Field <strong>alias</strong> is required"
        });
    }

    if (!entry.last_name) {
        errors.push({
            type: 'validation',
            field: 'first_name',
            message: "Field <strong>alias</strong> is required"
        });
    }

    return errors;

};

var _moduleData = {
    title: 'Directory Manager',
    description: 'Manages profiles and contact information',
    application_alias: 'directory',
};

var _defaultAppData = {
    title: 'People Directory [default]',
    description: 'Default intranet web site',
    alias: 'people',
    is_root: true
};

var validateData;

validateData = function ( app ) {

    var errors = [];

    if (!app.alias) {
        errors.push({
            type: 'validation',
            field: 'alias',
            message: "Field <strong>alias</strong> is required"
        });
    }

    return errors;

};
