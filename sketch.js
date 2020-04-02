// Flocking
// Daniel Shiffman
// https://thecodingtrain.com

// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM
// https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

const flock = [];
const obs = [];
const OPTION = 2;
const NUM = 200;
let time = 0;
let everyoneOut = false;

let alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(1280, 720);
  alignSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);
  for (let i = 0; i < NUM; i++) {
    flock.push(new Boid(i));
  }

  for(let x = 150; x <= width-150; x++) {
    if (OPTION == 1 && x >= width/2-200 && x <= width/2+200) continue;
    obs.push(new Obstracle(x,150));
  }
  for(let x = 150; x <= width-150; x++) {
    obs.push(new Obstracle(x,height-150));
  }
  for(let y = 150; y <= height-150; y++) {
    if (OPTION == 2 && y >= height/2-200 && y <= height/2+200) continue;
    obs.push(new Obstracle(150,y));
  }
  for(let y = 150; y <= height-150; y++) {
    obs.push(new Obstracle(width-150,y));
  }
}

function draw() {
  background(51);
  for (let boid of flock) {
    boid.edges();
    let doorPos;

    if (OPTION == 1) {
      doorPos = createVector(width/2,150);
    } else if (OPTION == 2) {
      doorPos = createVector(150,height/2);
    }

    boid.flock(flock,obs,doorPos);
    boid.update();
    boid.show();
  }

  for (let ob of obs) {
    ob.show();
  }

  let outNow = 0;
  for (let boid of flock) {
    if (boid.outOfRoom()) outNow++;
  }
  if (outNow <= NUM*0.8) time++;

  console.log(time);
}