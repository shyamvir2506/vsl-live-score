var express = require("express"),
app = express(),
server = require('http').createServer(app),
io = require("socket.io")(server,{path:"/socket-io"});
let port  = process.env.PORT || 3000;

server.listen(port, '0.0.0.0',function(){
    console.log(`Listening to port: ${port}`);
});

app.use(express.static(__dirname+"/public"));
app.get('/', function(httpReq, httpRes, next){
    httpRes.sendFile(__dirname+"/public/index.html");
})


///admin panel auth
var basicAuth = require('basic-auth');
function uniqueNumber(){
    var date = Date.now();
    if(date <= uniqueNumber.prev){
        date = ++uniqueNumber.prev;
    }else{
        uniqueNumber.prev = date;
    }
    return date;
}
uniqueNumber.prev = 0;
var authenticated_users = {};
var auth = function(req,res,next){
    var user = basicAuth(req);
    if(!user || user.name !== 'admin' || user.pass !== 'admin'){
        res.statusCode = 401;
        res.setHeader("WWW-Authenticate","Basic realm = Authorization Required");
        res.end("Access denied");
    }else{
        var id = uniqueNumber();
        authenticated_users[id] = id;
        res.cookie("authentication_id",id);
        next();

    }
}
app.get("/admin",auth, function(httpReq,httpRes,next){
    httpRes.sendFile(__dirname + "/public/admin.html");
})


////admin 
var cookieParser = require("socket.io-cookie");
var admin = io.of("/admin");
admin.use(cookieParser);
admin.use(function(socket, next){
    if(socket.request.headers.cookie.authentication_id in authenticated_users){
        next();
    }else{
        next(new Error("Authentication required"));
    }
})

admin.on("connection",function(socket){
    socket.on("message", function(message){
        io.send(message);
    })
})