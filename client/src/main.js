import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@babel/polyfill";
import vuetify from "./plugins/vuetify";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: `http://localhost:4000/graphql`,
  // include auth token eith requests mabe to backend
  fetchOptions: {
    credentials: "include",
  },
  request: (operation) => {
    // operation adds the token to an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token") || "",
      },
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
      }
    }
  },
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    // execute getCurrentUser query on application initial load
    this.$store.dispatch("getCurrentUser");
  },
}).$mount("#app");
