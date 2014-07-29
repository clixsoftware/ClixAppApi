/**
 * Created by developer on 2/12/14.
 */

module.exports = {

    attributes: {

        title: {
            type: 'string',
            required: 'true'
        },

        description: {
            type: 'string'
        },

        /* admin_path: {    //url to the administration module
            type: 'string'
        },*/

        sort_ordinal: {
            type: 'integer',
            defaultsTo: 1
        },

        custom_fields: {
            type: 'json'
        },

        //Value that specifies the status of a list if it is moderated. 0=published; 2=scheduled; 1=expired, 4=archived.
        status: {
            type: 'integer'
        },

        hostName: function(){
            return sails.config.apiServerUrl
        },

        clientServer: function(){
            return sails.config.clientServerUrl
        }

    }
};
