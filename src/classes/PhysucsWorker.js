export default class PhysicsWorker {
  #worker;

  constructor(path) {
    this.#worker = new Worker(path);
  }

  addEventListener(type, listener) {
    this.#worker.addEventListener(type, listener);
  }

  postMessage(object) {
    this.#worker.postMessage(object);
  }
}
