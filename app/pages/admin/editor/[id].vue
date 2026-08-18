<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const route = useRoute()
const articleId = route.params.id as string
</script>

<template>
  <AdminArticleEditor :article-id="articleId" />
</template>
