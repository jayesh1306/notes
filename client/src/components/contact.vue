<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Contact form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="name" label="Name" name="Name" type="text"></v-text-field>
              <v-text-field v-model="email" label="Email" name="Email" type="text"></v-text-field>
              <v-text-field v-model="contact" label="Contact" name="Contact" type="text"></v-text-field>
              <v-text-field v-model="message" id="message" label="Message" name="message"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="onsubmit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    source: String
  },
  data() {
    return {
      name: null,
      email: null,
      contact: null,
      message: null
    };
  },
  methods: {
    onsubmit() {
      this.$store.dispatch("contact", {
        name: this.name,
        email: this.email,
        message: this.message,
        contact: this.contact
      });
    }
  }
};
</script>