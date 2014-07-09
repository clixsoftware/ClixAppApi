/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    find: function (req, res) {

        var query = require('url').parse(req.url, true).query;
        console.log(query);

        if (req.param('id')) {

            Applications.findOne(req.param('id'))
                .populate('parent_application_feature')
                .exec(function (err, success) {

                    if (err) return res.json(err, 500);

                    if (success) {
                        return res.json(success);
                    }
                })

        } else {
            Applications.find(query)
                .exec(function (err, success) {

                    if (err) return res.json(err, 500);

                    return res.json(success);
                });
        }
        // return res.json({hi: ''});
    },

    getApplication: function(req, res){

        console.log('get application');
        var query = require('url').parse(req.url,true).query;


        console.log(query);


        Applications.findOne({
            parent_feature: req.param('feature_id'),
            alias:  req.param('alias')

        }).exec(function(err, success){

                if (err ) return res.json(err, 500);

                if(success){
                    return res.json(success);
                }else{
                    return res.json({
                        name: 'No record found'
                    }, 404);
                }


            });
    }

};
