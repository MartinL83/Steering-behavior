import Victor from "victor";

Victor.prototype.magSq = function() {
  const x = this.x;
  const y = this.y;

  return x * x + y * y;
};

Victor.prototype.limitByMax = function(max) {
  const squared = this.magSq();

  if (squared > max * max) {
    const divideBy = Math.sqrt(squared);
    this.divide(new Victor(divideBy, divideBy)).multiply(new Victor(max, max));
  }

  return this;
};
