import { EVENTS } from "./utils/constants";
import { gameManger } from "./GameManager";
import {landmarkStore} from "./LandmarkStore";
import * as THREE from "three";
import { unitsManager } from "./UnitsManager";

class HandManager {
  constructor() {
    this.debugMode = false;
    this.cubes = [];
    this.landmarks = [];
    this.arrowGroup = new THREE.Group();
    this.rayGroup = [];

  }

  get _cubesAdded() {
    return this.cubes.length === 21;
  }

  get raysAdded() {
    return this.rayGroup.length === 21;
  }

  createCubes() {
    if (this._cubesAdded === true) {
      console.warn("Cubes already exist");
      return;
    }
    const geometry = new THREE.BoxGeometry(0.2,0.2,0.2);
    const material = new THREE.MeshBasicMaterial({
      color: "blue",
      wireframe: true
    });

    for (let index = 0; index < 21; index++) {
      const cube = new THREE.Mesh(geometry, material);
      this.cubes.push(cube);
    }
  }


  _updateLandsMarks() {
    const handle = () => {
      this.landmarks = landmarkStore.landmarks;
    };
    
    handle.bind(this);
    window.addEventListener(EVENTS.LANDMARKS_UPDATE, handle);
  }

  _handleRaycasters() {
    if (!this._cubesAdded) return;

    if (!this.raysAdded) {
      this.cubes.forEach((cube) => {
        const raycaster = new THREE.Raycaster();
       raycaster.set(cube.position, new THREE.Vector3(0, 0, -1).normalize());
  
        this.rayGroup.push(raycaster);
      });
    } else {
      for (let index = 0; index < this.rayGroup.length; index++) {
        this.rayGroup[index].set(
          this.cubes[index].position,
          new THREE.Vector3(0, 0, -1).normalize()
        );

        
      }
    }
  }

  _handleArrows() {
    if (this.debugMode === false) {
      return;
    }

    if(this.raysAdded === false){
      return
    }
 
      this.arrowGroup.clear()
      this.rayGroup.forEach((raycaster) => {
     
        const arrow = new THREE.ArrowHelper(
          raycaster.ray.direction,
          raycaster.ray.origin,
          300,
          0xff0000
        );
        this.arrowGroup.add(arrow);
      });


  }


  _handleCollisions() {
    if (!this._cubesAdded && !this.raysAdded) return;
    if(!gameManger.isPlaying) return
    
    let intersectionsExist = false
    this.rayGroup.forEach((ray) => {
     
      const intersects = ray.intersectObjects(unitsManager.activeObjects.children);
      
    
      intersects.forEach((intersection) => {
       
        if(intersection.distance <= 0.01){
          console.log(intersection)
          window.dispatchEvent(new CustomEvent(EVENTS.HAND_COLLIDE , {detail: intersection.object}))
        }
      })
       
     
    });


  }

  _placeCubesByLandmark(camera){
    for (let index = 0; index < this.landmarks.length; index++) {
      const currLndmrk = this.landmarks[index];

      const vector = new THREE.Vector3(
        currLndmrk.x * 2 - 1,
        -currLndmrk.y * 2 + 1,
        currLndmrk.z * 10 
      ).unproject(camera);

       
    
      const dir = vector.sub(camera.position).normalize();
      dir.setX(-dir.x);
       const distance = -camera.position.z / dir.z; //<- leave comment, this maps hands z coordinate to cameras z coordinate
       const pos = camera.position.clone().add(dir.multiplyScalar(distance));
       
       this.cubes[index].position.copy(pos);
      this.cubes[index].rotation.x = Math.PI
    }
  }

  render(camera, scene, debugMode = false) {
  
    if (this._cubesAdded === false) {
      throw new Error("add cubes first. createCubes method");
    }

    this.debugMode = debugMode;
    this._handleRaycasters(scene);
    this._handleArrows();
    this._handleCollisions();
    this._placeCubesByLandmark(camera)

  }
}

export const handManager = new HandManager();


