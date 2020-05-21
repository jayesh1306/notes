<template>
  <v-app>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>Notes Application</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group class="ml-3" active-class="deep-purple--text text--accent-4">
          <v-list-item v-if="auth" to="/user/dashboard">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item to="/notes">
            <v-list-item-title>Notes</v-list-item-title>
          </v-list-item>
          <v-list-item to="/contact">
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item>
          <v-list-item to="/about">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="auth" @click="onlogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!auth" to="/auth/login">
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!auth" to="/auth/register">
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false
  }),
  methods: {
    onlogout() {
      this.$store.dispatch("logout");
    }
  },
  computed: {
    auth() {
      return this.$store.getters.isAuthenticated;
    }
  }
};
</script>