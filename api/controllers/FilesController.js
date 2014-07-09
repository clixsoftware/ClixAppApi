/**
 * FrontPageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var fs = require("fs-extra");

module.exports = {


    getDirectory: function(req, res){

        var path = config.base + '/' + req.param('files_path');

        fs.readdir(path, function(err, files){
            if(err){
                return res.json(err, 500);
            }else{

                // Ensure ending slash on path
                (path.slice(-1)!=="/") ? path = path + "/" : path = path;

                var output = {},
                    output_dirs = {},
                    output_files = [],
                    current,
                    relpath,
                    link;

                // Function to build item for output objects
                var createItem = function (id, current, relpath, type, link) {
                    return {
                        id: id,
                        title: current,
                        path: relpath.replace('//','/'),
                        type: type,
                        size: fs.lstatSync(current).size,
                        atime: fs.lstatSync(current).atime.getTime(),
                        mtime: fs.lstatSync(current).mtime.getTime(),
                        link: link
                    };
                };

                // Sort alphabetically
                files.sort();

                // Loop through and create two objects
                // 1. Directories
                // 2. Files
                for (var i=0, z=files.length-1; i<=z; i++) {
                    current = path + files[i];
                    relpath = current.replace(config.base,"");
                    (fs.lstatSync(current).isSymbolicLink()) ? link = true : link = false;

                    if (fs.lstatSync(current).isDirectory()) {
                    //    output_dirs[files[i]] = createItem(current,relpath,"directory",link);
                    } else {
                      //  output_files[files[i]] = createItem(current,relpath,"file",link);
                        output_files.push(createItem(i, current, relpath, "file", link));
                    }
                }

                // Merge so we end up with alphabetical directories, then files
              //  output = merge(output_dirs,output_files);

                // Send output
                return res.json(output_files);

            }

        })

    }


};

var config = {
    // Authentication keys
    keys: [
        "12345",
        "67890"
    ],
    /**
     * Allowed IP's or ranges
     * Can use * for wildcards, *.*.*.* for no restrictions
     */
    ips: [
        "*.*.*.*"
    ],
    /**
     * SSL Config
     * Set key and cert to absolute path if SSL used, false if not
     */
    ssl: {
        key: false,
        cert: false
    },
    // Port designation
    port: 8080,
    // Base directory
    base: "assets",
    // Default create mode
    cmode: "0755"
};
/** Merge function*/


var merge = function (obj1,obj2) {
    var mobj = {},
        attrname;

    for (attrname in obj1) { mobj[attrname] = obj1[attrname]; }
    for (attrname in obj2) { mobj[attrname] = obj2[attrname]; }

    return mobj;
};

/**
 * Get Base Path
 */

var getBasePath = function (path) {
    var base_path = path.split("/");

    base_path.pop();
    return base_path.join("/");
};

/**
 * Check Path
 */

var checkPath = function (path) {
    var base_path = getBasePath(path);
    return fs.existsSync(base_path);
};
