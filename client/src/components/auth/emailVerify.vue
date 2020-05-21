<template>
  <div v-if="response">
    <v-snackbar v-model="snackbar">
      {{ message }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      response: false
    };
  },
  created() {
    this.$store
      .dispatch("emailVerify", { token: this.$route.params.token })
      .then(response => {
        console.log(response);
        console.log('done');
        
        this.snackbar = true;
        this.message = "Email Verified! Redirecting...";
        setTimeout(() => {
          this.snackbar = false;
          this.message = null;
        }, 3000);
      })
      .catch();
  }
};
</script>