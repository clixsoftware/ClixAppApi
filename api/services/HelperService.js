/**
 * Newsspace Utils
 *
 * @module      :: Utils
 * @description :: functions and enums for the Newsspace Utilities
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

//

module.exports = {


    postStatus: {
        approved: 1,
        waiting: 2,
        published: 4,
        expired: 8,
        draft: 16,
        saved: 32,
        archived: 64,
        featured: 128
    },

    features: {
        calendar: 1,
        news: 2,
        blog: 4,
        pages: 8,
        content: 16,
        tasks: 32,
        profiles: 64,
        image: 128,
        documents: 256,
        messages: 512,
        notes: 1024,
        comments: 2048,
        links: 4096,
        milestones: 8192,
        people: 16384,
        risks: 32768,
        announcements: 65536,
        workspace: 131072
    },

    /**
     * dbHelper
     *
     * @module              :: dbHelper
     * @description :: Contains helper about database.
     */

    /**
     * Merge attributes between an instance of a database model and an object of values. Useful before update a model or create one with dynamic fields.
     * @param       model {Object} Instance of a Database Model.
     * @param       data {Object} Data to
     * @param       keepUnusedFields {Array} Array of string which are the key to delete before try to add. Useful for be sure to don't update some fields if they are not set.
     * @returns     {model} Returns the model with fields updated.
     */
    merge: function(model, data, removeFields){
        removeFields = removeFields ? removeFields : false;

        // If we have fields to remove.
        if(removeFields && _.isArray(removeFields)){
            // Clean the object.
            for (var field in model){
                if(_.contains(removeFields, field)){
                    delete model[field];
                }
            }
        }

        // Update values.
        for (var field in data){
            model[field] = data[field];
        }

        return model;
    }



};
