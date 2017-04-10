var http = require("http");
var fs = require("fs");

fs.readFile('../Assign5/Sudoku_Solver.html', function(err, html)
{
  http.createServer(function(request, response)
  {
    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write(html);
    response.end();
  }).listen(8080);
});
