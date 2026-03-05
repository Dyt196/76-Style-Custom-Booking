<template>
  <div
    class="w-full p-5 text-primary flex flex-col gap-2"
    style="
      background-color: var(--white-bg);
      border-radius: 10px;
      border: var(--ui-border);
      box-shadow: 2px 2px var(--ui-primary-light);
    "
  >
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
    <div class="w-full flex flex-col flex-1 justify-between gap-2">
      <div class="text-xl font-bold text-center">
        {{ outlet.outlet.location.name }}
      </div>
      <div class="flex justify-center items-center">
        <div
          style="
            border-radius: 5px;
            background-color: var(--ui-primary);
            color: var(--white-bg);
          "
          class="text-center p-2 font-bold cursor-pointer"
          @click="goStaff()"
        >
          Select Stylist
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AllOutlet } from "~/model/custom";

const props = defineProps<{
  outlet: AllOutlet;
}>();

const router = useRouter();

function goStaff() {
  router.push(`/out${props.outlet.outlet.outletID}`);
}
</script>

<style></style>
