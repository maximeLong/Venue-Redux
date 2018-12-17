<template>
  <div id="header-content">

    <div class="left-section">
      <div class="our-logo" v-if="device !== 'mobile'">Venue</div>
      <div class="logo" ></div>
    </div>

    <div class="right-section">
      <div class="border"></div>
      <div class="their-logo"></div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'appHeader',
  computed: {
    device: function()       { return this.$store.state.device }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
$margin_amount: 20px

#header-content
  width: 100%
  height: 60px
  +flexbox
  +align-items(center)
  +flex-direction(row)
  +justify-content(space-between)
  background-color: white
  border-bottom: 1px solid $border_color
  +userType(small)

  .left-section
    +flexbox
    +align-items(center)
    height: 100%
    margin-left: $margin_amount
    +screen(mobile)
      margin-left: 10px
    .logo
      background: url('../assets/logo.png')
      background-repeat: no-repeat
      background-position: 50% 50%
      height: 100%
      width: 150px
      border-left: 1px solid $border_color
      padding-left: 10px
      margin-left: 10px
      +screen(mobile)
        border: none
        padding-left: 0
        margin-left: 0

  .right-section
    margin-right: $margin_amount
    height: 100%
    +flexbox
    +align-items(center)
    +clickable
    +screen(mobile)
      margin-right: 10px
    .border
      height: 100%
      border-right: 1px solid $border_color
      margin-right: 20px
    .their-logo
      height: 100%
      width: 100px
      background: url('../assets/logo.png')
      background-repeat: no-repeat
      background-position: 50% 50%
      background-size: contain

</style>
