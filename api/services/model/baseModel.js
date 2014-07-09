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

/*        edit_url: { //url to edit the record in the administration module'
            type: 'string'
        },
 */
        admin_path: {    //url to the administration module
            type: 'string'
        },

        sort_ordinal: {
            type: 'integer',
            defaultsTo: 1
        },

        hostName: function(){
            return 'http://intranet:3100/api/v1/';
        }

    }
};
