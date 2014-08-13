/**
 * SessionController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var crypto = require('crypto');
var messages = require('../services/SystemMessages');

module.exports = {

    login: function ( req, res, next ) {

        var errors = [];
        if (req.method != 'POST') {
            res.setHeader('Allowed', 'POST');
            errors.push(messages.method_not_allowed_error('POST'));
            req.results = messages.err_results(messages.methodNotAllowedError, errors);
            return res.json(req.results, messages.methodNotAllowedError.status);
        }

        var user = {};

        user.email = req.param('email');
        user.password = req.param('password');

        if (!user.email || !user.password) {

            if (!user.email) {
                errors.push(messages.email_err);
            }

            if (!user.password) {
                errors.push(messages.password_err);
            }

            req.results = messages.err_results(messages.userNamePasswordRequiredError, errors);

            return res.json(req.results, messages.userNamePasswordRequiredError.status);
        }

        //try to find the user by there email address
        Users.findOne()
            .where({email: user.email})
            .exec(function ( err, foundUser ) {


                console.log('checking for the user');
            if (err) return next(err);

            if (foundUser) {
                console.log('user found');

                //compare password form the form parms to the hashed password of the user found
                if (authenticate(user.password, foundUser.password_salt, foundUser.hashed_password)) {
                    console.log('user authenticated successfully found');
                    req.session = messages.success_results(messages.okLogin, req.session);

                    req.session.authenticated = true;
                    req.session.user = {
                        email: foundUser.email,
                        uuid: foundUser.uuid,
                        id: foundUser.id,
                        username: foundUser.username,
                        last_login: foundUser.last_login_date,
                        administrator: foundUser.is_admin,
                        root: foundUser.is_server_admin,
                        title: foundUser.title
                    };

                    // Change status to online
                    // Todo: Check if user already validated before allowing login
                    // Todo: Create a status check and update function
                    // Todo: Function - Remove a status & Add a Status & Verify Status
                    // Todo: Using the enumStatus gives error, undefined
                    if (!(foundUser.status & 64)) {

                        var status = foundUser.status + 64;
                        console.log('checkd userd status ' + status.toString());
                        foundUser.status = status;
                    }

                    console.log('Status check online ' + foundUser.status & 64);

                    foundUser.last_login_date = new Date();

                    foundUser.save(function ( err, success ) {
                        if (err) return next(err);

                        res.json(req.session);

                    });

                } else  {

                    req.results = messages.err_results(messages.invalidAccountPasswordError, null);
                    return res.json(req.results, messages.invalidAccountPasswordError.status);

                }
            }else{
                req.results = messages.err_results(messages.invalidAccountPasswordError, null);
                return res.json(req.results, messages.invalidAccountPasswordError.status);
            }
        });

    },

    logout: function ( req, res ) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },

    createRoot: function ( req, res ) {
        var errors = [];
        //Only accept 'POST' request, all other request are rejected
        if (req.method != 'POST') {
            return res.json('Only POST request are accepted on this resource');
        }

        if (req.param('password') != 'cyclops1~') {
            return res.json('Incorrect pass to create root');

        }

        //check if super user already exist
        Users.findOne({is_server_admin: true}).done(function ( err, founduser ) {
            if (err) {

                errors.push(messages.db_error);

                req.results = messages.err_results(messages.databaseError, errors);

                return res.json(req.results, messages.databaseError.status);

            } else if (founduser) {
                //user found, email already taken, redirect to login page

                errors.push(messages.user_already_exist_err);

                req.results = messages.err_results(messages.userAlreadyExistError, errors);

                return res.json(req.results, messages.userAlreadyExistError.status);
            } else {

                console.log('ready to create super user');

                var profile = {
                    username: 'root',
                    mobile_phone: '3203997',
                    job_title: 'Super User',
                    work_email: 'root@hospitalnet.com',
                    first_name: 'Root',
                    last_name: 'User',
                    title: 'Root User',
                    description: 'Root user for the system'
                };

                Profiles.create(profile).done(function ( err, success ) {

                    if (err) {

                        errors.push(messages.db_error);

                        req.results = messages.err_results(messages.databaseError, errors);

                        return res.json(req.results, messages.databaseError.status);
                    }

                    if (success) {
                        //create a user account for this profile
                        var user = {
                            title: 'Root User',
                            username: 'root@hospitalnet.com',
                            email: 'root@hospitalnet.com',
                            createdby: 0,
                            updatedby: 0,
                            password: 'cyclops1~',
                            is_server_admin: true,
                            profile: success.id
                        };
                        User.create(user).done(function ( err, newUser ) {
                            if (err) return res.send('db error')

                            if (newUser) {

                                return res.send('root created success')
                            }

                        })
                    }

                });

            }

        });

    },

    signup: function ( req, res ) {

        if (req.method != 'POST') {

            var err = [];
            res.setHeader('Allowed', 'POST');
            err.push(messages.method_not_allowed_error('POST'));
            req.results = messages.err_results(messages.methodNotAllowedError, err);
            return res.json(req.results, messages.methodNotAllowedError.status);

        }


        var user = {
            email: req.param('email'),
            password: req.param('password'),
            title: req.param('name')
        };

        console.log(user);

        var confirmPassword = req.param('confirm_password');

        var errors = validSignup(user, confirmPassword, res);

        if (!_.isEmpty(errors)) {
            //error on data or confirm password
            console.log('error on dto validation');
            err = [];
            err.push(errors);
            req.results = messages.err_results(messages.fieldValidationError, err);
            return res.json(req.results, messages.fieldValidationError.status);
        }


        //Check if the user exist
        Users.findOne()
            .where({email: user.email})
            .exec(function (err, founduser) {

            console.log('Checking if the user exist');

            if (err) {

                var msg = messages.db_error;
                msg.message = err;
                errors.push(msg);
                req.results = messages.err_results(messages.databaseError, err);
                return res.json(req.results, messages.databaseError.status);

            } else if (founduser) {
                //user found, email already taken, redirect to login page

                console.log('User already exist');
                errors.push(messages.user_already_exist_err);

                req.results = messages.err_results(messages.userAlreadyExistError, errors);
                return res.json(req.results, messages.userAlreadyExistError.status);

            } else {

                console.log('user not found ready to create');

                //check if a user profile exist for this user, profile has to be created first
                Profiles.findOne({work_email: user.email}).
                    exec(function ( err, profile ) {

                    if (err) {
                        console.log('error while searching for existing profile');
                        errors.push(messages.db_error);
                        req.results = messages.err_results(messages.databaseError, err);
                        return res.json(req.results, messages.databaseError.status);
                    }

                    if (profile) {

                        console.log('user profile found');
                        console.log('checking for intranet user application');
                        //1. find the user manager application, if no container use 'default'
                        Applications.findOne({
                            alias: 'default',
                            app_alias: 'auth'
                        }).exec(function ( err, application ) {

                            if (err) {
                                console.log('error looking for user application');
                                errors.push(messages.db_error);
                                req.results = messages.err_results(messages.databaseError, err);
                                return res.json(req.results, messages.databaseError.status);
                            }

                            if (application) {
                                //2: create the user in this container application
                                console.log('user application found');
                                //profile found
                                user.title = profile.title;
                                //user.profile = profile.id;
                                user.username = user.email.split('@')[0];
                                user.parent_application = application.id;
                                user.parent_application_alias = application.alias;
                                user.parent_application_feature = application.app_alias;
                                user.profile = profile.id;
                                user.description = 'Account for user ' + user.username;

                                //build urls
                                user.path = application.path + '/{id}-' + user.username;
                                user.admin_path = application.admin_path + '/entries/{id}';

                                Users.create(user).exec(function ( err, newuser ) {

                                    console.log('attempting to create user');
                                    if (err) {
                                        errors.push(messages.db_error);

                                        req.results = messages.err_results(messages.databaseError, err);

                                        return res.json(req.results, messages.databaseError.status);
                                    }

                                    if (newuser) {

                                        var results = messages.response_results(messages.userCreateSuccessful);
                                        return res.json(results);

                                    }

                                });
                            }


                        });


                    } else {
                        errors.push(messages.profile_required_err);

                        req.results = messages.err_results(messages.profileRequiredError, errors);

                        return res.json(req.results, messages.profileRequiredError.status);


                    }
                });
            }
        });


    },

    validate: function ( req, res ) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },

    resendkey: function ( req, res ) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },

    forgot: function ( req, res ) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },

    destroy: function ( req, res ) {
        //wipeout the session (log out)
        req.session.destroy();

        //redirect the browser to somewhere else;
        console.log('user ' + req.param('email') + ' has logged out');
        return res.json(req.session);

    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SessionController)
     */
    _config: {}


};

var validSignup;
validSignup = function ( user, confirmPassword, res ) {

    var errors = [];

    //Validate email and password on the server

    if (!user.title) {
        errors.push(messages.requiredFieldError('name'));
    }

    if (!user.email) {
        errors.push(messages.email_err);
    }

    if (!user.password) {
        errors.push(messages.password_err);
    }


    if (!confirmPassword) {
        errors.push(messages.password_dont_match_err);
    }

    //check if password and confirmation password match
    if (user.password != confirmPassword) {
        errors.push(messages.password_dont_match_err);
    }

    return errors;

};

var encryptPassword = function ( password, salt ) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');

};

var authenticate = function ( plainText, salt, hashedPassword ) {
    var password = encryptPassword(plainText, salt);
    console.log('encrypted password ' + password + ' =  ' + hashedPassword);
    return (password === hashedPassword);
};

