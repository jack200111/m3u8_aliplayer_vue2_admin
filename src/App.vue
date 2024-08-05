<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,
body,
#app {
	/* width: 100%; */
	/* height: 100%; */
	/* min-width: 1300px; */
	/* min-height: 100%; */
  height: 100vh;
}
.app-main{
  /* padding: 10px; */
}
.el-card{
  margin-bottom: 10px;
}
</style>
