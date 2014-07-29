/**
 * Generic Content Model
 *
 * @module      :: Model
 * @description :: Base content model for generic content, news, blog,
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var appItemModel = require('../model/appItemModel'); //inherit from the base model
var _ = require('lodash');
var moment = require('moment');

module.exports = _.merge(_.cloneDeep(appItemModel), {

    attributes: {

        title: {
            type: 'string',
            required: true
        },

        short_title: {
            type: 'string'
        },

        content: {
            type: 'string'
        },

        start_date: {
            type: 'datetime'
        },

        publication_date: {
            type: 'datetime'
        },

        expiry_date: {
            type: 'datetime'
        },

        //Value that specifies the status of a list if it is moderated. 0 is approved; 2 is pending; 1 is rejected.
        moderation_status: {
            type: 'integer',
            defaultsTo: 2
        },

        node_path: {
            type: 'array'
        },

        parent_node: {
            type: 'integer'
        },

        size: {
            type: 'integer'
        },

        version_id: {
            type: 'integer',
            defaultsTo: 1
        },

        featured: {
            type: 'boolean',
            defaultsTo: false
        },
        comments_count: {
            type: 'integer',
            defaultsTo: 0
        },

        views: {
            type: 'integer',
            defaultsTo: 0
        },

        likes: {
            type: 'integer',
            defaultsTo: 0
        },

        dislikes: {
            type: 'integer',
            defaultsTo: 0
        },

        buildTaxonomy: function(){

            this.taxonomy = {};

            this.taxonomy.categories = [];
            this.taxonomy.tags = [];

            if(this.categories){

                var collection;

                try{
                    collection = JSON.parse(this.categories);
                }catch(err){
                    collection  =  this.categories;
                }finally {

                    var arrCol = [];

                    _.each(collection, function(tag){
                        var token = tag.split(';#');
                        //  console.log(token);
                        var id = token[0].trim();
                        var info = token[1].split('|');
                        var title = info[0];
                        var uuid = info[1];
                        var url = id + '-' + title.replace(/ /g, '-');

                        arrCol.push({
                            id: id,
                            title: title,
                            uuid: uuid
                        });

                    });

                    this.taxonomy.categories = arrCol;
                }

            }

            if(this.tags) {

                var tagCollection;

                try {
                    tagCollection = JSON.parse(this.tags);
                } catch (err) {
                    tagCollection = this.tags;
                } finally {

                    var arrTagCol = [];

                    _.each(tagCollection, function (tag) {
                        arrTagCol.push(tag);
                    });

                    this.taxonomy.tags = arrTagCol;

                }
            }

        },

        buildLinks: function () {

            this.buildPath();

            this.urls = {
                edit: {
                    href: this.path + '/edit',
                    title: 'Edit Feature',
                    description: 'Click to edit this feature'
                },

                show: {
                    href: this.path + '/index.html',
                    title: 'Feature Manager Home',
                    description: 'Go to directory manager home'
                }
            };


            return;


        },
        buildPath: function() {
            if(this.parent_application_feature === this.feature_alias){
                this.path =  '/' + this.feature_alias  + '/'  +  this.parent_application_alias + '/' + this.id + '-' +  this.title.toLowerCase().split(' ').join('-');
            }else{
                this.path =  '/' + this.parent_application_feature + '/'  + this.parent_application_alias + '/' + this.feature_alias + '/' +  this.id + '-' +   this.title.toLowerCase().split(' ').join('-');;
            }
        },

        toJSON: function () {
            this.buildTaxonomy();
            this.buildLinks();
            var obj = this.toObject();
            return obj;

         }
    }

});
