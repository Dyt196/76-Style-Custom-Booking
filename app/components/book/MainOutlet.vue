<template>
  <div class="w-full max-w-full h-full max-h-full flex flex-col gap-2">
    <div
      class="h-fit grid grid-cols-1 md:grid-cols-2 gap-3 p-3 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
    >
      <template v-for="(outlet, s) of outletList" :key="s">
        <div
          :class="`demo-picker w-full h-auto flex flex-col gap-2 items-center p-3 ${selectedOutlet.outlet.outletID == outlet.outlet.outletID ? 'picked' : ''}`"
          @click="selectOutlet(outlet)"
        >
          <div
            style="width: 100%; border-radius: 10px; aspect-ratio: 5/3"
            class="overflow-hidden"
          >
            <img
              v-if="outlet.outlet.sliders[0]"
              :src="outlet.outlet.sliders[0].image"
              style="object-fit: cover; height: 100%; width: 100%"
            />
          </div>
          <div class="text-lg font-semibold text-center">
            {{ outlet.outlet.location.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AllOutlet } from "~/model/custom";

const props = defineProps<{
  outletList: AllOutlet[];
  selectedOutlet: AllOutlet;
}>();

const emit = defineEmits(["selectOutlet"]);

function selectOutlet(out: AllOutlet) {
  emit("selectOutlet", out);
}
</script>

<style></style>
