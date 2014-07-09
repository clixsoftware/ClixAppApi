/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    search: function(req, res){

        var query = require('url').parse(req.url, true).query;

        console.log(query);


        var search = {};

        if(_.has(query, 'criterion')){
            search.title = {
                'contains': req.param('criterion')
            };


        }
        console.log(search);

        Service.find(search)
            .done(function(err, success){
                if(err) return res.json(err, 500);

                return res.json(success);
            })
    }

};

