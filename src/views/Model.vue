<template>
  <div id="model">

    <!-- THREE.JS anchor div -->
    <div id="model-viewer">
      <a-scene embedded vr-mode-ui="enabled: false">
       <a-entity potree-loader="
         src: https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/;
         pointBudget: 2000000;
         pointSize: 1;
         "
         position="-1 -5 -2"
         rotation="-85 0 0"
       ></a-entity>
       <a-entity camera look-controls orbit-controls="target: 0 0 -0.5; minDistance: 0.5; maxDistance: 180; initialPosition: 0 0 3"></a-entity>
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

require('aframe');
require('aframe-potree-loader-component');
require('aframe-orbit-controls');

import ContentBox from '../components/ContentBox'
import _ from 'lodash'

export default {
  name: 'model',
  components: {
    ContentBox
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
