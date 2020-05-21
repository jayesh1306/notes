<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row :align="alignment" :justify="justify">
          <v-card class="pt-12 pl-12 pr-12 pb-12">
            <v-form ref="form" lazy-validation>
              <h1>Login Here</h1>
              <br />
              <v-text-field v-model="email" label="E-mail" required></v-text-field>
              <v-text-field v-model="password" label="Password" required></v-text-field>

              <v-btn
                :disabled="disable"
                :loading="loading"
                color="success"
                class="mr-12"
                @click="onlogin"
              >Login</v-btn>

              <v-btn color="error" class="ml-12 right" @click="reset">Forgot Password ?</v-btn>
            </v-form>
            <v-snackbar v-model="snackbar">
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
      email: "prajapatijayesh.beis.16@acharya.ac.in",
      password: "admin123",
      message: null,
      snackbar: false,
      loading: false
    };
  },
  computed: {
    disable() {
      return !this.email || !this.password;
    }
  },
  methods: {
    async onlogin() {
      this.loading = true;
      if (!this.email && !this.password) {
        this.message = "All Fields are Required";
        setTimeout(() => {
          this.message = null;
        }, 3000);
      } else {
        this.$store
          .dispatch("login", {
            username: this.email,
            password: this.password
          })
          .catch(err => {
            this.loading = false;
            this.snackbar = true;
            this.message = err.message;
          });
      }
    },
    reset() {
      this.email = null;
      this.password = null;
    }
  }
};
</script>       