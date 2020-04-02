// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM
// https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

class Boid {
  constructor(id) {
    this.position = createVector(random(width-360)+180, random(height-360)+180);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 1;
    this.maxSpeed = 4;
    this.id = id;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = width;
    } else if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.position.y = height;
    } else if (this.position.y < 0) {
      this.position.y = 0;
    }
  }

  align(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other.id != this.id && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other.id != this.id && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (this.position.x <= 10) {
      let diff = 10 - this.position.x;
      let keepOut = createVector(15-diff,0);
      steering.add(keepOut);
    }
    if (this.position.x >= width-10) {
      let diff = width - this.position.x
      let keepOut = createVector(-15+diff,0);
      steering.add(keepOut);
    }
    if (this.position.y <= 10) {
      let diff = 10 - this.position.y;
      let keepOut = createVector(0,15-diff);
      steering.add(keepOut);
    }
    if (this.position.y >= height-10) {
      let diff = height - this.position.y;
      let keepOut = createVector(0,-15+diff);
      steering.add(keepOut);
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce+0.5);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 150;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other.id != this.id && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  avoid(obs) {
    let perceptionRadius = 20;
    let steering = createVector();
    let total = 0;
    for (let ob of obs) {
      let d = dist(
        this.position.x,
        this.position.y,
        ob.position.x,
        ob.position.y
      );
      if (d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, ob.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce+2);
    }
    return steering;
  }

  follow(boids) {
    if (this.id < 4) return;
    let perceptionRadius = 200;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      if (other.id >= 4) continue;
      if (total >= 1) continue;
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      //steering.div(total);
      steering.mult(20);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce*20);
    }
    return steering;
  }

  flock(boids,obs,doorPosList) {
    if (this.id < 4) {
      if (this.outOfRoom()) {
        //do nothing
      } else {
        let doorDirect;
        if (doorPosList.length == 1) {
          doorDirect = p5.Vector.sub(this.position, doorPosList[0]);
        } else if (doorPosList.length == 2) {
          if (this.id < 2) doorDirect = p5.Vector.sub(this.position, doorPosList[0]);
          else doorDirect = p5.Vector.sub(this.position, doorPosList[1]);
        } else if (doorPosList.length == 4) {
          if (this.id == 0) doorDirect = p5.Vector.sub(this.position, doorPosList[0]);
          else if (this.id == 1) doorDirect = p5.Vector.sub(this.position, doorPosList[1]);
          else if (this.id == 2) doorDirect = p5.Vector.sub(this.position, doorPosList[2]);
          else if (this.id == 3) doorDirect = p5.Vector.sub(this.position, doorPosList[3]);
        }
        this.acceleration.sub(doorDirect);
      }
    } else if (this.outOfRoom()) {
      //do nothing
    } else {
      let alignment = this.align(boids);
      let cohesion = this.cohesion(boids);
      let separation = this.separation(boids);
      let obsAvoid = this.avoid(obs);
      let followLead = this.follow(boids);

      alignment.mult(alignSlider.value());
      cohesion.mult(cohesionSlider.value());
      separation.mult(separationSlider.value());

      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
      this.acceleration.add(obsAvoid);
      this.acceleration.add(followLead);
    }
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(8);
    if (this.id < 4) { stroke('red'); }
    else stroke(255);
    point(this.position.x, this.position.y);
  }

  outOfRoom() {
    if (this.position.x < width-150 && this.position.x > 150) {
      if (this.position.y < height-150 && this.position.y > 150) {
        return false;
      }
    }
    return true;
  }
}

class Obstracle {
  constructor(x,y) {
    this.position = createVector(x,y);
  }

  show() {
    strokeWeight(8);
    stroke('green');
    point(this.position.x, this.position.y)
  }
}