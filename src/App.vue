<script lang="ts">
import { defineComponent } from "vue"
import Scene from './components/Scene/index.vue'
import BigScreen from './components/BigScreen/index.vue'

export default defineComponent({
  components: {
    Scene,
    BigScreen
  },
  setup() {
    return {}
  }
})
</script>

<template>
  <Scene></Scene>
  <BigScreen></BigScreen>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
