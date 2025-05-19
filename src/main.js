import * as THREE from "three";
import Engine from "./classes/Engine";
import Object3D from "./classes/Object3D";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Water from "./customClasses/Water";
import { Boat } from "./customClasses/Boat";
import AudioManager from "./classes/audioManager";


function main() {

  const models = {
    island2: new URL("../static/Models/island2.glb", import.meta.url).href,
    lighthouse: new URL("../static/Models/lighthouse.glb", import.meta.url).href,
    tree: new URL("../static/Models/palm.glb", import.meta.url).href,
    rock8: new URL("../static/Models/rock8.glb", import.meta.url).href,
    rock6: new URL("../static/Models/rock6.glb", import.meta.url).href,
    rock3: new URL("../static/Models/rock3.glb", import.meta.url).href,
    rock4: new URL("../static/Models/rock4.glb", import.meta.url).href,
    rock5: new URL("../static/Models/rock5.glb", import.meta.url).href,
    seaPlant: new URL("../static/Models/rock10.glb", import.meta.url).href,
    catTail: new URL("../static/Models/catTail.glb", import.meta.url).href,
    coral: new URL("../static/Models/coral.glb", import.meta.url).href,
    coral2: new URL("../static/Models/coral2.glb", import.meta.url).href,
    flower: new URL("../static/Models/flower.glb", import.meta.url).href,
    plant: new URL("../static/Models/plant.glb", import.meta.url).href,
    plant2: new URL("../static/Models/plant2.glb", import.meta.url).href,
    purplePlant: new URL("../static/Models/purplePlant.glb", import.meta.url).href,
    shortPlant: new URL("../static/Models/shortPlant.glb", import.meta.url).href,
    tall: new URL("../static/Models/tall.glb", import.meta.url).href,
    yellowPlant: new URL("../static/Models/yellowPlant.glb", import.meta.url).href,
    mountain2: new URL("../static/Models/mountain2.glb", import.meta.url).href,
    StringMountains: new URL("../static/Models/StringMountains.glb", import.meta.url).href,
    bridge: new URL("../static/Models/bridge.glb", import.meta.url).href,
    ground: new URL("../static/Models/ground.glb", import.meta.url).href,
    flower1: new URL("../static/Models/flower1.glb", import.meta.url).href,
    flower2: new URL("../static/Models/flower2.glb", import.meta.url).href,
    lotus: new URL("../static/Models/lotus.glb", import.meta.url).href,
    house: new URL("../static/Models/house.glb", import.meta.url).href,
    Shipping_Container: new URL("../static/Models/Shipping_Container.glb", import.meta.url).href,
    dolfin: new URL("../static/Models/dolfin.glb", import.meta.url).href,
    jelly: new URL("../static/Models/jelly.glb", import.meta.url).href,
    maltia: new URL("../static/Models/maltia.glb", import.meta.url).href,
    octobus: new URL("../static/Models/octobus.glb", import.meta.url).href,
    salta3: new URL("../static/Models/salta3.glb", import.meta.url).href,
    shark: new URL("../static/Models/shark.glb", import.meta.url).href,
    shell: new URL("../static/Models/shell.glb", import.meta.url).href,
    turtle: new URL("../static/Models/turtle.glb", import.meta.url).href,
    whal: new URL("../static/Models/whal.glb", import.meta.url).href,
    scardinius: new URL("../static/Models/scardinius.glb", import.meta.url).href,
    seagull: new URL("../static/Models/seagull.glb", import.meta.url).href,
    Lifebuoy: new URL("../static/Models/Lifebuoy.glb", import.meta.url).href,
    umbrella: new URL("../static/Models/umbrella.glb", import.meta.url).href,
    starFish: new URL("../static/Models/starFish.glb", import.meta.url).href,
    treasure: new URL("../static/Models/treasure.glb", import.meta.url).href,
  };



  const engine = new Engine();

  engine.addSkyBox("Textures/sky1/");
  engine.useSkyBox(0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  engine.addStatic(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffff00, 1);
  directionalLight.target.position.x = 3;
  directionalLight.target.position.y = -3;
  directionalLight.target.position.z = -4;
  engine.addStatic(directionalLight.target);
  engine.addStatic(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x064273, 3);
  engine.addStatic(hemisphereLight);


  document.addEventListener('DOMContentLoaded', () => {
    const audioManager = new AudioManager();

    // Example button click handlers
    document.getElementById('playAudioButton').addEventListener('click', () => {
      audioManager.playAudio();
    });

    document.getElementById('pauseAudioButton').addEventListener('click', () => {
      audioManager.pauseAudio();
    });

    document.getElementById('volume1Slider').addEventListener('input', (event) => {
      audioManager.setVolume1(event.target.value);
    });

    document.getElementById('volume2Slider').addEventListener('input', (event) => {
      audioManager.setVolume2(event.target.value);
    });
  });


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  function loadModels(models) {
    const loader = new GLTFLoader();

    models.forEach((modelConfig) => {
      const { path, position, scale = new THREE.Vector3(1, 1, 1), rotation = new THREE.Euler() } = modelConfig;

      const obj = new Object3D();

      loader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.copy(position);
        model.scale.copy(scale);
        model.setRotationFromEuler(rotation);
        obj.setMesh(model);

        engine.addObjects3D(obj);

        if (gltf.animations && gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });

          const clock = new THREE.Clock();
          function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
          }
          animate();
        }
      }, undefined, (error) => {
        console.error('An error happened', error);
      });
    });
  }


  loadModels([
    ///  islands ///
    {
      path: models.island2,
      position: new THREE.Vector3(5, 5, 0),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, Math.PI / 2, 0)
    },
    {
      path: models.island2,
      position: new THREE.Vector3(-60, 5, 60),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, Math.PI / 2, 0)
    },
    {
      path: models.island2,
      position: new THREE.Vector3(+60, 5, -45),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, -2 * Math.PI, 0)
    },
    {
      path: models.island2,
      position: new THREE.Vector3(+60, 5, +65),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, -Math.PI, 0)
    },
    {
      path: models.island2,
      position: new THREE.Vector3(-60, 5, -45),
      scale: new THREE.Vector3(40, 10, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    ///  lighthouse ///
    {
      path: models.lighthouse,
      position: new THREE.Vector3(18, 5, 0),
      scale: new THREE.Vector3(3, 3.5, 3),
      rotation: new THREE.Euler(0, Math.PI / 2, 0)
    },

    ///  trees ///
    {
      path: models.tree,
      position: new THREE.Vector3(8, 7, -1),
      scale: new THREE.Vector3(10, 10, 10),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tree,
      position: new THREE.Vector3(+60, 10, -25),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tree,
      position: new THREE.Vector3(-50, 10, 60),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tree,
      position: new THREE.Vector3(-90, 15, -90),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tree,
      position: new THREE.Vector3(-90, 15, -100),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tree,
      position: new THREE.Vector3(-110, 15, -70),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tree,
      position: new THREE.Vector3(60, 15, -130),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tree,
      position: new THREE.Vector3(70, 15, -120),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },

    ///  rocks ///
    {
      path: models.rock8,
      position: new THREE.Vector3(10, 5, 20),
      scale: new THREE.Vector3(5, 5, 5),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(-10, 5, -10),
      scale: new THREE.Vector3(5, 5, 5),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(-3, 5, -3),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(-26, 5, -50),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(95, 6, -120),
      scale: new THREE.Vector3(70, 70, 70),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock8,
      position: new THREE.Vector3(95, 6, -180),
      scale: new THREE.Vector3(70, 70, 70),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock6,
      position: new THREE.Vector3(-2, 5, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock6,
      position: new THREE.Vector3(2, 5, -80),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock6,
      position: new THREE.Vector3(100, 5, -30),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock3,
      position: new THREE.Vector3(90, -27, 75),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: models.rock5,
      position: new THREE.Vector3(70, 5, -10),
      scale: new THREE.Vector3(150, 100, 150),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.rock4,
      position: new THREE.Vector3(-90, -27, 80),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: models.rock4,
      position: new THREE.Vector3(-90, -60, 100),
      scale: new THREE.Vector3(200, 200, 200),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: models.rock4,
      position: new THREE.Vector3(-60, -27, 100),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: models.rock4,
      position: new THREE.Vector3(-100, -27, -15),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, -Math.PI / 2)
    },
    //mountains//

    {
      path: models.seaPlant,
      position: new THREE.Vector3(80, 6, -55),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.seaPlant,
      position: new THREE.Vector3(90, 6, -55),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.seaPlant,
      position: new THREE.Vector3(90, 6, -45),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.mountain2,
      position: new THREE.Vector3(-90, 20, -90),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.mountain2,
      position: new THREE.Vector3(+100, 27, -150),
      scale: new THREE.Vector3(120, 120, 120),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.mountain2,
      position: new THREE.Vector3(-110, 40, -160),
      scale: new THREE.Vector3(200, 200, 200),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: models.StringMountains,
      position: new THREE.Vector3(40, -27, -110),
      scale: new THREE.Vector3(150, 150, 150),
      rotation: new THREE.Euler(-Math.PI / 3, 0, 0)
    },
    {
      path: models.StringMountains,
      position: new THREE.Vector3(-40, -27, -110),
      scale: new THREE.Vector3(150, 150, 150),
      rotation: new THREE.Euler(-Math.PI / 3, 0, 0)
    },

    // bridge //
    {
      path: models.bridge,
      position: new THREE.Vector3(-55, 8.7, -140),
      scale: new THREE.Vector3(40, 40, 40),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    // ground //
    {
      path: models.ground,
      position: new THREE.Vector3(0, 0, -160),
      scale: new THREE.Vector3(300, 40, 200),
      rotation: new THREE.Euler(0, 0, 0)
    },
    // house //
    {
      path: models.house,
      position: new THREE.Vector3(40, 15, -120),
      scale: new THREE.Vector3(30, 30, 30),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.flower1,
      position: new THREE.Vector3(-35, 10, -120),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.flower1,
      position: new THREE.Vector3(-25, 10, -120),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.flower1,
      position: new THREE.Vector3(25, 10, -120),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.flower1,
      position: new THREE.Vector3(35, 10, -120),
      scale: new THREE.Vector3(40, 40, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    // Lifebuoy //
    {
      path: models.Lifebuoy,
      position: new THREE.Vector3(15, 4, -120),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    // umbrella //
    {
      path: models.umbrella,
      position: new THREE.Vector3(-37, 10, -125),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: models.Shipping_Container,
      position: new THREE.Vector3(-50, 10, -120),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, -Math.PI / 2, 0)
    },
    {
      path: models.Shipping_Container,
      position: new THREE.Vector3(-60, 10, -120),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, -Math.PI / 2, 0)
    },

    // plants //
    {
      path: models.catTail,
      position: new THREE.Vector3(0, 5, 18),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.catTail,
      position: new THREE.Vector3(90, 10, 0),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.coral,
      position: new THREE.Vector3(-26, 0, -50),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.coral,
      position: new THREE.Vector3(-70, 5, 8),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.coral2,
      position: new THREE.Vector3(-30, 0, -50),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.coral2,
      position: new THREE.Vector3(-75, 0, 47),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.purplePlant,
      position: new THREE.Vector3(-28, 0, -40),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.purplePlant,
      position: new THREE.Vector3(60, 5, 60),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.purplePlant,
      position: new THREE.Vector3(-50, 5, 60),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.flower,
      position: new THREE.Vector3(-60, 10, -65),
      scale: new THREE.Vector3(70, 70, 70),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant,
      position: new THREE.Vector3(-45, 6, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant,
      position: new THREE.Vector3(+40, 5, -40),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant,
      position: new THREE.Vector3(+40, 5, 25),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant,
      position: new THREE.Vector3(-100, 10, -85),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant,
      position: new THREE.Vector3(-100, 10, -75),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant,
      position: new THREE.Vector3(+100, 10, -75),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant,
      position: new THREE.Vector3(+100, 10, -65),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant2,
      position: new THREE.Vector3(-45, 5, 55),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant2,
      position: new THREE.Vector3(-100, 5, 40),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.plant2,
      position: new THREE.Vector3(-100, 5, 33),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: models.shortPlant,
      position: new THREE.Vector3(40, 5, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.shortPlant,
      position: new THREE.Vector3(+60, 6.5, +37),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.shortPlant,
      position: new THREE.Vector3(+30, 6.5, +80),
      scale: new THREE.Vector3(30, 30, 30),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tall,
      position: new THREE.Vector3(30, 0, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tall,
      position: new THREE.Vector3(30, -4, -13),
      scale: new THREE.Vector3(35, 35, 35),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tall,
      position: new THREE.Vector3(90, 10, -10),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.tall,
      position: new THREE.Vector3(100, 10, -30),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.yellowPlant,
      position: new THREE.Vector3(-75, -4, -13),
      scale: new THREE.Vector3(35, 35, 35),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.yellowPlant,
      position: new THREE.Vector3(25, -4, -83),
      scale: new THREE.Vector3(35, 35, 35),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: models.lotus,
      position: new THREE.Vector3(-15, 6, 50),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },

    // fishes  //
    {
      path: models.dolfin,
      position: new THREE.Vector3(0, 0, -13),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.dolfin,
      position: new THREE.Vector3(-65, 2, -65),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: models.jelly,
      position: new THREE.Vector3(30, 0, 50),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: models.octobus,
      position: new THREE.Vector3(70, 2, -65),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },

    {
      path: models.maltia,
      position: new THREE.Vector3(60, 5, 0),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: models.salta3,
      position: new THREE.Vector3(+50, 6.5, +45),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: models.shell,
      position: new THREE.Vector3(+50, 6.5, +40),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: models.shark,
      position: new THREE.Vector3(-50, 1, 30),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: models.turtle,
      position: new THREE.Vector3(70, 5, 80),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: models.whal,
      position: new THREE.Vector3(0, 2, 80),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: models.whal,
      position: new THREE.Vector3(0, 2, -65),
      scale: new THREE.Vector3(0.7, 0.7, 0.7),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },

    {
      path: models.scardinius,
      position: new THREE.Vector3(60, 2, 70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: models.scardinius,
      position: new THREE.Vector3(66, 2, 65),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: models.scardinius,
      position: new THREE.Vector3(66, 2, 79),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    //  birds //
    {
      path: models.seagull,
      position: new THREE.Vector3(0, 20, -65),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: models.seagull,
      position: new THREE.Vector3(-40, 20, +65),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, +Math.PI / 4, 0)
    },
    {
      path: models.starFish,
      position: new THREE.Vector3(+60, 6, -35),
      scale: new THREE.Vector3(5, 5, 5),
      rotation: new THREE.Euler(0, +Math.PI / 4, 0)
    },
    // treasure//
    {
      path: models.treasure,
      position: new THREE.Vector3(+60, 6, -30),
      scale: new THREE.Vector3(5, 5, 5),
      rotation: new THREE.Euler(0, +Math.PI / 4, 0)
    },
  ]);



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  const water = new Water(2000, 2000, 5, 1);
  engine.addFluid(water);

  const boat = new Boat();
  boat.loadModels(engine.addBoat.bind(engine));


  engine.update(() => {
    boat.update();
  });
}

function environment() { }

main();