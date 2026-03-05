<script lang="ts" setup>
import {
  type BookStep,
  type ConfirmBooking,
  type OutletConfigMain,
} from "~/model/booking";
import type { AllOutlet } from "~/model/custom";
import type { Staff } from "~/model/staff";
import type { MenuItem } from "~/model/service";
import MainOutlet from "./MainOutlet.vue";
import MainStaff from "./MainStaff.vue";
import MainService from "./MainService.vue";
import MainDate from "./MainDate.vue";
import MainDetail from "./MainDetail.vue";
import type { InputError } from "~/model/general";
import MainConfirm from "./MainConfirm.vue";

const props = defineProps<{
  outletList: AllOutlet[];
  selectedStaff?: Staff | null;
  selectedOutlet?: AllOutlet | null;
}>();

const emits = defineEmits(["closeDialog", "successBook"]);

const mainStore = useMainStore();
const mainLoading = ref(false);
const confirmDialog = ref(false);
const toast = useToast();

const selectedOutlet = ref(props.selectedOutlet ? props.selectedOutlet : null);
const selectedStaff = ref(props.selectedStaff ? props.selectedStaff : null);
const selectedService = ref<MenuItem[]>([]);
const selectedDate = ref<number | null>(null);
const bookingDetail = ref<ConfirmBooking>({
  mobile: null,
  name: "",
  email: "",
  note: "",
});
const hasError = ref<InputError>({
  hasError: false,
  errorMessage: "",
});

const currStep = ref(3);

const bookStep = computed<BookStep[]>(() => {
  return [
    {
      order: 1,
      label: "Select Outlet",
      short: "Outlet",
      code: "OUT",
      condition: false,
      nextCondition: selectedOutlet.value != null,
      page: MainOutlet,
      props: {
        outletList: props.outletList,
        selectedOutlet: selectedOutlet.value,
        onSelectOutlet: selectOutlet,
      },
    },
    {
      order: 2,
      label: "Select Stylist",
      short: "Stylist",
      code: "STF",
      condition: selectedOutlet.value == null,
      nextCondition: selectedStaff.value != null,
      page: MainStaff,
      props: {
        staffList: selectedOutlet.value ? selectedOutlet.value.staffList : [],
        selectedStaff: selectedStaff.value,
        onSelectStaff: selectStaff,
      },
    },
    {
      order: 3,
      label: "Select Service",
      short: "Service",
      code: "SVC",
      condition: selectedStaff.value == null,
      nextCondition: selectedService.value.length > 0,
      page: MainService,
      props: {
        serviceList: selectedOutlet.value
          ? selectedOutlet.value.serviceList
          : [],
        selectedStaff: selectedStaff.value,
        selectedService: selectedService.value,
        onSelectService: selectService,
      },
    },
    {
      order: 4,
      label: "Select Date & Time",
      short: "Date & Time",
      code: "DTE",
      condition: selectedService.value.length == 0,
      nextCondition: selectedDate.value != null,
      page: MainDate,
      props: {
        selectedStaff: selectedStaff.value,
        selectedService: selectedService.value,
        selectedTime: selectedDate.value,
        outletSetup: outletSetup.value,
        onSelectDate: selectDate,
      },
    },
    {
      order: 5,
      label: "Enter Your Details",
      short: "Detail",
      code: "DET",
      condition: selectedDate.value == null,
      nextCondition:
        !hasError.value.hasError && bookingDetail.value.name.trim() != "",
      page: MainDetail,
      props: {
        bookingDetail: bookingDetail.value,
        onUpdateDetail: (theVal: {
          detail: ConfirmBooking;
          mobiError: InputError;
          emailError: InputError;
        }) => {
          if (
            theVal.mobiError.hasError ||
            theVal.detail.name.trim() == "" ||
            theVal.emailError.hasError
          ) {
            hasError.value.hasError = true;
          } else {
            hasError.value.hasError = false;
          }
          bookingDetail.value = theVal.detail;
        },
      },
    },
    {
      order: 6,
      label: "Booking Details",
      short: "Confirm",
      code: "CFM",
      condition:
        hasError.value.hasError && bookingDetail.value.name.trim() == "",
      nextCondition: false,
      page: MainConfirm,
      props: {
        outlet: selectedOutlet.value,
        staff: selectedStaff.value,
        service: selectedService.value,
        dateTime: selectedDate.value,
        bookingDetail: bookingDetail.value,
        onChangeItem: changeStep,
      },
    },
  ];
});

const outletSetup = computed(() => {
  const curSetup = mainStore.outletSetup.find(
    (out) => out.outletID == selectedOutlet.value?.outlet.outletID,
  );
  return curSetup
    ? curSetup
    : {
        outletID: selectedOutlet.value
          ? selectedOutlet.value.outlet.outletID
          : 0,
        timezone: "Asia/Singapore",
        config: {
          outletID: selectedOutlet.value
            ? selectedOutlet.value.outlet.outletID
            : 0,
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
});

function selectOutlet(outlet: AllOutlet) {
  if (selectedOutlet.value?.outlet.outletID != outlet.outlet.outletID) {
    selectedOutlet.value = outlet;
    selectedStaff.value = null;
    selectedService.value = [];
    selectedDate.value = null;
  }
}

function selectStaff(staff: Staff) {
  if (selectedStaff.value?.staffID != staff.staffID) {
    selectedStaff.value = staff;
    selectedService.value = [];
    selectedDate.value = null;
  }
}

function selectDate(date: number) {
  // console.log("I am Selected", date);
  selectedDate.value = date;
}

function selectService(service: MenuItem) {
  selectedService.value = [];
  selectedService.value.push(service);

  // const serviceAvail = selectedService.value.filter(
  //   (serv) => serv.skuID == service.skuID,
  // );
  // if (serviceAvail.length == 0) {
  //   selectedService.value.push(service);
  // } else {
  //   selectedService.value = selectedService.value.filter(
  //     (serv) => serv.skuID != service.skuID,
  //   );
  // }
}

function changeStep(step: number) {
  currStep.value = step;
}

function showLabel(step: number) {
  const theStep = bookStep.value.find((stp) => stp.order == step);
  return theStep ? theStep.label : "N/A";
}

function closeDialog() {
  emits("closeDialog");
}

async function createAppointment() {
  if (
    selectedOutlet.value &&
    selectedDate.value &&
    selectedStaff.value &&
    selectedService.value.length > 0
  ) {
    mainLoading.value = true;

    const sendApi = await sendBooking(
      selectedOutlet.value.outlet.outletID,
      selectedDate.value,
      selectedStaff.value.staffID,
      selectedService.value?.[0]?.skuID ?? 0,
      selectedService.value.reduce((sum, item) => sum + item.duration, 0),
      bookingDetail.value,
      selectedService.value,
      0,
    );
    confirmDialog.value = false;
    mainLoading.value = false;
    // console.info("Response Book: ", sendApi);
    if (sendApi.result == 1) {
      emits("successBook", sendApi.uuid);
      toast.add({
        title: $t("landingPage.appointCreated"),
        color: "success",
      });
    } else {
      toast.add({
        title: $t("landingPage.somethingWrong"),
        color: "warning",
      });
    }
  } else {
    toast.add({
      title: `Missing Data: ${selectedOutlet.value ?? "No Outlet Recorded"}${selectedService.value ?? " No Service Recorded"}${selectedStaff.value ?? " No Staff Recorded"}${selectedDate.value ?? " No Date Recorded"}`,
    });
  }
}

onMounted(() => {
  if (props.selectedStaff && props.selectedOutlet) {
    currStep.value = 3;
  } else if (props.selectedStaff == null) {
    currStep.value = 2;
  } else {
    currStep.value = 1;
  }
});
</script>

<template>
  <div
    class="w-full h-auto p-2 flex flex-col style-76"
    style="
      background-color: var(--ui-bg);
      color: var(--ui-primary);
      border-radius: 10px;
      border: var(--ui-border);
      box-shadow: 1px 2px 2px var(--ui-border);
    "
  >
    <div class="flex items-start">
      <div>
        <div
          :class="`flex items-center justify-center w-[30px] h-[30px] md:w-[45px] md:h-[45px] p-2 hover:cursor-pointer ${currStep == 1 ? 'invisible' : ''}`"
          style="
            color: var(--white-bg);
            background-color: var(--ui-primary);
            border-radius: 50%;
          "
          @click="
            if (currStep > 1) {
              currStep--;
            }
          "
        >
          <u-icon
            name="heroicons:chevron-left"
            style="height: 100%; width: 100%"
          />
        </div>
      </div>
      <div
        class="text-center pb-5 pt-4 mx-5 flex-1 text-xl font-bold"
        style="border-bottom: var(--ui-primary) solid 2px; width: 50%"
      >
        {{ showLabel(currStep) }}
      </div>
      <div>
        <div
          class="flex items-center w-[30px] h-[30px] md:w-[45px] md:h-[45px] justify-center p-2 hover:cursor-pointer"
          style="
            color: var(--white-bg);
            background-color: var(--ui-primary);
            border-radius: 50%;
          "
          @click="closeDialog()"
        >
          <u-icon
            name="heroicons:x-mark-solid"
            style="height: 100%; width: 100%"
          />
        </div>
      </div>
    </div>
    <div class="h-[60vh] max-h[60vh] max-w-full w-full px-5 py-3">
      <component
        class="w-full h-full"
        :is="bookStep[currStep - 1]?.page"
        v-bind="bookStep[currStep - 1]?.props"
      />
    </div>

    <div class="w-full">
      <u-button
        v-if="currStep < 6"
        style="
          border-radius: 25px;
          background-color: var(--ui-primary);
          color: var(--white-bg);
          width: 100%;
        "
        class="cursor-pointer"
        @click="currStep++"
        :disabled="!bookStep[currStep - 1]?.nextCondition"
      >
        <div class="flex w-full font-bold text-lg items-center justify-center">
          Next
        </div>
      </u-button>
      <u-button
        v-if="currStep == 6"
        style="
          border-radius: 25px;
          background-color: var(--ui-primary);
          color: var(--white-bg);
          width: 100%;
        "
        class="cursor-pointer"
        @click="createAppointment()"
      >
        <div class="flex w-full font-bold text-lg items-center justify-center">
          Confirm
        </div>
      </u-button>
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
</style>
