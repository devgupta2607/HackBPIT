let video;
let poseNet;
let poses = [];
let l1=false;
let l2=false;
let l3=false;
let l4=false;
let one = false;
let cycle=0;
var prev=0;
var saved = false;
var speak = false;

function setup() {
  createCanvas(620, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}
var heat;
var can;
function modelReady() {
  select('#status').html('Model Loaded');
  var h = document.getElementById("heat");
  can = document.createElement("canvas");
  can.style.position = "absolute";
  can.style.left = "150px";
  can.style.top = "380px";
  can.style.width = "476px";
  can.style.height = "294px";
  can.style.opacity = "0.5" ;
  setTimeout(function(){
    h.appendChild(can);
  },200);

  heat = simpleheat(can);
  heat.radius(4,3);
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(124, 252, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }

  if(poses.length!=0){
    if(one==false){
        l1=true;
        one = true;
    }
    if(poses[0].pose.leftWrist.y<poses[0].pose.leftEye.y && poses[0].pose.rightWrist.y<poses[0].pose.rightEye.y && l1==true){
      l2=true;
      l3=false;
      l1=false;      
    }

    if(abs(poses[0].pose.leftWrist.x-poses[0].pose.leftHip.x)>50 && abs(poses[0].pose.rightWrist.x-poses[0].pose.rightHip.x)>50 && l2==true){
      l3=true;
      l2=false;
      l1=false;
    }
    if(abs(poses[0].pose.leftWrist.x-poses[0].pose.leftHip.x)<20 && abs(poses[0].pose.rightWrist.x-poses[0].pose.rightHip.x)<40 && l3==true){
      l1=true;
      l2=false;
      l3=false;
      cycle++;
      if(cycle==1){
        heat.gradient({1: 'blue', 0.45: 'lime', 0.64: 'red'});
        heat.add([135,65,5]);
        heat.add([159,65,5]);
        heat.add([157,60,5]);
        heat.add([135,60,5]);
        heat.draw(0.05);
      }
      if(cycle==2){
        heat.clear();
        heat.gradient({0.65: 'blue', 0.65: 'lime', 0.65: 'red'});
        heat.add([135,65,5]);
        heat.add([159,65,5]);
        heat.add([157,60,5]);
        heat.add([135,60,5]);
        heat.draw(0.05);
        if(speak==false){
          var msg = new SpeechSynthesisUtterance('Please bend your back a bit more ');
          msg.rate = 0.9;
          window.speechSynthesis.speak(msg);
          speak=true;
        }
      }

      if(cycle==5){
        can.style.top = "430px";
        heat.clear();
        heat.gradient({0.65: 'blue', 1: 'lime', 0.65: 'red'});
        heat.add([135,65,5]);
        heat.add([159,65,5]);
        heat.add([157,60,5]);
        heat.add([135,60,5]);
        heat.draw(0.05);
      }
      
    }

    if(cycle!=prev){
      console.log("cycle: " + cycle);
      // document.getElementById("sarthak").innerHTML=cycle;
      $("#sarthak").fadeOut("slow",()=>{
        $("#sarthak").html(cycle);
        $("#sarthak").fadeIn();
      });
    }
    if(cycle==5 && saved==false){
      console.log("over");
      var msg = new SpeechSynthesisUtterance('Well Done . Your burnt 6 calories');
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
      saved=true;
    //   $.ajax({
    //     type:"GET",
    //     url :"/save/sarthak",
    //     success : function(msg){
    //        console.log(msg);
    //        saved=true;
       
    //     }
    // });
    }
    prev=cycle;
    
  }
 
}

function xAxis(lx,ly){

  

}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(124, 252, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
