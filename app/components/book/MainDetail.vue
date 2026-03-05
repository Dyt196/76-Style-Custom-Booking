<script lang="ts" setup>
import type { ConfirmBooking } from "~/model/booking";
import type { InputError } from "~/model/general";
import { mobileCodeList } from "~/model/fixedData";

const props = defineProps<{
  bookingDetail: ConfirmBooking;
}>();

const emit = defineEmits(["updateDetail"]);

const name = ref(props.bookingDetail.name);

const email = ref(props.bookingDetail.email ? props.bookingDetail.email : "");

const mobile = ref(
  props.bookingDetail.mobile ? props.bookingDetail.mobile : 60,
);

const note = ref(props.bookingDetail.note);

const selectedCode = ref<{
  code: number | null;
  label: string;
  country: string;
  regex: RegExp;
  icon: string;
}>({
  code: 60,
  label: "MY +60",
  country: "Malaysia",
  regex:
    /^(60)1(([1](-|\s)?\d{8})|([04](-|\s)?\d{7,8})|([236-9](-|\s)?\d{7}))$/,
  icon: "circle-flags:lang-ms",
});
const mobileHasError = computed<InputError>(() => {
  const checked = mobiCheck.value;
  return {
    hasError: !checked,
    errorMessage: !checked ? $t("landingPage.invalidMobile") : "None",
  };
});

const mobiCheck = computed(() =>
  selectedCode.value.regex.test(mobile.value.toString()),
);
const nameHasError = ref<InputError>({
  hasError: false,
  errorMessage: "",
});
const emailHasError = ref<InputError>({
  hasError: false,
  errorMessage: "",
});

function emailInput() {
  const rgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const theEmail = email.value.trim();
  if (email.value) {
    const isEmail = rgx.test(theEmail);
    emailHasError.value = {
      hasError: !isEmail,
      errorMessage: !isEmail ? $t("landingPage.invalidEmail") : "None",
    };
  } else {
    emailHasError.value.hasError = true;
    emailHasError.value.errorMessage = $t("landingPage.requiredField");
  }
  sendInput();
}

const codeAvail = ref<
  {
    code: number | null;
    label: string;
    country: string;
    regex: RegExp;
    icon: string;
  }[]
>(mobileCodeList);

function sendInput() {
  let dataToSend: ConfirmBooking = {
    name: name.value,
    note: note.value,
    mobile: mobile.value,
    email: email.value,
  };
  nameHasError.value = {
    hasError: name.value.trim() == "",
    errorMessage: $t("landingPage.requiredField"),
  };
  emit("updateDetail", {
    detail: dataToSend,
    mobiError: mobileHasError.value,
    emailError: emailHasError.value,
  });
}

function mobileInput(mobi: number) {
  const checkForCode = codeAvail.value.find((numb) =>
    numb.code ? mobi.toString().indexOf(numb.code.toString()) == 0 : false,
  );
  if (checkForCode) {
    selectedCode.value = checkForCode;
  } else {
    selectedCode.value = {
      code: null,
      label: "Other +",
      country: "Other",
      regex: /^\d{5,15}$/,
      icon: "circle-flags:lang-xx",
    };
  }

  // const checked = selectedCode.value.regex.test(mobi.toString());
  // mobileHasError.value = {
  //   hasError: !checked,
  //   errorMessage: !checked ? $t("landingPage.invalidMobile") : "None",
  // };
  sendInput();
}

function changeCode(codVal: {
  code: number | null;
  label: string;
  country: string;
  regex: RegExp;
  icon: string;
}) {
  if (selectedCode.value.code != codVal.code) {
    selectedCode.value = codVal;
    if (codVal.code) {
      mobile.value = codVal.code;
    }
  }
}

const openPop = ref(false);
const openDia = ref(false);
</script>

<template>
  <div class="w-full p-2 max-w-full h-full max-h-full flex flex-col">
    <div
      class="flex-1 flex flex-col gap-3 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
    >
      <div class="w-full flex flex-col gap-0">
        <div class="text-primary font-bold text-lg px-2 flex items-end">
          <div class="flex-1">Name *</div>
          <div class="text-error text-xs" v-show="nameHasError.hasError">
            {{ nameHasError.errorMessage }}
          </div>
        </div>
        <div class="w-full">
          <u-input
            v-model="name"
            class="w-full"
            variant="outline"
            color="secondary"
            @update:model-value="sendInput"
            style="
              background-color: var(--white-bg);
              font-size: 16px;
              border-radius: 10px;
              height: 50px;
              color: var(--ui-primary);
            "
          />
        </div>
      </div>
      <div class="w-full flex flex-col gap-0">
        <div class="text-primary font-bold text-lg px-2 flex items-end">
          <div class="flex-1">Phone Number *</div>
          <div class="text-error text-xs" v-show="mobileHasError.hasError">
            {{ mobileHasError.errorMessage }}
          </div>
        </div>
        <div class="w-full flex items-center gap-1">
          <div class="md:hidden">
            <u-button
              :icon="selectedCode.icon"
              class="gen-btn p-0"
              @click="openDia = true"
            />
          </div>
          <u-popover
            v-model:open="openPop"
            class="hidden md:flex"
            :content="{
              align: 'start',
              side: 'bottom',
            }"
          >
            <u-button :icon="selectedCode.icon" class="gen-btn p-0" />
            <template #content>
              <div
                class="flex flex-col h-60 overflow-y-auto main-hide-scrollbar whitespace-nowrap scroll-smooth touch-pan-y"
                style="background-color: var(--white-bg); border-radius: 10px"
              >
                <template v-for="valCod in codeAvail">
                  <div
                    class="p-1 flex gap-2 items-center text-sm font-semibold cursor-pointer hover:bg-muted"
                    @click="
                      selectedCode = valCod;
                      mobile = valCod.code ? valCod.code : 0;
                      openPop = false;
                    "
                  >
                    <u-icon :name="valCod.icon" />
                    <div>
                      {{ valCod.country }}
                    </div>
                  </div>
                  <u-separator />
                </template>
              </div>
            </template>
          </u-popover>
          +
          <u-input
            class="flex-1"
            v-model="mobile"
            @update:model-value="mobileInput(mobile)"
            variant="outline"
            color="secondary"
            style="
              background-color: var(--white-bg);
              font-size: 16px;
              border-radius: 10px;
              height: 50px;
              color: var(--ui-primary);
            "
          />
        </div>
      </div>
      <div class="w-full flex flex-col gap-0">
        <div class="text-primary font-bold text-lg px-2 flex items-end">
          <div class="flex-1">Email Address *</div>
          <div class="text-error text-xs" v-show="emailHasError.hasError">
            {{ emailHasError.errorMessage }}
          </div>
        </div>
        <div class="w-full">
          <u-input
            v-model="email"
            class="w-full"
            variant="outline"
            color="secondary"
            @update:model-value="emailInput"
            style="
              background-color: var(--white-bg);
              font-size: 16px;
              border-radius: 10px;
              color: var(--ui-primary);
              height: 50px;
            "
          />
        </div>
      </div>
      <div class="w-full flex flex-col gap-0">
        <div class="text-primary font-bold text-lg px-2">
          Booking Notes (Optional)
        </div>
        <div class="w-full">
          <u-textarea
            v-model="note"
            autoresize
            color="secondary"
            variant="outline"
            class="w-full"
            @update:model-value="sendInput"
            style="
              background-color: var(--white-bg);
              font-size: 16px;
              border-radius: 10px;
              color: var(--ui-primary);
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
