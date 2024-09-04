import { AxesHelper, Box3, Group, MathUtils, Vector3 } from "three";
import Object3D from "../classes/Object3D";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gui from "../classes/Gui";

// YAMAHA 300 HP V6 4.2-liter F300
// https://yamahaoutboards.com/outboards/350-150-hp/v6-4-2l#specs-compare
export class BoatEngine {
  #propeller;
  #properllerDirection;
  #engine;
  #component;

  maxRPM;

  propellerRadius;
  pitch;
  rpm;
  engineDirection;

  fullEngine;

  #lastFrame;
  #deltaTime;

  #turn;

  #buttons;

  constructor(
    properllerDirection = -1,
    maxRPM = 5500,
    propellerRadius = 0.5,
    pitch = 0.4
  ) {
    this.#properllerDirection = properllerDirection;

    this.propellerRadius = propellerRadius;
    this.pitch = pitch;

    this.maxRPM = maxRPM;
    this.rpm = 0;
    this.engineDirection = 0;

    this.#lastFrame = 0;

    this.#turn = false;


    gui.add(this, "rpm");
    gui.add(this, "propellerRadius");
    gui.add(this, "pitch");

    this.#component = new Group();

    this.fullEngine = new Object3D();
  }

  update() {
    const time = Date.now();
    this.#deltaTime = time - this.#lastFrame;
    this.#lastFrame = time;

    this.#engineOff();

    if (this.#propeller && this.#engine) {
      this.#propeller.rotateZ(
        MathUtils.degToRad(this.rpm * this.#properllerDirection)
      );
      this.#component.rotation.set(
        0,
        MathUtils.degToRad(this.engineDirection),
        0
      );
    }
  }

  async loadModel() {
    const gltf = new GLTFLoader();
    let boatengine = await gltf.loadAsync("/Models/boatengine.glb");

    boatengine =
      boatengine.scene.children[0].children[0].children[0].children[0];
    this.#engine = boatengine;

    let propeller = await gltf.loadAsync("/Models/propeller2.glb");

    propeller = propeller.scene.children[0].children[0];
    propeller.position.set(0, -0.475, -0.39);

    propeller.rotateY(Math.PI);
    this.#propeller = propeller;

    this.#component.add(this.#engine);
    this.#component.add(this.#propeller);
    this.#component.position.set(-0.01, 0.2, 0.25);
    this.#component.scale.set(1.4, 1.4, 1.4);

    this.fullEngine.setMesh(this.#component);

    this.fullEngine.createRigidBodyWithMass(255);

    var sphereAxis = new AxesHelper(10);
    this.#component.add(sphereAxis);
  }

  changeRPM(rpm) {
    if (this.rpm < this.maxRPM && rpm > 0) this.rpm += rpm;
    else if (-this.maxRPM / 2 < this.rpm && rpm < 0) this.rpm += rpm;
  }
  changeEngineDirection(dir) {
    if (this.engineDirection < 32 && dir > 0) this.engineDirection += dir;
    else if (-32 < this.engineDirection && dir < 0) this.engineDirection += dir;
  }
  isTurned() {
    return this.#turn;
  }
  toggleEngine() {
    this.#turn = !this.#turn;
  }
  #engineOff() {
    if (!this.#turn) {
      if (-5 <= this.rpm && this.rpm <= 5) this.rpm = 0;
      if (this.rpm > 0) this.rpm -= (100 * this.#deltaTime) / 1000;
      if (this.rpm < 0) this.rpm += (100 * this.#deltaTime) / 1000;
    }
  }
}
