import { AxesHelper, Group, Vector3 } from "three";
import { BoatEngine } from "./BoatEngine";
import Object3D from "../classes/Object3D";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gui from "../classes/Gui";

export class Boat {
  rightEngine;
  leftEngine;

  boat;

  #steeringWheel;
  #lever;

  #componet;

  #buttons;

  #lastFrame;
  #deltaTime;

  constructor() {
    this.rightEngine = new BoatEngine();
    this.leftEngine = new BoatEngine(1);

    this.#componet = new Group();
    this.boat = new Object3D();

    this.#lastFrame = 0;

    this.#buttons = [];

    document.addEventListener("keyup", this.#releaseKey.bind(this));
    document.addEventListener("keydown", this.#pressKey.bind(this));
  }

  update() {
    const time = Date.now();
    this.#deltaTime = time - this.#lastFrame;
    this.#lastFrame = time;

    if (this.#steeringWheel && this.#lever) {
      this.#steeringWheel.children[0].rotation.set(
        0,
        -this.leftEngine.engineDirection - 4.725,
        0
      );
      this.#lever.rotation.set(0, 0, (this.leftEngine.rpm * 0.001) / 5);
    }

    this.rightEngine.update();
    this.leftEngine.update();
  }

  rotate(degree) {
    this.boat.changeRotationY(degree);
  }
  async loadModels(AddToScene) {
    await this.rightEngine.loadModel();
    await this.leftEngine.loadModel();

    const gltf = new GLTFLoader();
    gltf.load("/Models/newyacht2.glb", (model) => {
      model = model.scene;
      gltf.load("/Models/steeringWheel.glb", (steeringWheel) => {
        steeringWheel = steeringWheel.scene;
        steeringWheel.scale.set(0.65, 0.65, 0.65);
        steeringWheel.rotateY(-4.725);

        this.#steeringWheel = new Group();
        this.#steeringWheel.add(steeringWheel);
        this.#steeringWheel.position.set(0.32, 0.79, -0.01);
        this.#steeringWheel.rotateZ(-0.75);

        gltf.load("/Models/lever.glb", (lever) => {
          lever = lever.scene;
          lever.scale.set(0.105, 0.105, 0.105);
          lever.position.set(0.307, 0.8025, -0.08075);
          this.#lever = lever;
          let component = new Group();
          component.add(this.#steeringWheel);
          component.add(this.#lever);
          component.add(model);
          component.scale.set(3, 3, 3);
          component.rotateY(Math.PI / 2);

          this.#componet.add(component);
          this.#componet.position.set(0, -1.5, 0);

          this.leftEngine.fullEngine.changePosition(
            new Vector3(0.55, 0.5, -5.55)
          );
          this.rightEngine.fullEngine.changePosition(
            new Vector3(-0.55, 0.5, -5.55)
          );

          this.boat.setMesh(this.#componet);

          this.boat.createRigidBodyWithMass(5500);
          gui.add(this.boat.rigidBody, 'mass');

          this.#componet.add(this.leftEngine.fullEngine.getMesh());
          this.#componet.add(this.rightEngine.fullEngine.getMesh());

          var sphereAxis = new AxesHelper(12.5);
          this.#componet.add(sphereAxis);

          this.boat.rigidBody.link(this.leftEngine.fullEngine.rigidBody);
          this.boat.rigidBody.link(this.rightEngine.fullEngine.rigidBody);

          AddToScene(this);
        });
      });
    });
  }

  #releaseKey(e) {
    this.#buttons[e.code] = false;
    if (e.code == "KeyF") {
      this.rightEngine.toggleEngine();
      this.leftEngine.toggleEngine();
    }
  }
  #pressKey(e) {
    if (this.leftEngine.isTurned() && this.rightEngine.isTurned()) {
      this.#buttons[e.code] = true;

      if (this.#buttons["KeyW"]) {
        this.leftEngine.changeRPM((250 * this.#deltaTime) / 1000);
        this.rightEngine.changeRPM((250 * this.#deltaTime) / 1000);
      } else if (this.#buttons["KeyS"]) {
        this.leftEngine.changeRPM((-250 * this.#deltaTime) / 1000);
        this.rightEngine.changeRPM((-250 * this.#deltaTime) / 1000);
      }

      if (this.#buttons["KeyD"]) {
        this.leftEngine.changeEngineDirection((10 * this.#deltaTime) / 1000);
        this.rightEngine.changeEngineDirection((10 * this.#deltaTime) / 1000);
      } else if (this.#buttons["KeyA"]) {
        this.leftEngine.changeEngineDirection((-10 * this.#deltaTime) / 1000);
        this.rightEngine.changeEngineDirection((-10 * this.#deltaTime) / 1000);
      }
    }
  }


}
