var socket = io("http://localhost:3000",{path:"/socket-io"});
var start = 1;
function totalScore(team_name){
    let obj = document.getElementById('team-'+team_name).getElementsByClassName('score');
    //console.log(obj);
    var tscore = 0;
    for(var i=0;i<obj.length;i++){
        //console.log(obj[i].innerText);
        tscore = tscore + parseInt(obj[i].innerText, 10);
    }
    document.getElementById(team_name+'-total-score').innerText = tscore;
}
socket.on("connect", function(){
    socket.on("message",function(messages){
        console.log(messages);
        
        if(messages.length >= 1){
            //for(msg in messages){
                messages.forEach(msg => {
                    if(document.getElementById(msg.team_name+'-'+msg.game_name+'-score')){
                        document.getElementById(msg.team_name+'-'+msg.game_name+'-score').innerText = msg.score;
                    }
                });
                
                
                    //var tscore = parseInt(document.getElementById(msg.team_name+'-total-score').innerText, 10);
                    //document.getElementById(msg.team_name+'-total-score').innerText = parseInt(Number(msg.score) + tscore,10);
            //}
            
        }
        totalScore('av');
            totalScore('ni');
            totalScore('jl');
            totalScore('sa');
        
    })
    
    socket.send({start:start++});
    
})