var express = require("express"),
app = express();
require('./public/team-score');
var data="";
server = require('http').createServer(app),
io = require("socket.io")(server,{path:"/socket-io"});
let port  = process.env.PORT || 3000;

process.env.MONGO_USER = "shyamvir2506";
process.env.MONGO_PASS = "sWppilN8hBmljlKu";

const mongoose = require('mongoose');
const teamScoreModel = mongoose.model('TeamScore');
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8fqlaxs.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", async function() {
    console.log("Connection To MongoDB Atlas Successful!");
    //data = await teamDataCheck('2023','','');
        
       // console.log("data-----"+data);
       data = await teamScoreModel.find({year:'2023'}).exec();
       console.log(data);
       //io.send(result);
       
});



server.listen(port, '0.0.0.0',function(){
    console.log(`Listening to port: ${port}`);
    
});

app.use(express.static(__dirname+"/public"));
app.get('/',  function(httpReq, httpRes, next){

    
    httpRes.sendFile(__dirname+"/public/index.html");

    
})
//data yearly
 async function teamDataCheck(year, team_name, game_name, score){
    //console.log(teamScoreModel);
    var result = await teamScoreModel.find({year:year, team_name:team_name, game_name:game_name}).exec();
    console.log(result);
    //if(err) throw err;
    
        
        var  teamScoreData = result.length;
        //console.log(teamScoreData);
            if (teamScoreData > 0) {
                //console.log('ifffff'+result);
                //return result;
                var query = {year:year, team_name:team_name, game_name:game_name};
                const res = await teamScoreModel.findOneAndUpdate(query, {year:year, team_name:team_name, game_name:game_name, score:score},{ upsert: true, new: true }).exec();
                return res.acknowledged;
            } else {
                const newTeamScoreDataInstance = new teamScoreModel({
                    year: year,
                    team_name: team_name,
                    game_name:game_name,
                    score:score,
                })
            
                const newTeamScoreData =  await newTeamScoreDataInstance.save();
                console.log("result.data;---"+newTeamScoreData);

                return newTeamScoreData;
                
            }

}
app.get('/team-data/:year', (req, res)=>{
    
    res.json(teamDataCheck(`${req.params.year}`));
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
    socket.on("message", async function(message){
        console.log(message);
        
        var msg = await teamDataCheck(message.year, message.team_name, message.game_name, message.score);
        
        //io.send(message);
        //console.log("msg"+msg);
        data = await teamScoreModel.find({year:'2023'}).exec();
        io.send(data);
    })


    
})
var user = io.of('/');
user.on('connection', function(socket){
    socket.on('message', async function(msg){
        //const data = teamDataCheck(msg.year);
        //console.log(data);
        console.log(msg.start);
        if(msg.start <= 1){
            console.log('in');
            data = await teamScoreModel.find({year:'2023'}).exec();
            io.send(data);
        }
       
    })
    //io.send();
})