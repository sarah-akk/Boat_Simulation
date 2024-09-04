import * as THREE from "three";
import Fluid from "../classes/Fluid";

export default class Water {
  constructor(width, height, depth, spacing) {
    this.gRenderTarget;

    this.columnsI = Math.floor(width / spacing) + 1;
    this.columnsJ = Math.floor(height / spacing) + 1;
    this.allColumns = this.columnsI * this.columnsJ;

    //Start the visual of the mesh
    let columnsPositions = new Float32Array(this.allColumns * 3);
    let columnsUVs = new Float32Array(this.allColumns * 2);

    this.centerOfX = Math.floor(this.columnsI / 2.0);
    this.centerOfZ = Math.floor(this.columnsJ / 2.0);

    for (let i = 0; i < this.columnsI; i++) {
      for (let j = 0; j < this.columnsJ; j++) {
        columnsPositions[3 * (i * this.columnsJ + j)] =
          (i - this.centerOfX) * spacing;

        columnsPositions[3 * (i * this.columnsJ + j) + 2] =
          (j - this.centerOfZ) * spacing;

        columnsUVs[2 * (i * this.columnsJ + j)] = i / this.columnsI;
        columnsUVs[2 * (i * this.columnsJ + j) + 1] = j / this.columnsJ;
      }
    }

    let indexes = new Uint32Array(
      (this.columnsI - 1) * (this.columnsJ - 1) * 2 * 3
    );
    let pos = 0;
    for (let i = 0; i < this.columnsI - 1; i++) {
      for (let j = 0; j < this.columnsJ - 1; j++) {
        let id0 = i * this.columnsJ + j;
        let id1 = i * this.columnsJ + j + 1;
        let id2 = (i + 1) * this.columnsJ + j + 1;
        let id3 = (i + 1) * this.columnsJ + j;

        indexes[pos++] = id0;
        indexes[pos++] = id1;
        indexes[pos++] = id2;

        indexes[pos++] = id0;
        indexes[pos++] = id2;
        indexes[pos++] = id3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(columnsPositions, 3)
    );
    geometry.setAttribute("uv", new THREE.BufferAttribute(columnsUVs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indexes, 1));

    const material = this.#material();

    this.waterMesh = new THREE.Mesh(geometry, material);

    this.fluid = new Fluid(this.columnsI, this.columnsJ, depth, spacing);

    const positionsMesh = this.waterMesh.geometry.attributes.position.array;

    for (let i = 0; i < this.allColumns; i++) {
      positionsMesh[3 * i + 1] = depth;
    }
    this.waterMesh.geometry.attributes.position.needsUpdate = true;
    this.waterMesh.geometry.computeVertexNormals();
    this.waterMesh.geometry.computeBoundingSphere();
  }

  getMeshesPositions() {
    return this.waterMesh.geometry.attributes.position.array;
  }
  update(newPositions) {
    let positions = this.waterMesh.geometry.attributes.position.array;
    positions = newPositions;
    this.waterMesh.geometry.attributes.position.needsUpdate = true;
    // this.waterMesh.geometry.computeVertexNormals();
    // this.waterMesh.geometry.computeBoundingSphere();
  }

  #material() {
    const vertexShader = `
    varying vec3 varNormal;
    varying vec2 varScreenPos;
    varying vec3 varPos;

    void main() {
        vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        varScreenPos = vec2(0.5, 0.5) + 0.5 * vec2(pos) / pos.z;
        varPos = vec3(position);
        varNormal = normal;
        gl_Position = pos;
    }`;

    const fragmentShader = `
    uniform sampler2D background;
    varying vec3 varNormal;
    varying vec2 varScreenPos;
    varying vec3 varPos;

    void main() {
        float r = 0.02;	// todo: should be distance dependent!
        vec2 uv = varScreenPos + r * vec2(varNormal.x, varNormal.z);
        vec4 color = texture2D(background, uv);
        color.z = min(color.z + 0.2, 1.0);

        vec3 L = normalize(vec3(10.0, 10.0, 10.0) - varPos);
        float s = max(dot(varNormal,L), 0.0);
        color *= (0.5 + 0.5 * s);

        gl_FragColor = color;
    }
    `;

    this.gRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
      }
    );

    return new THREE.ShaderMaterial({
      uniforms: { background: { value: this.gRenderTarget.texture } },
      vertexShader,
      fragmentShader,
    });
  }

  toggleVisibility() {
    this.waterMesh.visible = !this.waterMesh.visible;
  }
}
