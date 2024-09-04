export default class Fluid {
  constructor(columnsI, columnsJ, depth, spacing) {
    this.columnsI = columnsI;
    this.columnsJ = columnsJ;
    this.allColumns = this.columnsI * this.columnsJ;

    this.centerOfX = Math.floor(this.columnsI / 2.0);
    this.centerOfZ = Math.floor(this.columnsJ / 2.0);
    this.spacing = spacing;

    this.waveSpeed = 2.0;
    this.alpha = 0.25;
    this.posDamping = 1.0;
    this.velDamping = 0.3;

    this.columnsHeight = [];
    this.columnsVelocity = [];
    this.bodycolumnsHeight = [];
    this.preBodycolumnsHeight = [];
    this.depth = depth;

    for (let i = 0; i < this.columnsI; i++) {
      this.columnsHeight[i] = new Float32Array(this.columnsJ);
      this.columnsVelocity[i] = new Float32Array(this.columnsJ);

      this.bodycolumnsHeight[i] = new Float32Array(this.columnsJ);
      this.preBodycolumnsHeight[i] = new Float32Array(this.columnsJ);
    }

    for (let i = 0; i < this.columnsI; i++) {
      for (let j = 0; j < this.columnsJ; j++) {
        this.columnsHeight[i][j] = depth;
        this.columnsVelocity[i][j] = 0.0;
      }
    }
  }
}
