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

    //CONTENT

    //get all posts, includes search criteria
    'get /api/v1/content': {
        controller: 'content',
        action: 'find'
    },

    //create a new post
    'post /api/v1/content': {
        controller: 'content',
        action: 'create'
    },

    //create a new post
    'get /api/v1/content/search': {
        controller: 'content',
        action: 'search'
    },

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

    //get single post with the :postId
    'get /api/v1/content/:id': {
        controller: 'content',
        action: 'find'
    },

    //update post with the :postId
    'put  /api/v1/content/:id': {
        controller: 'content',
        action: 'update'
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


    //NEWS MANAGER

    //get all posts, includes search criteria
    'get /api/v1/news/posts': {
        controller: 'news',
        action: 'findPosts'
    },

    //create a new post
    'post /api/v1/news/posts': {
    controller: 'news',
    action: 'createPost'
    },

    //create a new post
    'get /api/v1/news/posts/search': {
        controller: 'news',
        action: 'searchPosts'
    },
    //get single post with the :postId
    'get /api/v1/news/posts/:id': {
        controller: 'news',
        action: 'findPosts'
    },

    //update post with the :postId
    'put  /api/v1/news/posts/:id': {
        controller: 'news',
        action: 'updatePost'
    },

    //create a new application
    'post /api/v1/news': {
        controller: 'news',
        action: 'create'
    },

    //feature
    //get the feature manager
    'get /api/v1/news/manager': {
        controller: 'news',
        action: 'getManager'
    },

    //install the feature manager
    'post /api/v1/news/manager': {
        controller: 'news',
        action: 'install'
    },

    //get posts for application with :id, includes search criteria
    'get /api/v1/news/:parent_application/posts': {
        controller: 'news',
        action: 'findPosts'
    },

    //get application with the :id
    'get /api/v1/news/:id': {
        controller: 'news',
        action: 'find'
    },

    //Calendar MANAGER

    //get all posts, includes search criteria
    'get /api/v1/calendar/posts': {
        controller: 'calendar',
        action: 'findPosts'
    },

    //create a new post
    'post /api/v1/calendar/posts': {
        controller: 'calendar',
        action: 'createPost'
    },

    //get single post with the :postId
    'get /api/v1/calendar/posts/:id': {
        controller: 'calendar',
        action: 'findPosts'
    },

    //update post with the :postId
    'put  /api/v1/calendar/posts/:id': {
        controller: 'calendar',
        action: 'updatePost'
    },

    //create a new application
    'post /api/v1/calendar': {
        controller: 'calendar',
        action: 'create'
    },

    //feature
    //get the feature manager
    'get /api/v1/calendar/manager': {
        controller: 'calendar',
        action: 'getManager'
    },

    //install the feature manager
    'post /api/v1/calendar/manager': {
        controller: 'calendar',
        action: 'install'
    },

    //get posts for application with :id, includes search criteria
    'get /api/v1/calendar/:parent_application/posts': {
        controller: 'calendar',
        action: 'findPosts'
    },

    //get application with the :id
    'get /api/v1/calendar/:id': {
        controller: 'calendar',
        action: 'find'
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

    'put /api/v1/classifieds/posts': {
        controller: 'classifieds',
        action: 'updatePost'
    },


    //create a new post
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

    //feature
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

/*




    //delete post with the :postId
    'delete /api/v1/news/posts/:postId': {
        controller: 'news',
        action: 'deletePost'
    },*/

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
    'get /api/v1/taxonomy/:id/terms': {
        controller: 'taxonomy',
        action: 'getChildrenTerms'
    },


    //APPLICATIONS MANAGER

    'get /api/v1/applications/app/:feature_id/:alias': {
        controller: 'applications',
        action: 'getApplication'
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
