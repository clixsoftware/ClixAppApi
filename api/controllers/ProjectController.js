/**
 * NewspostController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var Q = require('q');
var _ = require('lodash');
var uuid = require('uuid-v4')

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

        Project.find(search)
            .done(function(err, success){
                if(err) return res.json(err, 500);

                return res.json(success);
            })
    }

};
