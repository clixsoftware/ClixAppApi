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
    //NEWS MANAGER

    //install the feature
    'post /api/v1/news/feature': {
       controller: 'news',
       action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/news/feature': {
        controller: 'news',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/news/:id/posts': {
        controller: 'news',
        action: 'getPosts'
    },

    //create a new post for the id
    'post /api/v1/news/:id/posts': {
        controller: 'news',
        action: 'createPost'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/news/posts/:feature_alias/:application_alias': {
        controller: 'news',
        action: 'getPostsByAlias'
    },

    //NEWSPOST MANAGER


    //Add a category to the how do I post
    'get /api/v1/newspost/tracker/:id': {
        controller: 'newspost',
        action: 'getById'
    },


    //install the feature
    'put /api/v1/newspost/:id/category': {
        controller: 'newspost',
        action: 'addCategory'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/newspost/featured/:feature_alias/:application_alias': {
        controller: 'newspost',
        action: 'getFeatured'
    },
    //HOW DO I  MANAGER

    //install the feature
    'post /api/v1/yp/feature': {
        controller: 'yp',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/yp/feature': {
        controller: 'yp',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/yp/:id/posts': {
        controller: 'yp',
        action: 'getPosts'
    },

    //create a new post for the id
    'post /api/v1/yp/:id/posts': {
        controller: 'yp',
        action: 'createPost'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/yp/posts/:feature_alias/:application_alias': {
        controller: 'yp',
        action: 'getPostsByAlias'
    },

    //HOW DO I
    //Add a category to the how do I post
    'put /api/v1/howdois/category/:id': {
        controller: 'howdois',
        action: 'addCategory'
    },

    //Add a category to the how do I post
    'get /api/v1/howdois/category/:id': {
        controller: 'howdois',
        action: 'getPostsByCategory'
    },


    //Add a category to the how do I post
    'get /api/v1/howdois/tracker/:id': {
        controller: 'howdois',
        action: 'getById'
    },

    //Add a category to the how do I post
    'get /api/v1/howdois/recent': {
        controller: 'howdois',
        action: 'getRecent'
    },

    //Add a category to the how do I post
    'get /api/v1/howdois/mostactive': {
        controller: 'howdois',
        action: 'getMostActive'
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
    'get /api/v1/taxonomy/:id/posts': {
        controller: 'taxonomy',
        action: 'getPosts'
    },

    //create a new post for the id
    'post /api/v1/taxonomy/:id/posts': {
        controller: 'taxonomy',
        action: 'createPost'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/taxonomy/posts/:feature_alias/:application_alias': {
        controller: 'taxonomy',
        action: 'getPostsByAlias'
    },

    //Add a term to an object
    'put /api/v1/taxonomy/terms/:id': {
        controller: 'taxonomy',
        action: 'addTermToObject'
    },

    //Get object terms
    'get /api/v1/taxonomy/object/:id': {
        controller: 'taxonomy',
        action: 'getObjectTerms'
    },

    //Get object terms
    'get /api/v1/taxonomy/app/:id': {
        controller: 'taxonomy',
        action: 'getAppTerms'
    },

    //APPLICATIONS MANAGER

    'get /api/v1/applications/app/:feature_id/:alias': {
        controller: 'applications',
        action: 'getApplication'
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

    //PROJECTS MANAGER

    //install the feature
    'post /api/v1/projects/feature': {
        controller: 'projects',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/projects/feature': {
        controller: 'projects',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/projects/:id/entries': {
        controller: 'projects',
        action: 'getProjects'
    },

    //create a new post for the id
    'post /api/v1/projects/:id/entries': {
        controller: 'projects',
        action: 'createProject'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/news/projects/:feature_alias/:application_alias': {
        controller: 'projects',
        action: 'getProjectsByAppAlias'
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
    'get /api/v1/support/apps/:id/services': {
        controller: 'support',
        action: 'getServices'
    },

    //create a new service record for the support application
    'post /api/v1/support/apps/:id/services': {
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

    //get all the tickets for the support application
    'get /api/v1/support/services/:id': {
        controller: 'support',
        action: 'getService'
    },

    //CALENDAR EVENTS MANAGER

    //install the feature
    'post /api/v1/calendar/feature': {
        controller: 'calendar',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/calendar/feature': {
        controller: 'calendar',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/calendar/:id/entries': {
        controller: 'calendar',
        action: 'getPosts'
    },

    //create a new post for the id
    'post /api/v1/calendar/:id/entries': {
        controller: 'calendar',
        action: 'createPost'
    },

    //GET events by feature and parent
    'get /api/v1/events/parent/:feature/:app_alias': {
        controller: 'events',
        action: 'getByFeatureParent'
    },


    //BLOGS MANAGER

    //install the feature
    'post /api/v1/blogs/feature': {
        controller: 'blogs',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/blogs/feature': {
        controller: 'blogs',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/blogs/:id/posts': {
        controller: 'blogs',
        action: 'getBlogPosts'
    },

    //get all the posts for the news id
    'get /api/v1/blogs/:id/recent': {
        controller: 'blogs',
        action: 'getBlogRecentPosts'
    },

    //create a new post for the id
    'post /api/v1/blogs/:id/posts': {
        controller: 'blogs',
        action: 'createBlogPost'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/blogs/applications/:feature_alias/:application_alias': {
        controller: 'blogs',
        action: 'getBlogsByAppAlias'
    },

    //PAGES MANAGER

    //install the feature
    'post /api/v1/pages/feature': {
        controller: 'pages',
        action: 'installFeature'
    },

    // get the feature information
    'get /api/v1/pages/feature': {
        controller: 'pages',
        action: 'getFeature'
    },

    //get all the posts for the news id
    'get /api/v1/pages/:id/posts': {
        controller: 'pages',
        action: 'getPagePosts'
    },

    //create a new post for the id
    'post /api/v1/pages/:id/posts': {
        controller: 'pages',
        action: 'createPagePost'
    },

    //Get Posts using the Feature Alias 'sites' and the Application Alias 'default'
    'get /api/v1/pages/applications/:feature_alias/:application_alias': {
        controller: 'pages',
        action: 'getAppByAppAlias'
    }

};
