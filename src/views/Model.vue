<template>
  <div id="model">

    <div id="model-viewer">
      <a-scene embedded vr-mode-ui="enabled: false">
        <!-- potree component wrapper -->
        <aframe-potree-loader></aframe-potree-loader>
        <a-entity
          id="camera"
          camera="fov: 80; zoom: 1;"
          mouse-cursor=""
          position="0 2 50"
          orbit-controls="
            autoRotate: false;
            invertZoom: true;
            target: #cam-target;
            enableDamping: true;
            dampingFactor: 0.125;
            rotateSpeed:0.25;
            minDistance:3;
            maxDistance:100;"
        ></a-entity>
        <a-entity id="cam-target" position="0 0 0"></a-entity>
      </a-scene>
    </div>

    <!-- Project Links -->
    <content-box :title="'Additional Content'" v-if="device !== 'mobile'">
      <div v-for="link in additionalContent" class="content-link">
        <a :href="link.url" target="_blank" rel="noopener noreferrer">{{link.name}}</a>
      </div>
    </content-box>

  </div>
</template>

<script>

//have to require component libs here so aframe registers first
require('aframe');
require('aframe-potree-loader-component');
require('aframe-orbit-controls-component-2');

import ContentBox from '../components/ContentBox'
import AframePotreeLoader from '../components/AframePotreeLoader'

export default {
  name: 'model',
  components: {
    ContentBox,
    AframePotreeLoader
  },
  computed: {
    device: function() { return this.$store.state.device },
    additionalContent: function() { return this.$store.state.additionalContent }
  }

}
</script>

<style lang="sass">
@import src/styles/main

#model
  height: 100%
  width: 100%
  padding: 20px
  +flexbox
  +flex-direction(row)
  +screen(mobile)
    padding: 10px
  #model-viewer
    +flex(1 0 0)
    background: radial-gradient(#f1e4d1 0%, #737373 100%)
    border-radius: 2px
    position: relative
    overflow: hidden
    user-select: none

  .content-box
    width: 350px
    margin-left: 20px
    position: relative
    .content-header
      height: 50px
    .content-content
      overflow-y: scroll
      height: calc(100% - 50px)

      .content-link
        +systemType(small)
        margin-bottom: 15px
        color: $action_color

</style>
