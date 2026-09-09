<template>
  <main>
    <button v-if="!show" @click="show = true">click me</button>
    <p v-if="show">Hello ! Im Instinct and Im Awesome!</p>
  </main>
</template>

<script setup>
const show = ref(false)
</script>
