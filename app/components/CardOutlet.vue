<template>
  <div
    class="w-full p-3 text-primary"
    style="
      background-color: var(--white-bg);
      border-radius: 10px;
      border: var(--ui-border);
      box-shadow: 1px 2px 2px var(--ui-border);
    "
  >
    <div class="w-full md:hidden">
      <div
        style="border-radius: 10px; aspect-ratio: 14/9"
        class="overflow-hidden w-full"
      >
        <img
          v-if="outlet.outlet.sliders[0]"
          :src="outlet.outlet.sliders[0].image"
          style="object-fit: cover; height: 100%; width: 100%"
        />
      </div>
    </div>
    <div class="flex gap-3 w-full h-auto md:max-h-[200px] md:h-[200px]">
      <div
        style="border-radius: 10px; aspect-ratio: 14/9"
        class="overflow-hidden h-full hidden md:block"
      >
        <img
          v-if="outlet.outlet.sliders[0]"
          :src="outlet.outlet.sliders[0].image"
          style="object-fit: cover; height: 100%; width: 100%"
        />
      </div>
      <div class="flex flex-col gap-3 text-sm w-full pt-5 md:pt-0 md:w-[30%]">
        <div class="text-xl font-bold w-full">
          {{ outlet.outlet.location.name }}
        </div>
        <div class="flex gap-2 items-start w-full">
          <div>
            <icon name="heroicons:map-pin" style="width: 20px; height: 20px" />
          </div>
          <div class="flex flex-1 flex-col gap-0">
            <div v-show="outlet.outlet.location.address1">
              {{ outlet.outlet.location.address1 }}
            </div>
            <div v-show="outlet.outlet.location.address2">
              {{ outlet.outlet.location.address2 }}
            </div>
            <div v-show="outlet.outlet.location.address3">
              {{ outlet.outlet.location.address3 }}
            </div>
            <div v-show="outlet.outlet.location.address4">
              {{ outlet.outlet.location.address4 }}
            </div>
          </div>
        </div>
        <div
          v-show="outletSetup.config.displayHour"
          class="flex gap-2 items-center w-full"
        >
          <icon name="heroicons:clock" style="width: 20px; height: 20px" />
          <div>{{ outletSetup.config.displayHour }}</div>
        </div>
        <div class="flex gap-8 items-center w-full">
          <div v-show="outlet.outlet.contact" class="flex gap-2 items-center">
            <icon name="heroicons:phone" style="width: 20px; height: 20px" />
            <div>+{{ outlet.outlet.contact }}</div>
          </div>
          <a
            v-show="outlet.outlet.social.whatsapp"
            class="flex gap-2 items-center hover:underline hover:text-secondary"
            :href="outlet.outlet.social.whatsapp"
            target="_blank"
          >
            <icon
              name="ic:baseline-whatsapp"
              style="width: 20px; height: 20px"
            />
            <div>+{{ outlet.outlet.contact }}</div>
          </a>
        </div>
      </div>
    </div>
    <div class="p-15 md:grid grid-cols-4 gap-x-1 gap-y-3 hidden">
      <template
        v-for="(stf, s) of outlet.staffList.sort(
          (a, b) => a.sortID! - b.sortID!,
        )"
        :key="s"
      >
        <StaffAvatar
          :staff="stf"
          :click-able="true"
          :icon-size="150"
          :with-name="true"
          :with-position="true"
          @open-detail="selectStaff"
        />
      </template>
    </div>
    <div class="flex md:hidden pt-5 flex-col gap-1">
      <template
        v-for="(stf, s) of outlet.staffList.sort(
          (a, b) => a.sortID! - b.sortID!,
        )"
        :key="s"
      >
        <div
          class="w-full flex p-3 gap-3 items-center demo-picker"
          @click="selectStaff(stf)"
        >
          <div>
            <StaffAvatar
              :staff="stf"
              :click-able="false"
              :icon-size="50"
              :with-name="false"
              :with-position="false"
            />
          </div>
          <div class="flex-1 flex flex-col">
            <div class="font-bold text-lg">{{ stf.name }}</div>
            <div class="demo-posi-text">{{ stf.employee?.title }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { OutletConfigMain } from "~/model/booking";
import type { AllOutlet } from "~/model/custom";
import type { Staff } from "~/model/staff";

const props = defineProps<{
  outlet: AllOutlet;
  outletSetup: OutletConfigMain;
}>();

const emit = defineEmits(["openStaff"]);

function selectStaff(stf: Staff) {
  emit("openStaff", stf);
}
</script>

<style></style>
