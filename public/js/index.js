var socket = io("http://localhost:3000",{path:"/socket-io"});
socket.on("connect", function(){
    socket.on("message",function(msg){
        document.getElementById('messages').innerHTML = "<li><div><h4>"+
        msg.team1_name+"("+msg.team1_score+"):"+
        msg.team2_name+"("+msg.team2_score+")"+
        "</h4><span>"+msg.desc+"</span></div></li>" + document.getElementById("messages").innerHTML;
    })
})