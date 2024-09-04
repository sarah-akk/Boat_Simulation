import * as THREE from "three";
import RigidBody from "./RigidBody";

export default class Object3D {
  #mesh;
  #boxShape;

  enableBoxShape;
  rigidBody;

  constructor(
    mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "red" })
    ),
    position = new THREE.Vector3(0, 0, 0)
  ) {
    this.#mesh = new THREE.Group();
    this.#mesh.add(mesh);
    this.#mesh.position.copy(position);
    this.enableBoxShape = false;
  }

  getMesh() {
    return this.#mesh;
  }
  getRotationY() {
    return this.#mesh.rotation.y;
  }


  setMesh(mesh) {
    this.#mesh.clear();

    this.#mesh.add(mesh);
  }

  chagnePivotPoint(vector) {
    if (!(vector instanceof THREE.Vector3))
      throw new Error("Vector is not instanceof THREE.Vector3");
    this.#mesh.children[0].position.copy(vector);
  }

  changeRotation(rotation) {
    this.#mesh.rotateZ(rotation);
  }
  changeRotationY(rotation) {
    this.#mesh.rotateY(rotation);
  }
  changePosition(pos) {
    this.#mesh.position.copy(pos);
    if (this.enableBoxShape) this.#boxShape.position.copy(this.#mesh.position);
  }
  changeScale(x, y, z) {
    this.#mesh.scale.set(x, y, z);
  }

  createRigidBodyWithMass(
    mass,
    velocity = new THREE.Vector3(0, 0, 0),
    friction = 0.2,
    enableGravity = true
  ) {
    if (!this.rigidBody) {
      const size = this.#getBoundaries();
      this.rigidBody = new RigidBody(
        this.#mesh.position,
        velocity,
        mass,
        friction,
        size.x,
        size.y,
        size.z,
        enableGravity
      );
    }
  }

  createRigidBodyWithDensity(
    density,
    velocity = new THREE.Vector3(0, 0, 0),
    friction = 0.2,
    enableGravity = true
  ) {
    if (!this.rigidBody) {
      const size = this.#getBoundaries();
      this.rigidBody = new RigidBody(
        this.#mesh.position,
        velocity,
        size.x * size.y * size.z * density,
        friction,
        size.x,
        size.y,
        size.z,
        enableGravity
      );
    }
  }

  createBoxShape() {
    const size = this.#getBoundaries();
    this.#boxShape = new THREE.Mesh(
      new THREE.BoxGeometry(size.x, size.y, size.z),
      new THREE.MeshBasicMaterial({ color: "red", wireframe: true })
    );
    this.#boxShape.position.copy(this.#mesh.position);
    console.log(size);
  }

  getBoxShape() {
    return this.#boxShape;
  }

  getPosition() {
    return this.#mesh.position;
  }

  update() {
    if (this.rigidBody) {
      this.#mesh.position.copy(this.rigidBody.position);
      this.#mesh.rotation.y += this.rigidBody.rotation.y;

      // this.#mesh.rotation.copy(this.rigidBody.rotation);
      //this.#mesh.children[0].position.copy(this.rigidBody.position);
      //this.#mesh.children[0].geometry.computeBoundingSphere();
    }
    if (this.enableBoxShape) this.#boxShape.position.copy(this.#mesh.position);
  }

  #getBoundaries() {
    const boundingBox = new THREE.Box3().setFromObject(this.#mesh);
    return boundingBox.getSize(new THREE.Vector3());
  }
}
