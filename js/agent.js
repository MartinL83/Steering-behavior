import * as PIXI from "pixi.js";
import Victor from "victor";

const magSq = function(vector) {
  return vector.x * vector.x + vector.y * vector.y;
};

const limit = function(v, max) {
  const vector = v.clone();

  const squared = magSq(vector);

  if (squared > max * max) {
    const divideBy = Math.sqrt(squared);
    vector
      .divide(new Victor(divideBy, divideBy))
      .multiply(new Victor(max, max));
  }
  return vector;
};

// Render the agent on to the canvas
const renderAgent = state => ({
  render: () => {
    const pivot = new PIXI.Point(state.radius / 4, state.radius / 4);

    state.polygon.beginFill(state.background);
    state.polygon.lineStyle(2, 0x00ff00, 1);

    state.polygon.moveTo(0, 0);
    state.polygon.lineTo(state.radius / 2, 0);
    state.polygon.lineTo(state.radius / 4, state.radius / 4);
    state.polygon.lineTo(0, 0);

    state.polygon.pivot = pivot;
    state.polygon.endFill();
  }
});

const steeringBehaviour = state => ({
  update: function() {
    if (state.arrived === true) {
      return;
    }

    state.velocity.add(state.acceleration);

    state.position.add(limit(state.velocity, state.maxSpeed));
    state.polygon.rotation = state.rotation;

    state.acceleration = new Victor(0, 0);

    state.polygon.position.x = state.position.x;
    state.polygon.position.y = state.position.y;

    const heading =
      Math.atan2(state.velocity.y, state.velocity.x) + Math.PI / 2;
    state.polygon.rotation = heading;
  },

  applyForce: function(force) {
    state.acceleration.add(force);
  },

  steer: function(vector) {
    const target = vector.clone();
    const current = state.position.clone();

    const desired = target.clone().subtract(current);

    // Check if we have arrived.
    if (Math.abs(desired.x) <= 5 && Math.abs(desired.y) <= 5) {
      state.arrived = true;
      return;
    }

    state.arrived = false;

    desired.normalize().multiply(new Victor(state.maxSpeed, state.maxSpeed));

    desired.subtract(state.velocity);

    const steer = limit(desired, state.maxForce);

    this.applyForce(steer);
  }
});

export const makeAgent = function() {
  const randomFloat = Math.random(0, 10);

  let state = {
    polygon: new PIXI.Graphics(),

    background: 0xff700b,

    acceleration: new Victor(0, 0),
    velocity: new Victor(0, randomFloat),
    position: new Victor(0, 0),
    rotation: 0,
    radius: 100,

    arrived: false,

    maxSpeed: 2,
    maxForce: 0.4
  };

  return Object.assign({}, state, renderAgent(state), steeringBehaviour(state));
};
