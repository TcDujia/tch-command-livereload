var path = require("path");
var fs = require("fs");
var url = require("url");
var exec = require("child_process").exec;
var express = require('express');
var app = express();

exports.register = function(commandar){
    commandar
          .option("-p, --port","服务端口号", String)
          .action(function(arg){
              var port = typeof arg === "string" ? arg : "3002";
              var config = path.resolve(__dirname,"webpack.config.js");
              exec('webpack --config "' + config +'"',function(err,stdout){
                  console.log(stdout);
                  if(err){
                      console.log(err.message);
                  }
              });
              app
				.use(function(req,res,next){
					var pathname = url.parse(req.url).pathname;
					var realpath = path.join(process.cwd(),pathname);
					var tmppath = path.resolve(__dirname,"tmp/app.js");
					if(/(\/|\\)$/.test(realpath)){
						realpath += "index.html";
					}
					if(/\.html$/.test(realpath)){
						fs.exists(realpath, function (exists) {
							if (!exists) {
								res.writeHead(404, {'Content-Type': 'text/plain'});
								res.write("This request URL " + pathname + " was not found on this server.");
								res.end();
							}else{
								fs.readFile(realpath, "binary", function(err, file) {
									if (err) {
										res.writeHead(500, {'Content-Type': 'text/plain'});
										res.end(err);
									} else {
										res.writeHead(200, {'Content-Type': 'text/html'});
										res.write(file, "binary");
										res.write('<script src="http://localhost:35729/livereload.js"></script>');
										res.end();
									}
								});
							}
						})
					}else{
						next()
					}
				})
				.use(express.static(path.resolve('./')))
				.listen(port, function() {
					console.log('listening on %d', port);
				})
          })
}


