import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import gsap from "gsap";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import eventHub from '../../../../utils/eventHub'
import { LineSegments, PerspectiveCamera } from "three";
import cameraModule from '../camera'

export default class Part {
  scene: THREE.Scene
  loader: GLTFLoader
  mixer: THREE.AnimationMixer | undefined
  clip: THREE.AnimationClip | undefined
  action: THREE.AnimationAction | undefined
  gltf: GLTF | undefined;
  curve: THREE.CatmullRomCurve3 | undefined;
  curveProgress: number | undefined;
  redcar: THREE.Object3D<THREE.Event> | undefined;

  constructor(scene: THREE.Scene) {
    // 载入模型
    this.scene = scene
    this.loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("./draco/")
    this.loader.setDRACOLoader(dracoLoader)
    this.loader.load("./models/city4.glb", (gltf) => {
      this.gltf = gltf
      this.scene.add(gltf.scene)
      // 场景子元素遍历
      gltf.scene.traverse(item => {
        if (item.name === "热气球") {
          this.mixer = new THREE.AnimationMixer(item)
          this.clip = gltf.animations[0]
          this.action = this.mixer.clipAction(this.clip)
          this.action.play()
        }

        if (item.name === "汽车园区轨迹") {
          const line = item as LineSegments
          line.visible = false
          // 根据点创建线
          const points = []
          let i = line.geometry.attributes.position.count - 1
          for (; i >= 0; i--) {
            points.push(
              new THREE.Vector3(
                line.geometry.attributes.position.getX(i),
                line.geometry.attributes.position.getY(i),
                line.geometry.attributes.position.getZ(i)
              )
            )
          }

          this.curve = new THREE.CatmullRomCurve3(points)
          this.curveProgress = 0;
          this.carAnimation()
        }

        if (item.name === "redcar") {
          this.redcar = item
        }

        gltf.cameras.forEach((camera) => {
          cameraModule.add(camera.name, camera as PerspectiveCamera);
        })
      })
    })

    eventHub.on("actionClick", (i) => {
      const index = i as number
      if (this.action && this.gltf && this.mixer) {
        this.action.reset()
        this.clip = this.gltf.animations[index]
        this.action = this.mixer.clipAction(this.clip)
        this.action.play()
      }
    })
  }

  carAnimation() {
    gsap.to(this, {
      curveProgress: 0.999,
      duration: 10,
      repeat: -1,
      onUpdate: () => {
        if (this.curve && this.curveProgress && this.redcar) {
          let point = this.curve.getPoint(this.curveProgress)
          this.redcar.position.set(point.x, point.y, point.z);
          if (this.curveProgress + 0.001 < 1) {
            point = this.curve.getPoint(this.curveProgress + 0.001);
            this.redcar.lookAt(point);
          }
        }
      }
    })
  }

  update(time: number) {
    if (this.mixer) {
      this.mixer.update(time)
    }
  }
}