<script setup lang="ts">
import type { Appointment } from "~/model/booking";
import { format } from "date-fns";
import type { MenuItem } from "~/model/service";
import type { Staff } from "~/model/staff";
import type { Outlet } from "~/model/merchant";

const route = useRoute();
const router = useRouter();
const bookStore = useBookStore();
const mainStore = useMainStore();
const toast = useToast();

const nowTime = ref(Date.now());
function filterDate(formString: string, dateTime: number) {
  return format(dateTime, formString);
}

const buttonLoad = ref(false);

const shortname = computed(() => {
  return route.params.merchant ? route.params.merchant : "";
});
const outletId = computed(() => {
  return route.query.outletID ? route.query.outletID : null;
});
const bookId = computed(() => {
  return route.params.bookId ? route.params.bookId : 0;
});

function goToMain() {
  buttonLoad.value = true;
  if (selectedOutlet.value) {
    router.push(`/`);
  } else {
    router.push(`/`);
  }
}

const shopDetail = computed(() => {
  return mainStore.sessionData?.shop;
});
const bookDetail = computed<Appointment | null>(() => {
  if (bookId.value == 0) {
    return null;
  }
  const searchBook = bookStore.bookingDetail.find(
    (book) => book.identifier == bookId.value,
  );

  return searchBook ? searchBook : null;
});

const serviceList = ref<MenuItem[]>([]);
const staffList = ref<Staff[]>([]);

const selectedStaff = computed<Staff | null>(() => {
  if (bookDetail.value == null) {
    return null;
  }

  const searchStaff = staffList.value.find(
    (stf) => stf.staffID == bookDetail.value?.staff.staffID,
  );

  return searchStaff ? searchStaff : null;
});

const newSelectedService = computed<MenuItem[]>(() => {
  if (bookDetail.value != null && bookDetail.value.bookExtra) {
    return bookDetail.value.bookExtra.service;
  }
  return [];
});

const selectedOutlet = computed<Outlet | null>(() => {
  const theOutlet = mainStore.outletList.find(
    (out) => out.outletID == bookDetail.value?.outletID,
  );
  return theOutlet ? theOutlet : null;
});

function openMap() {
  if (selectedOutlet.value?.social.webGoogleMap) {
    window.open(selectedOutlet.value.social.webGoogleMap, "_blank");
  } else {
    toast.add({
      title: "No Map Link Recorded",
    });
  }
}

onMounted(async () => {
  if (mainStore.sessionData == null) {
    await getMerchantDetail(shortname.value.toString(), Number(outletId.value));
  }

  if (bookDetail.value) {
    const outletAPi = await changeOutlet(bookDetail.value.outletID);
    serviceList.value = outletAPi.serviceList;
    staffList.value = outletAPi.staffList;
  } else {
    goToMain();
  }
});
</script>

<template>
  <div class="body-76 style-76 h-full flex flex-col items-center gap-5">
    <div class="pt-10 text-primary flex flex-col items-center gap-5">
      <icon name="heroicons:check-circle" style="width: 100px; height: 100px" />
      <div class="text-2xl font-bold">Booking Complete!</div>
      <div class="flex flex-col gap-1">
        <div class="px-5 text-lg font-bold">Booking Details</div>
        <div class="demo-card w-[90vw] md:w-[40vw] p-3 flex flex-col gap-3">
          <div class="flex items-start gap-3">
            <div class="flex-1 flex flex-col">
              <div class="text-muted font-bold">Outlet</div>
              <div class="font-bold">{{ selectedOutlet?.location.name }}</div>
            </div>
            <u-separator orientation="vertical" />
            <div class="flex-1 flex flex-col">
              <div class="text-muted font-bold">Stylist</div>
              <div class="font-bold">{{ bookDetail?.staff.name }}</div>
            </div>
          </div>
          <u-separator />
          <div class="flex flex-col">
            <div class="text-muted font-bold">Service</div>
            <template v-for="(svc, s) in newSelectedService" :key="s">
              <div class="font-bold">{{ svc.name }}</div>
            </template>
          </div>
          <u-separator />
          <div class="flex items-start gap-3">
            <div class="flex-1 flex flex-col">
              <div class="text-muted font-bold">Date</div>
              <div class="font-bold md:block hidden">
                {{
                  filterDate(
                    "EEEE, dd MMMM yyyy",
                    bookDetail ? bookDetail.arrivalDate * 1000 : 0,
                  )
                }}
              </div>
              <div class="font-bold md:hidden">
                {{
                  filterDate(
                    "EEEE",
                    bookDetail ? bookDetail.arrivalDate * 1000 : 0,
                  )
                }}
              </div>
              <div class="font-bold md:hidden">
                {{
                  filterDate(
                    "dd MMMM yyyy",
                    bookDetail ? bookDetail.arrivalDate * 1000 : 0,
                  )
                }}
              </div>
            </div>
            <u-separator orientation="vertical" />
            <div class="flex-1 flex flex-col">
              <div class="text-muted font-bold">Time</div>
              <div class="font-bold">
                {{
                  filterDate(
                    "hh:mm a",
                    bookDetail ? bookDetail.arrivalDate * 1000 : 0,
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="px-5 text-lg font-bold">Your Details</div>
        <div class="demo-card w-[90vw] md:w-[40vw] p-3 flex flex-col gap-3">
          <div class="flex items-start gap-3">
            <div class="flex-1 flex flex-col">
              <div class="text-muted font-bold">Name</div>
              <div class="font-bold">{{ bookDetail?.member?.name }}</div>
            </div>
            <u-separator orientation="vertical" />
            <div class="flex-1 flex flex-col">
              <div class="text-muted font-bold">Phone Number</div>
              <div class="font-bold">+{{ bookDetail?.member?.mobile }}</div>
            </div>
          </div>
          <u-separator />
          <div class="flex flex-col">
            <div class="text-muted font-bold">Email Address</div>
            <div class="font-bold">{{ bookDetail?.member?.email }}</div>
          </div>
          <u-separator />
          <div class="flex flex-col">
            <div class="text-muted font-bold">Booking Notes</div>
            <div class="font-bold">
              {{
                bookDetail?.bookExtra?.note
                  ? bookDetail?.bookExtra?.note
                  : "No Notes"
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-center text-primary w-[90vw] md:w-[50vw]">
        For any enquiries about your appointment, please contact the respective
        branch via WhatsApp: {{ selectedOutlet?.city.name }}:
        <a
          v-if="selectedOutlet?.social.whatsapp"
          :href="selectedOutlet.social.whatsapp"
          class="cursor-pointer underline hover:text-secondary"
          target="_blank"
          >+{{ selectedOutlet?.contact }}
        </a>
        <span v-else>+{{ selectedOutlet?.contact }}</span>
      </div>
      <div class="w-[90vw] md:w-[40vw] mb-2">
        <u-button
          style="
            border-radius: 25px;
            background-color: var(--ui-primary);
            color: var(--white-bg);
            width: 100%;
          "
          class="cursor-pointer"
          @click="goToMain()"
        >
          <div
            class="flex w-full font-bold text-lg items-center justify-center"
          >
            Back To Home
          </div>
        </u-button>
      </div>
    </div>
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
}

.demo-picker {
  border-radius: 10px;
  border: 1px solid var(--ui-text-muted);
  background: var(--white-bg);
  color: var(--ui-primary);
}

.demo-card {
  border-radius: 10px;
  border: 1px solid var(--ui-text-muted);
  background: var(--white-bg);
  color: var(--ui-primary);
}

.demo-picker:hover {
  cursor: pointer;
  background: var(--ui-bg-muted);
}

.demo-picker.picked {
  background: var(--ui-primary);
  color: var(--white-bg);
}

.demo-picker.disabled {
  /* background: var(--demo-grey); */
  color: var(--ui-text-muted);
}

.demo-picker.disabled:hover {
  cursor: not-allowed;
  background: var(--white-bg);
  color: var(--ui-text-muted);
}

.demo-posi-text {
  color: var(--ui-text-muted);
}

.demo-picker.picked .demo-posi-text {
  color: var(--ui-secondary);
}

.demo-chip {
  border-radius: 50px;
  color: var(--ui-primary);
}

.demo-chip:hover {
  background: var(--ui-bg-muted);
}

.demo-chip.picked {
  color: var(--white-bg);
  background: var(--ui-primary);
}
</style>
