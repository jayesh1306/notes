<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row :align="alignment" :justify="justify">
          <v-card class="pt-12 pl-12 pr-12 pb-12">
            <v-form ref="form" lazy-validation>
              <h1>Enter Code</h1>
              <br />
              <v-text-field v-model="code" label="Code" required></v-text-field>
              <v-btn :loading="loading" color="success" class="mr-12" @click="submit">Submit</v-btn>
            </v-form>
            <v-snackbar right v-model="snackbar">
              {{ message }}
              <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      alignment: "center",
      justify: "center",
      code: null,
      snackbar: false,
      message: null,
      loading: false
    };
  },
  methods: {
    onverify() {
      this.loading = true;
      this.$store
        .dispatch("verifyMobile", { code: this.code })
        .then(() => {
          this.snackbar = true;
          this.loading = true;
          this.message = "SUccessFUlly Verified Mobile";
          setTimeout(() => {
            this.snackbar = false;
            this.loading = false;
            this.message = null;
          }, 3000);
        })
        .catch(err => {
          this.snackbar = true;
          this.loading = true;
          this.message = err.message;
          setTimeout(() => {
            this.snackbar = false;
            this.loading = false;
            this.message = null;
          }, 3000);
        });
    }
  }
};
</script>