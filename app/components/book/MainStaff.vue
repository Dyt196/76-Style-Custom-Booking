<template>
  <div class="w-full max-w-full h-full max-h-full flex flex-col gap-2">
    <div
      class="h-fit grid grid-cols-2 md:grid-cols-3 gap-3 p-3 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
    >
      <template
        v-for="(staff, s) of staffList.sort((a, b) => a.sortID! - b.sortID!)"
        :key="s"
      >
        <div
          :class="`demo-picker w-full h-auto flex flex-col items-center p-3 ${selectedStaff?.staffID == staff.staffID ? 'picked' : ''}`"
          @click="selectStaff(staff)"
        >
          <div>
            <StaffAvatar
              :staff="staff"
              :click-able="false"
              :icon-size="100"
              :with-name="false"
              :with-position="false"
            />
          </div>
          <div class="font-semibold text-lg">{{ staff.name }}</div>
          <div class="demo-posi-text text-sm text-center">
            {{ staff.employee?.title }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Staff } from "~/model/staff";

const props = defineProps<{
  staffList: Staff[];
  selectedStaff: Staff | null;
}>();

const emit = defineEmits(["selectStaff"]);

function selectStaff(stf: Staff) {
  emit("selectStaff", stf);
}
</script>

<style>
.demo-picker {
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
</style>
