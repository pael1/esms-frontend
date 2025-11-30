<template>
  <NuxtLayout>
    <notifications class="mt-24" />
    <NuxtPage />
  </NuxtLayout>

</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
useHead({
  link: [
    { rel: 'icon', type: 'image/png', href: '/images/logo2.png' }
  ]
})
</script>
