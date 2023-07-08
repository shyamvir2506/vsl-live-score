var socket = io("http://localhost:3000/admin", {path: "/socket-io"});
document.getElementById("submit-button").addEventListener("click", function(){
    var team1_name = "Team A";//document.getElementById("team1-name").value; 
    var team2_name = "Team B";//document.getElementById("team2-name").value; 
    var team1_score = document.getElementById("team1-score").value; 
    var team2_score = document.getElementById("team2-score").value; 
    var desc = document.getElementById("desc").value;

    if(team1_score == "" || team2_score == "" || team1_name == "" || team2_name == "")
    {
        alert("Please enter all details");
    }else{
        socket.send({
            team1_name: team1_name, 
            team2_name: team2_name, 
            team1_score: team1_score, 
            team2_score: team2_score, 
            desc: desc
        });
    }
}, false)