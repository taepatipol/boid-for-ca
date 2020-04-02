// Flocking
// Daniel Shiffman
// https://thecodingtrain.com

// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM
// https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

const flock = [];
const obs = [];

let alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(1280, 720);
  alignSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);
  for (let i = 0; i < 200; i++) {
    flock.push(new Boid(i));
  }

  for(let x = 150; x <= width-150; x++) {
    obs.push(new Obstracle(x,150));
  }
  for(let x = 150; x <= width-150; x++) {
    obs.push(new Obstracle(x,height-150));
  }
  for(let y = 150; y <= height-150; y++) {
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
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  for (let ob of obs) {
    ob.show();
  }
}