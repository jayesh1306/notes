<template>
  <v-app>
    <Header></Header>
  </v-app>
</template>

<script>
import Header from "./components/layout/Header";

export default {
  name: "App",
  data: () => ({}),
  components: {
    Header
  },
  created() {
    this.$store.dispatch("autologin");
  }
};
</script>
