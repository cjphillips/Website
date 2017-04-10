// Name: Colin Phillips
// Id:   11357836

var http = require("http");
var fs = require("fs");
var pathUtil = require("path");
var path = null;

var handler = function(request, response)
{
  console.log("+ Handling request with URL: '" + request.url + "' ... ");
  // The URL must start with '/lists' or '/files'
  if (request.url.length < 6)
  {
    console.log("-- URL of length " + request.url.length + " was ignored.");
    response.writeHead(400, {"Content-Type" : "text/html", "Access-Control-Allow-Origin" : "*"});
    response.end("<html><h1>400 - Bad Request</h1></html>");
    return;
  }

  var url = request.url;
  var service = url.substr(0, 6);
  url = url.length == 6 ? '/' : url.substr(6);

  var serviceHandler;
  if (service == "/lists")
  {
    console.log("> Requested service: Lists");
    serviceHandler = new ListService(url, response);
  }
  else if (service == "/files")
  {
    console.log("> Requested service: Files");
    serviceHandler = new FilesService(url, response);
  }
  else
  {
    response.writeHead(404, {"Content-Type" : "text/html", "Access-Control-Allow-Origin" : "*"});
    response.end("<html><h1>400 - Bad Request.</h1></html>");
    return;
  }

  serviceHandler.handle();
}

function Service(url, response)
{
  // Get the true path to the desired file / directory
  this.url = url == '/' ? url : url + "/";
  this.actualPath = decodeURI(pathUtil.join(path, url));
  console.log("ACTUAL PATH: " + this.actualPath);

  this.res = response;
}

Service.prototype.handle = function()
{
  this.res.writeHead(500, {"Content-Type" : "text/html", "Access-Control-Allow-Origin" : "*"});
  this.res.end("<html><h1>500 - Internal Server Error.</h1></html>");
}

function ListService(url, response)
{
  Service.call(this, url, response);
}
ListService.prototype = Object.create(Service.prototype);
ListService.prototype.handle = function()
{
  console.log("Creating XML of file located at '" + this.actualPath + "' ... ");

  // *Synchronously* get the list of files; otherwise there is no guarantee that we have all items before the for-loop before
  var items = fs.readdirSync(this.actualPath);

  var xml = "<file_list count='" + items.length + "'>\n";
  for(var i = 0; i < items.length; i++)
  {
    var file = pathUtil.join(this.actualPath, items[i]);
    console.log(" ... Stat-ing file: " + file);
    var stats = fs.statSync(file);
    var fileOrDir;
    if (stats.isDirectory())
    {
      fileOrDir = "directory";
    }
    else if (stats.isFile())
    {
      fileOrDir = "file";
    }
    else
    {
      continue;
    }

    var pathTo = this.url + items[i];
    if (fileOrDir == 'directory') pathTo += "/";

    xml += ("  <" + fileOrDir + " path='" + pathTo + "'>\n");
    xml += ("    <name>" + items[i] + "</name>\n");
    xml += ("    <size>" + stats.size + "</size>\n");
    xml += ("    <atime>" + stats.atime + "</atime>\n");
    xml += ("    <ctime>" + stats.ctime + "</ctime>\n");
    xml += ("    <mtime>" + stats.mtime + "</mtime>\n");
    xml += ("  </" + fileOrDir + ">\n");
  }

  xml += "</file_list>\n";

  this.res.writeHead(200, {"Content-Type" : "text/xml", "Access-Control-Allow-Origin" : "*"});
  this.res.end(xml);
}

function FilesService(url, response)
{
  Service.call(this, url, response);
}
FilesService.prototype = Object.create(Service.prototype);
FilesService.prototype.handle = function()
{
  console.log("HERE");
  // Create the read stream from the true path
  var readStream = fs.createReadStream(this.actualPath);
  var stats = fs.statSync(this.actualPath);
  var contentType = getContentType(pathUtil.extname(this.actualPath));

  this.res.writeHead(200,
    {"Content-Type" : contentType,
     "Content-Length" : stats.size,
     "Access-Control-Allow-Origin" : "*"});

  readStream.on('data', function(response)
    {
      return function(chunk)
      {
        response.write(chunk);
      }
  }(this.res)).on('end', function(response)
  {
    return function() { reponse.end(); }
  });
}

function getContentType(ext)
{
  if (ext == '.pdf') return "application/pdf";
  if (ext == '.html' || ext == '.htm') return "text/html";
  if (ext == '.png') return "image/png";
  if (ext == '.jpg' || ext == '.jpeg') return "image/jpg";
  if (ext == '.mov') return "video/quicktime";
  if (ext == '.doc') return "application/msword";
  if (ext == '.mp4') return "video/mp4"
  if (ext == '.css') return "text/css";

  return "text/plain";
}

// Script BEGIN
path = process.argv.length < 3
        ? process.cwd()
        : pathUtil.resolve(process.argv[2]);

if (!fs.existsSync(path))
{
  console.error("'" + path + "': path does not exist.");
  return;
}

http.createServer(handler).listen(8080);
console.log('Server started ...');
console.log('- Domain: http://127.0.0.1:8080/');
console.log('- Path:   ' + path);
console.log('> Listening on port 8080:');
// Script END
