<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row :align="alignment" :justify="justify">
          <v-card class="pt-12 pl-12 pr-12 pb-12">
            <v-form ref="form" lazy-validation>
              <h1>Register Here</h1>
              <br />
              <v-text-field v-model="email" label="E-mail" required></v-text-field>
              <v-text-field v-model="contact" label="Contact" required></v-text-field>
              <v-select :items="items" v-model="gender" label="Gender" required></v-select>
              <v-text-field v-model="name" label="Name" required></v-text-field>
              <v-text-field v-model="password" label="Password" required></v-text-field>
              <v-text-field v-model="password1" label="Confirm Password" required></v-text-field>
              <v-btn :loading="loading" color="success" class="mr-12" @click="onregister">Register</v-btn>
              <v-btn color="error" class="ml-12" to="/auth/login">Already Have Account ?</v-btn>
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
      items: ["Male", "Female"],
      gender: null,
      email: "prajapatijayesh.beis.16@acharya.ac.in",
      password: "admin123",
      password1: "admin123",
      contact: "7778885111",
      name: "Jayesh Prajapati",
      message: null,
      snackbar: false,
      loading: false,
    };
  },
  methods: {
    async onregister() {
      if (
        !this.email ||
        !this.password ||
        !this.name ||
        !this.gender ||
        !this.password1 ||
        !this.contact
      ) {
        this.snackbar = true;
        this.message = "All FIelds are required";
        setTimeout(() => {
          this.message = null;
          this.snackbar = false;
        }, 3000);
      } else {
        this.loading = true;
        this.$store
          .dispatch("register", {
            email: this.email,
            password1: this.password,
            contact: this.contact,
            gender: this.gender == "Male" ? 1 : 0,
            name: this.name
          })
          .then(() => {
            this.snackbar = true;
            this.loading = false;
            this.message = "Successfully Registered";
            this.$router.push("/auth/verifyMobile");
          })
          .catch(err => {
            this.loading = false;
            this.snackbar = true;
            this.message = err.message;
            setTimeout(() => {
              this.snackbar = false;
              this.message = null;
            }, 3000);
          });
      }
    },
    reset() {
      this.email = null;
      this.password1 = null;
      this.name = null;
      this.contact = null;
      this.gender = null;
    }
  }
};
</script>       

<style scoped>
.red {
  color: red;
}
</style>