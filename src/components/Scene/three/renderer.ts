import { WebGLRenderer } from "three"

// 初始化渲染器
const renderer = new WebGLRenderer({
  alpha: false,
  // 抗锯齿
  antialias: true,
  // 使用对数深度缓存
  logarithmicDepthBuffer: true,
})
// 物理正确光照
renderer.physicallyCorrectLights = true
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 是否开启场景阴影
renderer.shadowMap.enabled = false

export default renderer