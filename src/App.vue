<template>
  <div id="app">

    <div id="main-panel">
      <div id="header-panel">
        <app-header></app-header>
      </div>

      <div id="app-content">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>

import AppHeader from './components/AppHeader.vue'

export default {
  name: 'app',
  components: {
    AppHeader
  }
}
</script>

<style lang="sass">

</style>
