/**
 * SettingsController.js
 *
 * @description :: Settings for the application
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    current: function(req, res){

        Settings.find()
            .then(function(model){
                return res.json(model[0]);
            })
    }

};
