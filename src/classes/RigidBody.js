import { Vector3 } from "three";
import gui from "../classes/Gui";
export default class RigidBody {
  position;
  velocity;
  enableGravity;
  mass;
  friction;
  width;
  height;
  depth;

  objects;
  linkObjects;

  constructor(
    position,
    velocity,
    mass,
    friction,
    width = 1,
    height = 1,
    depth = 1,
    enableGravity = true
  ) {

    // gui.add(this, 'mass');
    this.position = position;
    this.velocity = velocity;

    this.rotation = new Vector3(0, 0, 0);

    this.mass = mass;
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.friction = friction;
    this.enableGravity = enableGravity;

    this.objects = [];
    this.linkObjects = false;
  }

  updatePosition(pos) {
    this.position = new Vector3(pos.x, pos.y, pos.z);
  }

  updateVelocity(vel) {
    this.velocity = new Vector3(vel.x, vel.y, vel.z);
  }

  changeRotationY(rotation) {
    this.rotation.set(this.rotation.x, rotation, this.rotation.z);
  }

  link(rigidbody) {
    this.objects.push(rigidbody);
    this.linkObjects = true;
  }
}