/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var contentController = require('./ContentController');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var util = require('util');

module.exports = _.merge(_.cloneDeep(contentController), {

    randomOne: function(req, res){

        console.log(req.options);

        var q = {
            zone:  req.param('zone'),
            feature: req.param('feature')
        }
        var sql = "SELECT * FROM content WHERE custom_fields->'adwords'->>'zone' = '"+ q.zone + "' AND custom_fields->'adwords'->>'feature' = '"+ q.feature  + "' ;"

        console.log(sql);

        Ads.query(sql, function(err, ads){
            if(err) return res.serverError(err);

            return  res.json( _.sample(ads.rows, 1)[0]);

        })

    }

});

var _moduleData = {
    title: 'Ad Manager',
    description: 'Manages ads for the Intranet Site',
    application_alias: 'ads'

};
