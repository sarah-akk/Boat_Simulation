import Object3D from "./Object3D";
import Fluid from "./Fluid";
import PhysicsWorker from "./PhysucsWorker";
import { MathUtils } from "three";

const DT = 1.0 / 60.0;
const AIRDENSITY = 1.225;
const WATERDENSITY = 1025;
const Cd = 1.05;
const Ct = 0.4392;

export default class PhysicsEngine {
  #GRAVITY;

  #objects3D;
  #fluid;
  pause;

  constructor(gravity) {
    this.#GRAVITY = gravity;

    this.#objects3D = [];

    this.pause = false;

    this.once = true;
  }
  addBoat(object) {
    this.addObjects3D(object.boat);
    this.boatData = object;
    this.boat = this.#objects3D.length - 1;
  }
  addObjects3D(object) {
    if (!(object instanceof Object3D))
      throw new Error("Object is not instance of Object3D");
    this.#objects3D.push(object);
  }
  addFluid(object) {
    if (!(object.fluid instanceof Fluid))
      throw new Error("Object is not instance of Fluid");
    this.#fluid = object;
  }

  /**
   *
   * @param {Number} gravityForce change the default value of gravity -9.8
   */
  changeGravity(number) {
    if (!isNaN(number)) this.#GRAVITY = number;
    else throw new Error("The given parameter is not a number.");
  }

  run() {
    setInterval(() => {
      this.#objects3D.forEach((obj, index) => {
        if (obj.rigidBody) {
          let rigidBody = obj.rigidBody;
          let newVelocity = rigidBody.velocity;
          let newPosition = rigidBody.position;
          let nDT = 128;
          let mass = rigidBody.mass;
          let angvelocity = 0;
          let turnDegree = 0;

          if (rigidBody.linkObjects) {
            rigidBody.objects.forEach((element) => {
              mass += element.mass;
            });
          }

          for (let k = 0; k < nDT; k++) {
            let gravityForce = GravityForce(this.#GRAVITY, mass);

            let buoyancyForce = BuoyancyForce(
              this.#fluid.fluid,
              rigidBody,
              this.#GRAVITY
            );
            let deltaPosition = { x: 0, y: 0, z: 0 };
            let acceleration = { y: 0, plane: 0 };
            let thrustForce = 0;

            let momentOfInertia =
              (1 / 12) * rigidBody.mass * rigidBody.depth ** 2;

            if (this.boat === index) {
              thrustForce = ThrustForce(
                this.boatData.leftEngine.rpm,
                this.boatData.leftEngine.propellerRadius,
                this.boatData.leftEngine.pitch,
                this.boatData.rightEngine.rpm,
                this.boatData.rightEngine.propellerRadius,
                this.boatData.rightEngine.pitch
              );

              acceleration.plane = thrustForce / mass;

              let newPlaneVeloctiy = acceleration.plane * (DT / nDT);

              let torque =
                acceleration.plane *
                mass *
                (rigidBody.depth / 2) *
                Math.sin(
                  MathUtils.degToRad(this.boatData.leftEngine.engineDirection)
                );

              let angAcceleration = torque / momentOfInertia;

              angvelocity += angAcceleration * (DT / nDT);

              turnDegree += angvelocity * (DT / nDT);

              rigidBody.changeRotationY(-turnDegree);

              let deg = MathUtils.radToDeg(this.boatData.boat.getRotationY());

              // if (k == 1) {
              //   console.log(
              //     ((deg +
              //       -this.boatData.rightEngine.engineDirection +
              //       0.00005) /
              //       (-this.boatData.rightEngine.engineDirection + 0.00005)) *
              //       -this.boatData.rightEngine.engineDirection
              //   );
              //   console.log(-this.boatData.rightEngine.engineDirection);
              // }

              deltaPosition.z +=
                rigidBody.velocity.z * (DT / nDT) +
                0.5 *
                acceleration.plane *
                Math.cos(
                  this.boatData.boat.getRotationY() +
                  MathUtils.degToRad(
                    -this.boatData.rightEngine.engineDirection
                  )
                ) *
                (DT / nDT) ** 2;

              deltaPosition.x +=
                rigidBody.velocity.x * (DT / nDT) +
                0.5 *
                acceleration.plane *
                Math.sin(
                  this.boatData.boat.getRotationY() +
                  MathUtils.degToRad(
                    -this.boatData.rightEngine.engineDirection
                  )
                ) *
                (DT / nDT) ** 2;

              newVelocity.z +=
                newPlaneVeloctiy *
                Math.cos(
                  this.boatData.boat.getRotationY() +
                  MathUtils.degToRad(
                    -this.boatData.rightEngine.engineDirection
                  )
                );

              newVelocity.x +=
                newPlaneVeloctiy *
                Math.sin(
                  this.boatData.boat.getRotationY() +
                  MathUtils.degToRad(
                    -this.boatData.rightEngine.engineDirection
                  )
                );
            }

            let airResistance = AirResistance(
              newVelocity,
              rigidBody.width,
              rigidBody.height,
              rigidBody.depth,
              buoyancyForce.widthUnderWater,
              buoyancyForce.heightUnderWater,
              buoyancyForce.depthUnderWater
            );

            let waterResistance = WaterResistance(
              newVelocity,
              rigidBody.width,
              rigidBody.height,
              rigidBody.depth,
              buoyancyForce.widthUnderWater,
              buoyancyForce.heightUnderWater,
              buoyancyForce.depthUnderWater
            );

            acceleration.y =
              (gravityForce +
                buoyancyForce.force +
                airResistance.y +
                waterResistance.y) /
              mass;

            deltaPosition.y =
              rigidBody.velocity.y * (DT / nDT) +
              0.5 * acceleration.y * (DT / nDT) ** 2;

            newVelocity.y += acceleration.y * (DT / nDT);

            if (
              !(
                rigidBody.position.y - 0.1 <= rigidBody.height / 2 &&
                deltaPosition.y < 0
              )
            )
              newPosition.y += deltaPosition.y;

            newPosition.z += deltaPosition.z;
            newPosition.x += deltaPosition.x;

            rigidBody.updateVelocity(newVelocity);
            rigidBody.updatePosition(newPosition);
            obj.update();
          }
        }
      });
    }, DT * 1000);
  }
}

function GravityForce(gravity, mass) {
  let force = gravity * mass;
  return force;
}

function BuoyancyForce(fluid, object, gravity) {
  if (!fluid)
    return {
      force: 0,
      widthUnderWater: 0,
      heightUnderWater: 0,
      depthUnderWater: 0,
      count: 1,
    };

  let force = 0;
  let volume = 0;
  let position = object.position;
  let objWidth = object.width;
  let objHeight = object.height;
  let objDepth = object.depth;

  let waterHeight = fluid.depth;
  let bodyHeight;
  if (position.y > waterHeight) {
    let nonSubmergedPart = position.y - waterHeight;
    bodyHeight = objHeight / 2 - nonSubmergedPart;
  } else {
    let submergedPart = waterHeight - position.y;
    bodyHeight = Math.min(objHeight, submergedPart + objHeight / 2);
  }

  let widthUnderWater = objWidth;
  let heightUnderWater = bodyHeight;
  let depthUnderWater = objDepth;

  volume = heightUnderWater * widthUnderWater * depthUnderWater;

  if (object.linkObjects) {
    object.objects.forEach((element) => {
      let linkedBodyHeight;
      if (position.y > waterHeight) {
        let nonSubmergedPart = position.y - waterHeight;
        linkedBodyHeight = objHeight / 2 - nonSubmergedPart;
      } else {
        let submergedPart = waterHeight - position.y;
        linkedBodyHeight = Math.min(objHeight, submergedPart + objHeight / 2);
      }
      volume += linkedBodyHeight * element.width * element.depth;
    });
  }

  force = volume * WATERDENSITY * -1 * gravity;

  return {
    force,
    widthUnderWater,
    heightUnderWater,
    depthUnderWater,
  };
}

function ThrustForce(lRMP, lRadius, lPitch, rRMP, rRadius, rPitch) {
  let force = 0;
  force =
    (Math.sign(lRMP) * (Ct * lRMP ** 2 * lRadius ** 2 * lPitch)) /
    Math.sqrt(WATERDENSITY) +
    (Math.sign(lRMP) * (Ct * rRMP ** 2 * rRadius ** 2 * rPitch)) /
    Math.sqrt(WATERDENSITY);

  return force;
}

function AirResistance(
  objectVelocity,
  width,
  height,
  depth,
  underWaterwidth,
  underWaterheight,
  underWaterdepth
) {
  let force = { x: 0, y: 0, z: 0 };
  const constants = 0.5 * AIRDENSITY * Cd;

  let factorX = objectVelocity.x < 0 ? 1 : -1;
  let factorY = objectVelocity.y < 0 ? 1 : -1;
  let factorZ = objectVelocity.z < 0 ? 1 : -1;

  // //TODO
  // force.x = 0;

  if (factorY == -1)
    force.y =
      factorY *
      constants *
      (objectVelocity.y * objectVelocity.y) *
      (height == underWaterheight ? 0 : width * depth);

  if (factorY == 1)
    force.y =
      factorY *
      constants *
      (objectVelocity.y * objectVelocity.y) *
      ((width - underWaterwidth) * (depth - underWaterdepth));

  // //TODO
  // force.z =
  //   factorZ *
  //   constants *
  //   (objectVelocity.z * objectVelocity.z) *
  //   (width * (height - underWaterheight));

  return force;
}

function WaterResistance(
  objectVelocity,
  width,
  height,
  depth,
  underWaterwidth,
  underWaterheight,
  underWaterdepth
) {
  //TODO the reverse of the velocity
  let force = { x: 0, y: 0, z: 0 };
  const constants = 0.5 * WATERDENSITY * Cd;

  let factorX = objectVelocity.x < 0 ? 1 : -1;
  let factorY = objectVelocity.y < 0 ? 1 : -1;
  let factorZ = objectVelocity.z < 0 ? 1 : -1;

  // force.x = 0;

  if (factorY == -1)
    force.y =
      factorY *
      constants *
      (objectVelocity.y * objectVelocity.y) *
      (height == underWaterheight ? width * depth : 0);

  if (factorY == 1)
    force.y =
      factorY *
      constants *
      (objectVelocity.y * objectVelocity.y) *
      underWaterwidth *
      underWaterdepth;

  // force.z =
  //   factorZ *
  //   constants *
  //   (objectVelocity.z * objectVelocity.z) *
  //   underWaterwidth *
  //   underWaterheight;

  return force;
}
function WindResistanceForce(velocity, width, height, depth, underWaterheight) {
  const w = windVelocity();
  const v_rel = velocity.sub(w);
  const vm =
    Math.sqrt(
      velocity.x * velocity.x +
      velocity.y * velocity.y +
      velocity.z * velocity.z
    ) *
    Math.sqrt(
      velocity.x * velocity.x +
      velocity.y * velocity.y +
      velocity.z * velocity.z
    );
  const ax = depth * (height - underWaterheight); // x
  const az = width * (height - underWaterheight); // z
  const a = new Vector3(ax, 0, az);
  const f = 0.5 * AIRDENSITY * a.x * a.z * vm;
  const f_dir = v_rel.mult(f);
  return f_dir;
}
function windVelocity() {
  const ax = MathUtils.degToRad(Ax);
  const ay = MathUtils.degToRad(Ay);
  const x = AirVelocity * Math.cos(ax) * Math.cos(ay);
  const y = AirVelocity * Math.sin(ax) * Math.cos(ay);
  const z = AirVelocity * Math.sin(ay);
  return new Vector3(x, y, z);
}
