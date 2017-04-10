var http = require("http");
var fs = require("fs");

var handler = function (request, response)
{
  // The URL must start with '/lists' or '/files'
  if (request.url.length < 6)
  {
    response.writeHead(400, {"Content-Type" : "text/html"});
    response.end("<html><h1>400 Bad Request</h1></html>");
    return;
  }

  var url = request.url.toLowerCase();
  var service = url.substr(0, 6);
  url = url.length == 6 ? '/' : url.substr(6);

  // Handle '/lists' first
  if (service == "/lists")
  {
    response.writeHead(200, {"Content-Type" : "text/xml"});

    // Get the actual path
    var actualPath = pathNodeJS.join(path, url);
    actualPath = decodeURI(actualPath); // decodeURI decodes percent-encoding

    var xml = "<file_list>\n";

    // *Synchronously* get the list of files; otherwise there is no guarantee that we have all items before the for-loop before
    var items = fs.readdirSync(actualPath);

    for(var i = 0; i < items.length; i++)
    {
      var file = pathNodeJS.join(actualPath, items[i]);
      console.log("Stat-ing file: " + file);
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

      xml += ("  <" + fileOrDir + " name='" + file + "'>\n");
      // TODO: build the xml from the stats of this file
    }
  }
  else if (service == '/files')
  {
    var allAtOnce = false;
    if (allAtOnce)
    {
      var buf = fs.readFileSync(actualPath); // TODO: get the actual path

      // Write back
      response = writeHead(200, {"Content-Type" : "" /* TODO: Get the content type */});
      response.end(buf);
    }
    else {
      var readStream = fs.createReadStream(actualPath);

      // Difference between readStreams in Node and streams in .NET:
      // readStreams will call a provided callback when it has some data ... it STREAMS for us
      // .NET requires us to loop through the data for us

      response.writeHead(200, ...);
      readS.on('data', function(chunk)
      {
        response.write(chunk);
      }).on('end', function());

      reponse.end();
    }
  }
}
