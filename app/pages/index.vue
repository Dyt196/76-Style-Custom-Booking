<script lang="ts" setup>
import type { OutletConfigMain, TimeSlot } from "~/model/booking";
import type { Staff } from "~/model/staff";
import type { AllOutlet } from "~/model/custom";

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();
const shortname = computed(() => {
  return route.params.merchant
    ? route.params.merchant
    : (useRuntimeConfig().public.shortname as string);
});

const {
  data: apiData,
  pending: apiPending,
  error: apiError,
} = await useAsyncData("item", () =>
  getMerchantAllOutlet(shortname.value.toString()),
);

const shopDetail = ref(apiData.value?.shopDetail);
const outletList = ref(apiData.value ? apiData.value.outletList : []);

useSeoMeta({
  title: shopDetail.value ? shopDetail.value.name : "Tunai Pro",
  ogTitle: shopDetail.value ? shopDetail.value.name : "Tunai Pro",
  description: shopDetail.value
    ? shopDetail.value.about
    : "Tunai Pro Booking App",
  ogDescription: shopDetail.value
    ? shopDetail.value.about
    : "Tunai Pro Booking App",
});

useHead({
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: () => shopDetail.value?.icon || "/logo2.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "57x57",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-57x57.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "60x60",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-60x60.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "72x72",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-72x72.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "76x76",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-76x76.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-120x120.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-152x152.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: () => shopDetail.value?.icon || "/favicon/apple-icon-180x180.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      href: () => shopDetail.value?.icon || "/favicon/android-icon-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: () => shopDetail.value?.icon || "/favicon/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      href: () => shopDetail.value?.icon || "/favicon/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: () => shopDetail.value?.icon || "/favicon/favicon-16x16.png",
    },
  ],
});
onMounted(() => {});
</script>

<template>
  <div class="style-76 body-76">
    <section
      class="text-center font-bold text-2xl flex justify-center text-primary"
    >
      <div
        class="text-center pt-7 pb-5"
        style="border-bottom: var(--ui-primary) solid 2px; width: 50%"
      >
        The Stylists of {{ shopDetail?.name }}
      </div>
    </section>

    <section
      class="py-5 px-0 md:px-5 mx-12 grid grid-cols-1 md:grid-cols-3 gap-5"
    >
      <template
        v-for="(out, o) in outletList.sort(
          (a, b) => a.outlet.sortID - b.outlet.sortID,
        )"
        :key="o"
      >
        <SimpleOutlet :outlet="out" />
      </template>
    </section>
  </div>
</template>

<style>
.style-76 {
  --ui-primary: #281700;
  --ui-primary-light: rgb(40, 23, 0, 0.1);
  --ui-secondary: #cb9b2b;
  --ui-secondary-light: rgb(203, 155, 43, 0.1);
  --ui-error: #e74c3c;
  --ui-warning: #f39c12;
  --ui-success: #27ae60;
  --ui-info: #2980b9;

  --ui-error-light: rgb(231, 76, 60, 0.1);
  --ui-warning-light: rgb(243, 156, 18, 0.1);

  --ui-bg: #ddd8c5;
  --ui-bg-muted: #f8f6f2;
  --white-bg: #fff;

  --ui-text: #281700;
  --ui-text-highlighted: #000;
  --ui-text-muted: #888;

  --ui-disable: #888;
  --ui-disable-light: rgb(136, 136, 136, 0.1);

  --ui-border: #c6d8cd;

  --ui-accent: #e74c3c;
  --ui-shadow: rgba(0, 0, 0, 0.08);
}

.dark .style-76 {
  --ui-primary: #281700;
  --ui-primary-light: rgb(40, 23, 0, 0.1);
  --ui-secondary: #cb9b2b;
  --ui-secondary-light: rgb(203, 155, 43, 0.1);
  --ui-error: #e74c3c;
  --ui-warning: #f39c12;
  --ui-success: #27ae60;
  --ui-info: #2980b9;

  --ui-error-light: rgb(231, 76, 60, 0.1);
  --ui-warning-light: rgb(243, 156, 18, 0.1);

  --ui-bg: #ddd8c5;
  --ui-bg-muted: #f8f6f2;
  --white-bg: #fff;

  --ui-text: #281700;
  --ui-text-highlighted: #000;
  --ui-text-muted: #888;

  --ui-disable: #888;
  --ui-disable-light: rgb(136, 136, 136, 0.1);

  --ui-border: #c6d8cd;

  --ui-accent: #e74c3c;
  --ui-shadow: rgba(0, 0, 0, 0.08);
}

.body-76 {
  margin-top: 70px;
  background-color: var(--ui-bg);
  min-height: calc(100vh - 70px - 20px);
}
</style>
