<template>
  <div id="home">

    <content-box :title="'Title of Project'">
      <div class="title">please login to see model</div>

      <input :value="formEmail" @input="updateFormEmail" placeholder="email">
      <input :value="formPassword" @input="updateFormPassword" type="password" placeholder="password" @keyup.enter="trySignIn(formEmail, formPassword)">

      <button @click="trySignIn(formEmail, formPassword)" class="submit-button">Sign In</button>
    </content-box>

  </div>
</template>

<script>
import ContentBox from '../components/ContentBox'
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    ContentBox
  },
  data: function(){
    return {}
  },
  computed: {
    ...mapState([
      'formEmail',
      'formPassword'
    ])
  },

  methods: {
    updateFormEmail: function(e)    { this.$store.commit('SET_FORM_EMAIL', e.target.value) },
    updateFormPassword: function(e) { this.$store.commit('SET_FORM_PASSWORD', e.target.value) },
    trySignIn: function(email, password) {
      //wait for promise to return to route to model page
      this.$store.dispatch('signInLoad')
      .then(()=> {
        this.$router.push({ name: 'model' })
      })
      .catch((err)=> {
        console.log(err)
      })
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#home
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  +flex-direction(column)
  +screen(mobile)
    +justify-content(flex-start)
    padding-top: 10px
  .title
    +systemType(small)
    margin-bottom: 15px
  input
    margin-bottom: 15px
  .submit-button
    +button(false, false, $action_color)
  .content-box
    margin: 0 10px
    +screen(desktop)
      min-width: 500px
    +screen(tablet)
      min-width: 500px
    +screen(mobile)
      width: calc(100% - 20px)
    .content-header
      +screen(mobile)
        display: none


</style>
