<script lang="ts" setup>
import type { OutletConfigMain } from "~/model/booking";
import type { AllOutlet } from "~/model/custom";
import type { Staff } from "~/model/staff";

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();
const shortname = computed(() => {
  return route.params.merchant ? route.params.merchant : "76STYLE";
});

const outletID = computed(() => {
  return route.params.outlet ? Number(route.params.outlet) : null;
});

const {
  data: apiData,
  pending: apiPending,
  error: apiError,
} = await useAsyncData("item", () =>
  getMerchantAllOutlet(shortname.value.toString(), outletID.value),
);

const shopDetail = ref(apiData.value?.shopDetail);
const outletList = ref(apiData.value ? apiData.value.outletList : []);
const shopSetup = computed<OutletConfigMain[]>(() => mainStore.outletSetup);
const selectedOutlet = ref<AllOutlet | null>(
  apiData.value ? apiData.value.theOutlet : null,
);

const selectedStaff = ref<Staff | null>(null);

const staffDialog = ref(false);
const bookDialog = ref(false);

function filterSetup(outletID: number): OutletConfigMain {
  const curSetup = shopSetup.value.find((out) => out.outletID == outletID);
  return curSetup
    ? curSetup
    : {
        outletID: outletID,
        timezone: "Asia/Singapore",
        config: {
          outletID: outletID,
          buffer: 7,
          futureInDays: 1,
          blockSlot: 1,
          disableOnline: 0,
          depositAmount: 0,
          intervals: 15,
          displayHour: "",
          anystaff: 0,
          deposit: 0,
        },
        blocks: [],
      };
}

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

function openStaff(stf: Staff, out: AllOutlet) {
  // selectedOutlet.value = out;
  selectedStaff.value = stf;
  staffDialog.value = true;
}

function succesBook(uuid: string) {
  bookDialog.value = false;
  // console.info("Link", `/${shortname.value}/book-${id}`);
  if (
    selectedOutlet.value &&
    filterSetup(selectedOutlet.value.outlet.outletID).config.deposit == 0
  ) {
    router.push(`/booking-${uuid}`);
  } else {
    router.push(`/booking-${uuid}`);
  }
}
onMounted(() => {
  if (outletID.value == null) {
    router.push(`/`);
  }

  if (selectedOutlet.value) {
    if (selectedOutlet.value.outlet.outletID != outletID.value) {
      if (outletList.value) {
        let theOutlet = outletList.value.filter(
          (val) => val.outlet.outletID == outletID.value,
        );
        if (theOutlet.length > 0 && theOutlet[0]) {
          selectedOutlet.value = theOutlet[0];
        }
      }
    }
  }
});
</script>

<template>
  <div class="body-76 style-76">
    <section
      class="text-center font-bold text-2xl flex justify-center text-primary"
    >
      <div
        class="text-center pt-7 pb-5"
        style="border-bottom: var(--ui-primary) solid 2px; width: 50%"
      >
        Choose Your Stylist
      </div>
    </section>

    <section
      class="py-5 px-0 md:px-5 mx-12 flex flex-col gap-5"
      v-if="selectedOutlet"
    >
      <CardOutlet
        :outlet="selectedOutlet"
        :outlet-setup="filterSetup(selectedOutlet.outlet.outletID)"
        @open-staff="openStaff($event, selectedOutlet)"
      />
    </section>
  </div>

  <UModal
    v-model:open="staffDialog"
    title="Staff Detail"
    class="md:max-w-screen md:w-[55vw]"
  >
    <template #content>
      <StaffDialog
        :staff="selectedStaff!"
        :outlet="selectedOutlet!.outlet"
        @close-dialog="staffDialog = false"
        @open-booking="
          staffDialog = false;
          bookDialog = true;
        "
      />
    </template>
  </UModal>

  <UModal
    v-model:open="bookDialog"
    title="Book Menu"
    class="md:max-w-screen md:w-[55vw]"
    :dismissible="false"
  >
    <template #content>
      <BookMain
        :outlet-list="outletList"
        :selected-outlet="selectedOutlet"
        :selected-staff="selectedStaff"
        @close-dialog="bookDialog = false"
        @success-book="succesBook"
      />
    </template>
  </UModal>
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
