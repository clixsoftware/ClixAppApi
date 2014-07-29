/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    //Get all 'News' Applications
    index: function ( req, res ) {

        Applications.find({
            app_alias: _moduleData.application_alias
        }).done(function(err, success){

                if(err) return res.json(err, 500);

                return res.json(success);
            })
    },

    //Install the feature
    installFeature: function ( req, res ) {
        var errors = [];

        Features.create(_moduleData)
            .then(function(feature){
                return res.json(feature, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });



    },

    //get the feature information
    getFeature: function(req, res){

        Features.findOne({
            application_alias: _moduleData.application_alias
        }).done(function(err, success){

                if(err) return res.json(err, 500);

                return res.json(success);
            })
    },

    //get posts for an application using the 'Id'
    search: function(req, res){
        var criterion = req.param('query');
        var parent_application = req.param('parent_application');
        var page = req.param('page');
        var limit = req.param('limit');

        if(!page){
            page = 1;
        }

        if(!limit){
            limit = 30
        }

        var query = {};

        if(criterion) {
            query = {
                title : {
                    'contains' : criterion
                }/*,
                parent_application: parent_application*/
            };

            if(parent_application){
                query.parent_application = parent_application;
            }
        }else{

            if(parent_application){
            query = {
                parent_application: parent_application
            };
            }

        }

        // console.log(query);
        Patients.find(query)
            .paginate({
                page: page,
                limit: limit
            })
            .exec(function(err, results){

                if(err) return res.json(err, 500);

                if(results){

                    Patients.count(query).exec(function(err, found){
                        var ret = {
                            models: results,
                            total: found,
                            page: page,
                            limit: limit
                        };

                        return res.json(ret);

                    });

                }


            })

    },

    //create a new post for an application
     createEntry: function(req, res){

        var patient = {};
         patient.first_name = req.param('first_name');
         patient.last_name = req.param('last_name');
         patient.age = req.param('age');
         patient.med_diagnosis = req.param('med_diagnosis');
         patient.med_procedure = req.param('med_procedure');

         patient.title = patient.first_name + ' ' + patient.last_name;
        //auto
         patient.parent_application = req.param('parent_application');

        Patient.create(patient)
            .then(function(post){
                return res.json(post, 201);
            })
            .fail(function(error){
                return res.json(error, 500);
            });


    },

    //get posts by the feature and the application alias
    getEntriesByAlias: function(req, res){

        Patient.find({
            parent_application_alias: req.param('application_alias'),
            parent_application_feature:  req.param('feature_alias')
        }).done(function(err, success){

                if(err)  return res.json(err, 500);

                return res.json(success);
            })
    }

};

var _moduleData = {
    title: 'Patient Manager',
    description: 'Manages the patients for the hospital',
    application_alias: 'patients'

};
