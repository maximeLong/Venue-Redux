<template>
  <a-entity id="potree-loader"
    :position="position[0] + ' ' + position[1] + ' ' + position[2]"
    :rotation="rotation[0] + ' ' + rotation[1] + ' ' + rotation[2]"
    :potree-loader="
      'src:' + src + ';' +
      'pointBudget:' + pointBudget + ';' +
      'pointSize:' + pointSize + ';' +
      'pointSizeType:' + pointSizeType + ';' +
      'pointShape:' + pointShape + ';'
    "
  >
    <!-- menu options -->
    <div id="menu-toggle" @click="showMenu = !showMenu" :class="{on : showMenu}"></div>

    <div id="potree-tools" v-if="showMenu">
      <div class="option">
        <div class="title">pt. type</div>
        <select v-model="pointSizeType">
          <option v-for="option in pointSizeTypes">{{ option }}</option>
        </select>
      </div>
      <div class="option">
        <div class="title">pt. size</div>
        <input v-model="pointSize" type="range" min="0" max="10">
      </div>
      <div class="option">
        <div class="title">position</div>
        <div class="inline-inputs">
          <input v-model="position[0]">
          <input v-model="position[1]">
          <input v-model="position[2]">
        </div>
      </div>
      <div class="option">
        <div class="title">rotation</div>
        <div class="inline-inputs">
          <input v-model="rotation[0]">
          <input v-model="rotation[1]">
          <input v-model="rotation[2]">
        </div>
      </div>
    </div>

  </a-entity>
</template>

<script>
export default {

  name: 'aframePotreeLoader',
  data: function() {
    return {
      showMenu: false,

      pointBudget: 200000,
      pointSize: 1,
      pointShape: 'square',
      pointSizeType: 'adaptive',
      pointSizeTypes: ['adaptive', 'fixed', 'attenuated'],
      position: [-1, 2, -2],
      rotation: [-85, 0, 0],
      src: 'http://5.9.65.151/mschuetz/potree/resources/pointclouds/scott_reed/DoverMillRuins/',
      // src: 'http://5.9.65.151/mschuetz/potree/resources/pointclouds/weiss/chiller/',
      // src: 'http://5.9.65.151/mschuetz/potree/resources/pointclouds/archpro/heidentor/',
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
#menu-toggle
  position: absolute
  z-index: 9999
  width: 30px
  height: 30px
  border-radius: 100%
  background-color: #00000061
  margin: 5px 0 0 5px
  +clickable
  //hamburger style hack, too lazy to make icons
  &::before,&::after
    content: ''
    position: absolute
    height: 2px
    width: 14px
    left: 8px
    top: 12px
    background-color: white
  &::after
    top: 18px
  &.on
    &::after
      transform: rotate(45deg)
      top: 14px
    &::before
      top: 14px
      transform: rotate(-45deg)

#potree-tools
  position: absolute
  z-index: 999
  width: 200px
  background-color: #00000021
  margin: 20px 0 0 20px
  padding: 10px
  .option
    +flexbox
    +align-items(center)
    margin-bottom: 10px
    +userType(small)
    font-size: 12px
    color: white
    &:last-of-type
      margin-bottom: 0
    input
      padding: 3px
      margin: 0 2px
      border: none
      +userType(small)
      font-size: 12px

    .title
      margin-right: 10px
      min-width: 50px
    .inline-inputs
      +flexbox
      +align-items(center)

</style>
