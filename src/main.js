import * as THREE from "three";
import Engine from "./classes/Engine";
import Object3D from "./classes/Object3D";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Water from "./customClasses/Water";
import { BoatEngine } from "./customClasses/BoatEngine";
import { Boat } from "./customClasses/Boat";
import gui from "./classes/Gui";

import island2 from "../static/Models/island2.glb"
import lighthouse from "../static/Models/lighthouse.glb"
import tree from "../static/Models/palm.glb"
import rock8 from "../static/Models/rock8.glb"
import rock6 from "../static/Models/rock6.glb"
import rock3 from "../static/Models/rock3.glb"
import rock4 from "../static/Models/rock4.glb"
import rock5 from "../static/Models/rock5.glb"
import seaPlant from "../static/Models/rock10.glb"
import catTail from "../static/Models/catTail.glb"
import coral from "../static/Models/coral.glb"
import coral2 from "../static/Models/coral2.glb"
import flower from "../static/Models/flower.glb"
import plant from "../static/Models/plant.glb"
import plant2 from "../static/Models/plant2.glb"
import purplePlant from "../static/Models/purplePlant.glb"
import shortPlant from "../static/Models/shortPlant.glb"
import tall from "../static/Models/tall.glb"
import yellowPlant from "../static/Models/yellowPlant.glb"
import mountains from "../static/Models/mountains.glb"
import mountain2 from "../static/Models/mountain2.glb"
import StringMountains from "../static/Models/StringMountains.glb"
import bridge from "../static/Models/bridge.glb"
import ground from "../static/Models/ground.glb"
import flower1 from "../static/Models/flower1.glb"
import flower2 from "../static/Models/flower2.glb"
import lotus from "../static/Models/lotus.glb"
import house from "../static/Models/house.glb"
import Shipping_Container from "../static/Models/Shipping_Container.glb"
import dolfin from "../static/Models/dolfin.glb"
import jelly from "../static/Models/jelly.glb"
import maltia from "../static/Models/maltia.glb"
import octobus from "../static/Models/octobus.glb"
import salta3 from "../static/Models/salta3.glb"
import shark from "../static/Models/shark.glb"
import shell from "../static/Models/shell.glb"
import turtle from "../static/Models/turtle.glb"
import whal from "../static/Models/whal.glb"
import scardinius from "../static/Models/scardinius.glb"
import seagull from "../static/Models/seagull.glb"
import Lifebuoy from "../static/Models/Lifebuoy.glb"
import umbrella from "../static/Models/umbrella.glb"
import starFish from "../static/Models/starFish.glb"
import treasure from "../static/Models/treasure.glb"


import AudioManager from './classes/audioManager';


function main() {
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
      path: island2,
      position: new THREE.Vector3(5, 5, 0),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, Math.PI / 2, 0)
    },
    {
      path: island2,
      position: new THREE.Vector3(-60, 5, 60),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, Math.PI / 2, 0)
    },
    {
      path: island2,
      position: new THREE.Vector3(+60, 5, -45),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, -2 * Math.PI, 0)
    },
    {
      path: island2,
      position: new THREE.Vector3(+60, 5, +65),
      scale: new THREE.Vector3(30, 10, 30),
      rotation: new THREE.Euler(0, -Math.PI, 0)
    },
    {
      path: island2,
      position: new THREE.Vector3(-60, 5, -45),
      scale: new THREE.Vector3(40, 10, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    ///  lighthouse ///
    {
      path: lighthouse,
      position: new THREE.Vector3(18, 5, 0),
      scale: new THREE.Vector3(3, 3.5, 3),
      rotation: new THREE.Euler(0, Math.PI / 2, 0)
    },

    ///  trees ///
    {
      path: tree,
      position: new THREE.Vector3(8, 7, -1),
      scale: new THREE.Vector3(10, 10, 10),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tree,
      position: new THREE.Vector3(+60, 10, -25),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tree,
      position: new THREE.Vector3(-50, 10, 60),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tree,
      position: new THREE.Vector3(-90, 15, -90),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tree,
      position: new THREE.Vector3(-90, 15, -100),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tree,
      position: new THREE.Vector3(-110, 15, -70),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tree,
      position: new THREE.Vector3(60, 15, -130),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tree,
      position: new THREE.Vector3(70, 15, -120),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },

    ///  rocks ///
    {
      path: rock8,
      position: new THREE.Vector3(10, 5, 20),
      scale: new THREE.Vector3(5, 5, 5),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(-10, 5, -10),
      scale: new THREE.Vector3(5, 5, 5),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(-3, 5, -3),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(26, 5, -70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(-26, 5, -50),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(95, 6, -120),
      scale: new THREE.Vector3(70, 70, 70),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock8,
      position: new THREE.Vector3(95, 6, -180),
      scale: new THREE.Vector3(70, 70, 70),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock6,
      position: new THREE.Vector3(-2, 5, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock6,
      position: new THREE.Vector3(2, 5, -80),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock6,
      position: new THREE.Vector3(100, 5, -30),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock3,
      position: new THREE.Vector3(90, -27, 75),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: rock5,
      position: new THREE.Vector3(70, 5, -10),
      scale: new THREE.Vector3(150, 100, 150),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: rock4,
      position: new THREE.Vector3(-90, -27, 80),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: rock4,
      position: new THREE.Vector3(-90, -60, 100),
      scale: new THREE.Vector3(200, 200, 200),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: rock4,
      position: new THREE.Vector3(-60, -27, 100),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    {
      path: rock4,
      position: new THREE.Vector3(-100, -27, -15),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(-Math.PI / 2, 0, -Math.PI / 2)
    },
    //mountains//

    {
      path: seaPlant,
      position: new THREE.Vector3(80, 6, -55),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: seaPlant,
      position: new THREE.Vector3(90, 6, -55),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: seaPlant,
      position: new THREE.Vector3(90, 6, -45),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: mountain2,
      position: new THREE.Vector3(-90, 20, -90),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: mountain2,
      position: new THREE.Vector3(+100, 27, -150),
      scale: new THREE.Vector3(120, 120, 120),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: mountain2,
      position: new THREE.Vector3(-110, 40, -160),
      scale: new THREE.Vector3(200, 200, 200),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: StringMountains,
      position: new THREE.Vector3(40, -27, -110),
      scale: new THREE.Vector3(150, 150, 150),
      rotation: new THREE.Euler(-Math.PI / 3, 0, 0)
    },
    {
      path: StringMountains,
      position: new THREE.Vector3(-40, -27, -110),
      scale: new THREE.Vector3(150, 150, 150),
      rotation: new THREE.Euler(-Math.PI / 3, 0, 0)
    },

    // bridge //
    {
      path: bridge,
      position: new THREE.Vector3(-55, 8.7, -140),
      scale: new THREE.Vector3(40, 40, 40),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    // ground //
    {
      path: ground,
      position: new THREE.Vector3(0, 0, -160),
      scale: new THREE.Vector3(300, 40, 200),
      rotation: new THREE.Euler(0, 0, 0)
    },
    // house //
    {
      path: house,
      position: new THREE.Vector3(40, 15, -120),
      scale: new THREE.Vector3(30, 30, 30),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: flower1,
      position: new THREE.Vector3(-35, 10, -120),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: flower1,
      position: new THREE.Vector3(-25, 10, -120),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: flower1,
      position: new THREE.Vector3(25, 10, -120),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: flower1,
      position: new THREE.Vector3(35, 10, -120),
      scale: new THREE.Vector3(40, 40, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    // Lifebuoy //
    {
      path: Lifebuoy,
      position: new THREE.Vector3(15, 4, -120),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0)
    },
    // umbrella //
    {
      path: umbrella,
      position: new THREE.Vector3(-37, 10, -125),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: Shipping_Container,
      position: new THREE.Vector3(-50, 10, -120),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, -Math.PI / 2, 0)
    },
    {
      path: Shipping_Container,
      position: new THREE.Vector3(-60, 10, -120),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, -Math.PI / 2, 0)
    },

    // plants //
    {
      path: catTail,
      position: new THREE.Vector3(0, 5, 18),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: catTail,
      position: new THREE.Vector3(90, 10, 0),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: coral,
      position: new THREE.Vector3(-26, 0, -50),
      scale: new THREE.Vector3(40, 20, 40),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: coral,
      position: new THREE.Vector3(-70, 5, 8),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: coral2,
      position: new THREE.Vector3(-30, 0, -50),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: coral2,
      position: new THREE.Vector3(-75, 0, 47),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: purplePlant,
      position: new THREE.Vector3(-28, 0, -40),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: purplePlant,
      position: new THREE.Vector3(60, 5, 60),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: purplePlant,
      position: new THREE.Vector3(-50, 5, 60),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: flower,
      position: new THREE.Vector3(-60, 10, -65),
      scale: new THREE.Vector3(70, 70, 70),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant,
      position: new THREE.Vector3(-45, 6, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant,
      position: new THREE.Vector3(+40, 5, -40),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant,
      position: new THREE.Vector3(+40, 5, 25),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant,
      position: new THREE.Vector3(-100, 10, -85),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant,
      position: new THREE.Vector3(-100, 10, -75),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant,
      position: new THREE.Vector3(+100, 10, -75),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant,
      position: new THREE.Vector3(+100, 10, -65),
      scale: new THREE.Vector3(80, 80, 80),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant2,
      position: new THREE.Vector3(-45, 5, 55),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant2,
      position: new THREE.Vector3(-100, 5, 40),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: plant2,
      position: new THREE.Vector3(-100, 5, 33),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: shortPlant,
      position: new THREE.Vector3(40, 5, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: shortPlant,
      position: new THREE.Vector3(+60, 6.5, +37),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: shortPlant,
      position: new THREE.Vector3(+30, 6.5, +80),
      scale: new THREE.Vector3(30, 30, 30),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tall,
      position: new THREE.Vector3(30, 0, 0),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tall,
      position: new THREE.Vector3(30, -4, -13),
      scale: new THREE.Vector3(35, 35, 35),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tall,
      position: new THREE.Vector3(90, 10, -10),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: tall,
      position: new THREE.Vector3(100, 10, -30),
      scale: new THREE.Vector3(100, 100, 100),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: yellowPlant,
      position: new THREE.Vector3(-75, -4, -13),
      scale: new THREE.Vector3(35, 35, 35),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: yellowPlant,
      position: new THREE.Vector3(25, -4, -83),
      scale: new THREE.Vector3(35, 35, 35),
      rotation: new THREE.Euler(0, 0, 0)
    },

    {
      path: lotus,
      position: new THREE.Vector3(-15, 6, 50),
      scale: new THREE.Vector3(15, 15, 15),
      rotation: new THREE.Euler(0, 0, 0)
    },

    // fishes  //
    {
      path: dolfin,
      position: new THREE.Vector3(0, 0, -13),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: dolfin,
      position: new THREE.Vector3(-65, 2, -65),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: jelly,
      position: new THREE.Vector3(30, 0, 50),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      path: octobus,
      position: new THREE.Vector3(70, 2, -65),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },

    {
      path: maltia,
      position: new THREE.Vector3(60, 5, 0),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: salta3,
      position: new THREE.Vector3(+50, 6.5, +45),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: shell,
      position: new THREE.Vector3(+50, 6.5, +40),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: shark,
      position: new THREE.Vector3(-50, 1, 30),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: turtle,
      position: new THREE.Vector3(70, 5, 80),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, Math.PI / 4, 0)
    },
    {
      path: whal,
      position: new THREE.Vector3(0, 2, 80),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: whal,
      position: new THREE.Vector3(0, 2, -65),
      scale: new THREE.Vector3(0.7, 0.7, 0.7),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },

    {
      path: scardinius,
      position: new THREE.Vector3(60, 2, 70),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: scardinius,
      position: new THREE.Vector3(66, 2, 65),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: scardinius,
      position: new THREE.Vector3(66, 2, 79),
      scale: new THREE.Vector3(20, 20, 20),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    //  birds //
    {
      path: seagull,
      position: new THREE.Vector3(0, 20, -65),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0)
    },
    {
      path: seagull,
      position: new THREE.Vector3(-40, 20, +65),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, +Math.PI / 4, 0)
    },
    {
      path: starFish,
      position: new THREE.Vector3(+60, 6, -35),
      scale: new THREE.Vector3(5, 5, 5),
      rotation: new THREE.Euler(0, +Math.PI / 4, 0)
    },
    // treasure//
    {
      path: treasure,
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