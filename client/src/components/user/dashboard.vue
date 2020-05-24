<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row :align="alignment" :justify="justify">
          <v-card :loading="loading" class="mx-auto" max-width="434" tile>
            <v-img height="100%" src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg">
              <v-row align="end" class="fill-height">
                <v-col align-self="start" class="pa-0" cols="12">
                  <v-avatar class="profile" color="grey" size="164" tile>
                    <v-img :src="user.profile"></v-img>
                  </v-avatar>
                </v-col>
                <v-col class="py-0">
                  <v-list-item color="rgba(0, 0, 0, .4)" dark>
                    <v-list-item-content>
                      <v-list-item-title class="title">{{user.name}}</v-list-item-title>
                      <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{user.contact}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-img>
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
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>