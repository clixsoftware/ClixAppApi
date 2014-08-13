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

});

var _moduleData = {
    title: 'Projects Manager',
    description: 'Manages the project information',
    application_alias: 'projects'
};
