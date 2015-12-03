var webpack = require("webpack");
var LiveReloadPlugin = require('webpack-livereload-plugin');
var path = require("path");
var fs = require("fs");

module.exports = {
    entry: getEntry(),
    output: {
        path: path.resolve(__dirname,"tmp"),
        filename: "app.js"
    },
    plugins: [
        new LiveReloadPlugin()
    ],
    module: {
        noParse: /js|css|less|html/
    },
    watch: true
}

function getEntry(options){
    var cwd = process.cwd();
    var entry = {
        app: []
    };

    function loop(pat){
        var names = fs.readdirSync(pat);
        names.forEach(function(name){
            var _pat = path.join(pat,name);
            if(fs.statSync(_pat).isDirectory()){
                loop(_pat)
            }else{
                var matched = name.match(/(.+)\.(js|css|less|html)$/);
                if(matched){
                    //entry[matched[1]] = options.prerender ? ["webpack/hot/dev-server",_pah]: [_pah]
                    entry["app"].push(_pat)
                }
            }
        })
    }
    loop(cwd);
    return entry;
}