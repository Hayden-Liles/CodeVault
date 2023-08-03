<template>
  <header>
    <!-- <Navbar /> -->
  </header>
  <main>
    <router-view />
  </main>
  <footer class="sticky-bottom p-0 m-0">
  </footer>
</template>

<script>

export default {
  setup() {
    return {}
  },
  components: {  }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root {
  --main-height: calc(100vh - 50px - 64px);
}
</style>
