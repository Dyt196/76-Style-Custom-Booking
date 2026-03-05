<script lang="ts" setup>
import type { Staff } from "~/model/staff";

const props = defineProps<{
  staff: Staff;
  clickAble: boolean;
  iconSize: number;
  withName: boolean;
  withPosition: boolean;
}>();

const emit = defineEmits(["openDetail"]);

function openDetail() {
  if (props.clickAble) {
    emit("openDetail", props.staff);
  }
}
</script>

<template>
  <div
    :class="`w-full flex flex-col p-1 gap-0 justify-center ${clickAble ? 'clickable' : ''}`"
  >
    <div class="flex items-center justify-center">
      <div
        @click="openDetail()"
        class="overflow-hidden staff-icon"
        :style="`width: ${iconSize}px;`"
      >
        <img
          :src="staff.icon"
          style="object-fit: cover; height: 100%; width: 100%"
        />
      </div>
    </div>
    <div
      v-if="withName"
      class="w-full text-center pt-1 font-bold text-lg staff-main-text"
    >
      {{ staff.name }}
    </div>
    <div v-if="withPosition" class="w-full text-center text-muted staff-text">
      {{ staff.employee?.title }}
    </div>
  </div>
</template>

<style>
.staff-icon {
  border-radius: 50%;
  border: 1px var(--ui-border) solid;
  aspect-ratio: 1;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 5px 0.5px var(--ui-border);
}

.clickable:hover .staff-icon {
  border: 1px var(--ui-secondary) solid;
  box-shadow: 0px 0px 5px 0.5px var(--ui-secondary);
}

.staff-main-text {
  color: var(--ui-primary);
}

.clickable:hover .staff-main-text {
  color: var(--ui-secondary);
}

.clickable:hover .staff-text {
  color: var(--ui-secondary);
}

.clickable:hover {
  cursor: pointer;
}
</style>
