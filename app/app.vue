<script setup lang="ts">
import * as locales from "@nuxt/ui/locale";

type LocaleKey = keyof typeof locales;

const theMain = useMainStore();
const currentLocale = computed(() => {
  const key = theMain.locale as LocaleKey;
  return locales[key];
});
</script>

<template>
  <UApp :locale="currentLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
