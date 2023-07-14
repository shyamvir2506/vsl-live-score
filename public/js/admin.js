var socket = io("http://localhost:3000/admin", {path: "/socket-io"});
document.getElementById("submit-button").addEventListener("click", function(){
    var team_name = document.getElementById("teams").value; 
    var game_name = document.getElementById("games").value; 
    var score = document.getElementById("score").value;

    if(team_name == "" || game_name == "" || score < 0)
    {
        alert("Please enter all details");
    }else{
        socket.send({
            year:'2023',
            team_name: team_name, 
            game_name: game_name, 
            score: score, 
            
        });
        
        alert('score sent')
    }
}, false)