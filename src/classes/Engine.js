import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Object3D from "./Object3D";
import PhysicsEngine from "./PhysicsEngine";
import Fluid from "./Fluid";

import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


import rock5 from "../../static/Models/rock5.glb";
import shortPlant from "../../static/Models/shortPlant.glb";
import coral from "../../static/Models/coral.glb";
import tree from "../../static/Models/palm.glb";

import plant from "../../static/Models/plant.glb";
import rock8 from "../../static/Models/rock8.glb";

export default class Engine {
  #ROOT;
  #WIDTH;
  #HEIGHT;

  #scene;
  #camera;
  #control;
  #renderer;

  #physicsEngine;
  #loader;

  #skyBoxes;
  #fluids;

  #audioListener;
  #sounds;
  #gui;

  #models = [];
  #modelPool = [];
  #boatPosition = new THREE.Vector3();
  #boat;

  constructor() {
    this.#WIDTH = window.innerWidth;
    this.#HEIGHT = window.innerHeight;

    this.#skyBoxes = [];
    this.#fluids = [];
    this.#loader = new GLTFLoader();

    this.#init();

    window.addEventListener("resize", this.#resize.bind(this));
    this.#generateModelsPeriodically();
  }

  update(customScript = () => { }) {
    window.requestAnimationFrame(() => {
      customScript();

      // Update physics
      // this.#physicsEngine.update();

      // Update boat position
      if (this.#boat) {
        this.#boatPosition.copy(this.#boat.getPosition());
      }

      // Update models
      this.#updateModels();

      // Render fluids if any
      if (this.#fluids.length) {
        this.#fluids.forEach((fluid) => {
          fluid.toggleVisibility();
          this.#renderer.setRenderTarget(fluid.gRenderTarget);
          this.#renderer.clear();
          this.#renderer.render(this.#scene, this.#camera);

          fluid.toggleVisibility();
          this.#renderer.setRenderTarget(null);
          this.#renderer.render(this.#scene, this.#camera);
        });
      } else {
        this.#renderer.render(this.#scene, this.#camera);
      }

      this.#control.update();
      this.update(customScript);
    });
  }

  addBoat(object) {
    this.#scene.add(object.boat.getMesh());
    this.#physicsEngine.addBoat(object);
    if (object.boat.enableBoxShape) this.#scene.add(object.boat.getBoxShape());
    this.#boat = object.boat;  // Set the boat reference
    this.#boatPosition.copy(object.boat.getPosition());  // Initial boat position
    console.log("Boat Position:", this.#boatPosition);
  }

  addObjects3D(object) {
    if (!(object instanceof Object3D)) {
      throw new Error("Object is not instance of Object3D");
    }
    this.#scene.add(object.getMesh());
    this.#physicsEngine.addObjects3D(object);
    if (object.enableBoxShape) this.#scene.add(object.getBoxShape());
  }

  addFluid(object) {
    if (!(object.fluid instanceof Fluid)) {
      throw new Error("Object is not instance of Fluid");
    }
    this.#scene.add(object.waterMesh);
    this.#physicsEngine.addFluid(object);
    this.#fluids.push(object);
  }

  addStatic(object) {
    this.#scene.add(object);
  }

  changeGravity(number) {
    if (!isNaN(number)) this.#physicsEngine.changeGravity(number);
    else throw new Error("The given parameter is not a number.");
  }

  addSkyBox(
    path,
    extention = "jpg",
    px = "px",
    nx = "nx",
    py = "py",
    ny = "ny",
    pz = "pz",
    nz = "nz"
  ) {
    const cubeLoader = new THREE.CubeTextureLoader();
    this.#skyBoxes.push(
      cubeLoader
        .setPath(path)
        .load([
          `${px}.${extention}`,
          `${nx}.${extention}`,
          `${py}.${extention}`,
          `${ny}.${extention}`,
          `${pz}.${extention}`,
          `${nz}.${extention}`,
        ])
    );
  }

  useSkyBox(index) {
    if (!this.#skyBoxes[index]) throw new Error("Index out of boundaries.");
    this.#scene.background = this.#skyBoxes[index];
  }


  #init() {
    this.#ROOT = document.getElementById("root");

    this.#scene = new THREE.Scene();

    this.#camera = new THREE.PerspectiveCamera(
      45,
      this.#WIDTH / this.#HEIGHT,
      0.01,
      1000
    );
    this.#camera.position.z = 5;

    this.#control = new OrbitControls(this.#camera, this.#ROOT);
    this.#control.enableDamping = true;

    this.#scene.add(this.#camera);

    this.#renderer = new THREE.WebGLRenderer({
      canvas: this.#ROOT,
    });

    this.#renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer.setSize(this.#WIDTH, this.#HEIGHT);

    this.#physicsEngine = new PhysicsEngine(-9.81);
    this.#physicsEngine.run();

    this.#sounds = {};

  }

  #resize() {
    this.#WIDTH = window.innerWidth;
    this.#HEIGHT = window.innerHeight;

    this.#camera.aspect = this.#WIDTH / this.#HEIGHT;
    this.#camera.updateProjectionMatrix();

    this.#renderer.setSize(this.#WIDTH, this.#HEIGHT);
  }




  #generateRandomModel() {
    const models = [coral, rock5, tree, shortPlant, plant, rock8];

    const modelPath = models[Math.floor(Math.random() * models.length)];

    // Generate a position around the boat's position
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 1500,  // Random between -250 and 250
      5,
      (Math.random() - 0.5) * 1500   // Random between -250 and 250
    );
    const position = this.#boatPosition.clone().add(offset);

    const scale = new THREE.Vector3(
      100, // Scale in x
      100, // Scale in y
      100  // Scale in z
    );

    this.#loader.load(modelPath, (gltf) => {
      const model = gltf.scene;
      model.position.copy(position);
      model.scale.copy(scale);
      this.#scene.add(model);
      this.#models.push(model);
      this.#modelPool.push(model);
    });
  }

  #generateModelsPeriodically() {
    setInterval(() => {
      this.#generateRandomModel();
    }, 3000);
  }

  #updateModels() {
    this.#models.forEach((model) => {
      const distance = model.position.distanceTo(this.#boatPosition);
      if (distance > 1000) {
        this.#scene.remove(model);
        this.#models = this.#models.filter(m => m !== model);
      }
    });
  }
}
