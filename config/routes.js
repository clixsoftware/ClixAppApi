/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 * 
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.) 
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg` 
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or 
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  // 
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  '/': {
    view: 'homepage'
  },


  // Custom routes here...

  // If a request to a URL doesn't match any of the custom routes above, it is matched 
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

    //SYSTEM SETTINGS
    // get the feature information
    'get /api/v1/settings/current': {
        controller: 'settings',
        action: 'current'
    },

    //IMAGES
    //install the feature
    'post /api/v1/images': {
        controller: 'images',
        action: 'upload'
    },

    //AUTHENTICATION
    //install the FEATURE
    'post /api/v1/auth/signup': {
        controller: 'auth',
        action: 'signup'
    },

    //FILES
    // get the feature information
    'get /api/v1/files/dir/:files_path': {
        controller: 'files',
        action: 'getDirectory'
    },


    //Directory Manager
    //install the feature
    'post /api/v1/directory/feature': {
        controller: 'directory',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/directory/feature': {
        controller: 'directory',
        action: 'getFeature'
    },

    //get the default directory
    'get /api/v1/directory/default': {
        controller: 'directory',
        action: 'getDefault'
    },

    //create the default directory
    'post /api/v1/directory/default': {
        controller: 'directory',
        action: 'createDefault'
    },

    //create a directory
    'post /api/v1/directory': {
        controller: 'directory',
        action: 'create'
    },

    //create a profile
    'post /api/v1/directory/:id/posts': {
        controller: 'directory',
        action: 'createProfile'
    },

    'get /api/v1/directory/:id/posts': {
        controller: 'directory',
        action: 'getDirectoryProfiles'
    },


    //PROFILES

    'get /api/v1/profiles/user/:id': {
        controller: 'profiles',
        action: 'findProfileViaUser'
    },

    //PATIENTS MANAGER

    //install the feature
    'post /api/v1/patients/feature': {
        controller: 'patients',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/patients/feature': {
        controller: 'patients',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/patients/:parent_application/entries': {
        controller: 'patients',
        action: 'search'
    },

    'get /api/v1/patients/entries': {
        controller: 'patients',
        action: 'search'
    },

    //create a new post for the id
    'post /api/v1/patients/:parent_application/entries': {
        controller: 'patients',
        action: 'createEntry'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/patients/entries/:feature_alias/:application_alias': {
        controller: 'patients',
        action: 'getEntriesByAlias'
    },

    //CLASSIFIEDS MANAGER


    //get all posts, includes search criteria
    'get /api/v1/classifieds/posts': {
        controller: 'classifieds',
        action: 'findPosts'
    },

    //create a new post
    'post /api/v1/classifieds/posts': {
        controller: 'classifieds',
        action: 'createPost'
    },

    //update the specified post
    'put /api/v1/classifieds/posts': {
        controller: 'classifieds',
        action: 'updatePost'
    },

    //search for posts
    'get /api/v1/classifieds/posts/search': {
        controller: 'classifieds',
        action: 'searchPosts'
    },

    //get single post with the :postId
    'get /api/v1/classifieds/posts/:id': {
        controller: 'classifieds',
        action: 'findPosts'
    },

    //update post with the :postId
    'put  /api/v1/classifieds/posts/:id': {
        controller: 'classifieds',
        action: 'updatePost'
    },

    //create a new application
    'post /api/v1/classifieds': {
        controller: 'classifieds',
        action: 'create'
    },

    //get the feature manager
    'get /api/v1/classifieds/manager': {
        controller: 'classifieds',
        action: 'getManager'
    },

    //install the feature manager
    'post /api/v1/classifieds/manager': {
        controller: 'classifieds',
        action: 'install'
    },

    //get posts for application with :id, includes search criteria
    'get /api/v1/classifieds/:parent_application/posts': {
        controller: 'classifieds',
        action: 'findPosts'
    },

    //get application with the :id
    'get /api/v1/classifieds/:id': {
        controller: 'classifieds',
        action: 'find'
    },


    //TAXONOMY MANAGER

    //install the feature
    'post /api/v1/taxonomy/feature': {
        controller: 'taxonomy',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/taxonomy/feature': {
        controller: 'taxonomy',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/taxonomy/:id/terms': {
        controller: 'taxonomy',
        action: 'getChildrenTerms'
    },


    //APPLICATIONS MANAGER

    'get /api/v1/applications/app/:parent_feature/:alias': {
        controller: 'applications',
        action: 'findOne'
    },

    'post  /api/v1/applications/:id/tags': {
        controller: 'applications',
        action: 'addTags'
    },

    'post  /api/v1/applications/:id/terms': {
        controller: 'applications',
        action: 'addTerms'
    },

    // SITES MANAGER

    'get /api/v1/sites/feature': {
        controller: 'sites',
        action: 'getFeature'
    },

    'post /api/v1/sites/feature': {
        controller: 'sites',
        action: 'installFeature'
    },

    'post /api/v1/sites': {
        controller: 'sites',
        action: 'create'
    },

    //create a new sub application e.g. news
    'post /api/v1/sites/:id/apps': {
        controller: 'sites',
        action: 'createApp'
    },

    //get all sub applications for the current site
    'get /api/v1/sites/:id/apps': {
        controller: 'sites',
        action: 'getApps'
    },

    //get the default site
    'get /api/v1/sites/default': {
        controller: 'sites',
        action: 'getDefaultSite'
    },

    //get the default site
    'post /api/v1/sites/default': {
        controller: 'sites',
        action: 'createDefaultSite'
    },

    //get the default site
    'get /api/v1/sites/alias/:id': {
        controller: 'sites',
        action: 'getByAlias'
    },


    //SUPPORT MANAGER

    //install the feature
    'post /api/v1/support/feature': {
        controller: 'support',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/support/feature': {
        controller: 'support',
        action: 'getFeature'
    },

    //get all the services for the support application
    'get /api/v1/support/:parent_application/services': {
        controller: 'support',
        action: 'findServices'
    },

    'get /api/v1/support/:parent_application/services/search': {
        controller: 'support',
        action: 'searchServices'
    },

    //get all the services for the support application
    'get /api/v1/support/:parent_application/services/:id': {
        controller: 'support',
        action: 'findServices'
    },


    //create a new service record for the support application
    'post /api/v1/support/apps/:parent_application/services': {
        controller: 'support',
        action: 'createService'
    },

    //get all the tickets for the support application
    'get /api/v1/support/:id/tickets': {
        controller: 'support',
        action: 'getTickets'
    },

    //create a new service record for the support application
    'post /api/v1/support/tickets': {
        controller: 'support',
        action: 'createTicket'
    },

    //update the ticket
    'put /api/v1/support/tickets': {
        controller: 'support',
        action: 'updateTicket'
    },

    //get all the tickets for the support application
    'get /api/v1/support/services/:id': {
        controller: 'support',
        action: 'getService'
    },

    //ADS
    'get /api/v1/ads/random': {
        controller: 'ads',
        action: 'randomOne'
    },


//CONTENT

  /*  //get all posts, includes search criteria
*//*    'get /api/v1/content': {
        controller: 'content',
        action: 'find'
    },*//*

    //create a new post
    'post /api/v1/content': {
        controller: 'content',
        action: 'create'
    },

*//*    //Search the content
    'get /api/v1/content/search': {
        controller: 'content',
        action: 'search'
    },*//*

    //add taxonomy tags  to a item
    'post  /api/v1/content/:id/tags': {
        controller: 'content',
        action: 'addTags'
    },

    //add taxonomy terms to a item
    'post  /api/v1/content/:id/terms': {
        controller: 'content',
        action: 'addTerms'
    },

    //get posts for application with :id, includes search criteria
    'get /api/v1/content/apps/:parent_application/posts': {
        controller: 'content',
        action: 'find'
    },

*//*    //get single post with the :postId
    'get /api/v1/content/:id': {
        controller: 'content',
        action: 'find'
    },*//*

    //update post with the :postId
    'put  /api/v1/content/:id': {
        controller: 'content',
        action: 'update'
    },*/

    //MODULES INHERITING FROM CONTENT

    //get all posts for a specific content feature e.g. all news post , includes search criteria
    'get /api/v1/:feature_alias/posts': {
        controller: 'content',
        action: 'find'
    },

    //Search all posts for the feature
    'get /api/v1/:feature_alias/posts/search': {
        controller: 'content',
        action: 'search'
    },


    //Search all posts for the an application
    'get /api/v1/:feature_alias/:parent_application/:content_type/posts': {
        controller: 'content',
        action: 'search'
    },

    'get /api/v1/:feature_alias/:parent_application/:content_type/:parent_node/posts': {
        controller: 'content',
        action: 'search'
    },

    //Search all posts for the an application
    'get /api/v1/:feature_alias/:parent_application/posts/search': {
        controller: 'content',
        action: 'search'
    },

    //add taxonomy tags  to a item
    'post  /api/v1/:feature_alias/:parent_application/posts/:id/tags': {
        controller: 'content',
        action: 'addTags'
    },

    //add taxonomy terms to a item
    'post  /api/v1/:feature_alias/:parent_application/posts/:id/terms': {
        controller: 'content',
        action: 'addTerms'
    },

    //create a new post
    'post /api/v1/:feature_alias/:parent_application/posts': {
        controller: 'content',
        action: 'create'
    },

    //get posts for application with :id, includes search criteria
    'get /api/v1/:feature_alias/:parent_application/posts': {
        controller: 'content',
        action: 'find'
    },

    //get posts for application with :id, includes search criteria
    'put /api/v1/:feature_alias/:parent_application/posts': {
        controller: 'content',
        action: 'update'
    },

    //get single post with the :postId
    'get /api/v1/:feature_alias/:parent_application/posts/:id': {
        controller: 'content',
        action: 'find'
    },

    //update the specified post
    'put /api/v1/:feature_alias/:parent_application/posts/:id': {
        controller: 'content',
        action: 'update'
    },

    //get the feature manager
    'get /api/v1/:feature_alias/manager': {
        controller: 'content',
        action: 'getManager'
    }/*,

    //get application with the :id
    'get /api/v1/:feature_alias/:id': {
        controller: 'content',
        action: 'find'
    }*/


};
