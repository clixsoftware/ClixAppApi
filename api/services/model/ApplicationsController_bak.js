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
                .done(function (err, success) {

                    if (err) return res.json(err, 500);

                    if (success) {
                        return res.json(success);
                    }
                })

        } else {
            Applications.find(query)
                .done(function (err, success) {

                    if (err) return res.json(err, 500);

                    return res.json(success);
                });
        }
        // return res.json({hi: ''});
    }

};
