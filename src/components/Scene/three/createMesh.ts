import { arrFn } from './animate'
import Part from './mesh/part'
import scene from './scene'
let part: Part
export function createMesh() {
  part = new Part(scene)
}

export function updateMesh(time: number) {
  if (part) {
    part.update(time)
  }
}

arrFn.push((options) => {
  updateMesh(options.delta * 10)
})