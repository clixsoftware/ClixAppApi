/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Q = require('q');

module.exports = {


    //get all applications (home manager)
    create: function (req, res) {
        var app = {};
        //get the alias for the application being created
        app.alias = req.param('alias');
        app.title = _moduleData.title + ' [ ' + app.alias + '  ] ';
        app.description = _moduleData.description;
        app.app_alias = _moduleData.application_alias;
        app.is_root = true;

        Applications.create(app)
            .then(function (newapp) {
                return res.json(newapp, 201);
            })
            .fail(function (error) {
                console.log('application creation failed ' + JSON.stringify(error));
                return res.json(error, 500);
            });

    },

    //Get all 'Site' Applications
    index: function (req, res) {

        Applications.find({
            app_alias: _moduleData.application_alias
        }).done(function (err, success) {

                if (err) return res.json(err, 500);

                return res.json(success);
            })
    },

    //Install the Site Feature
    installFeature: function (req, res) {
        var errors = [];

        Features.create(_moduleData)
            .then(function (feature) {
                return res.json(feature, 201);
            })
            .fail(function (error) {
                return res.json(error, 500);
            });


    },

    getFeature: function (req, res) {

        Features.findOne({
            application_alias: _moduleData.application_alias
        }).done(function (err, success) {

                if (err) return res.json(err, 500);

                return res.json(success);
            })
    },

    getDefaultSite: function (req, res) {

        Applications.findOne({
            is_default: true,
            app_alias: _moduleData.application_alias
        }).done(function (err, success) {

                if (err) return res.json(err, 500);

                return res.json(success);
            })

    },

    createDefaultSite: function (req, res) {

        var app = _defaultSiteAppData;
        app.is_default = true;


        app.title = _moduleData.title + ' [ ' + app.alias + '  ] ';
        app.description = _moduleData.description;
        app.app_alias = _moduleData.application_alias;
        app.is_root = true;

        console.log(app);

        Applications.create(app)
            .then(function (newapp) {
                return res.json(newapp, 201);
            })
            .fail(function (error) {
                console.log('application creation failed ' + JSON.stringify(error));
                return res.json(error, 500);
            });

    },

    getByAlias: function (req, res) {

        Applications.findOne({
            alias: req.param('id'),
            app_alias: _moduleData.application_alias
        }).done(function (err, success) {

                if (err) return res.json(err, 500);

                return res.json(success);
            })

    },

    getApps: function (req, res) {

        //site id  from url.params,
        var siteId = req.param('id');

        Applications.find({
            parent_application: siteId
        }).done(function (err, success) {

                if (err) return res.json(err, 500);

                return res.json(success);


            })

    },

    createApp: function (req, res) {

        var data = {
            app_alias: req.param('app_alias'),
            alias: req.param('alias'),
            parent_application: req.param('id') //retrieve automatically from route/url
        };

        data.title = _moduleData.title;

        Applications.create(data)
            .then(function (app) {
                return res.json(app, 201);

            })
            .fail(function (error) {

                //console.log(error.Error);

                return res.json({
                    error: error
                }, 500);
            })
    }

};


var _moduleData = {
    title: 'Site Manager',
    description: 'Manages the intranet sites',
    application_alias: 'sites'
};

var _defaultSiteAppData = {
    title: 'UHWI Intranet Site [default]',
    description: 'Default intranet web site',
    alias: 'default',
    is_root: true
};