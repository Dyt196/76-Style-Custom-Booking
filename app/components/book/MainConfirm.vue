<template>
  <div class="w-full p-2 max-w-full h-full max-h-full flex flex-col">
    <div
      class="flex-1 flex md:flex-row flex-col gap-3 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
    >
      <div class="flex-1 flex flex-col gap-3">
        <div v-if="staff" class="flex flex-col">
          <div class="text-primary font-bold">Outlet & Stylist</div>
          <div
            class="demo-picker text-primary flex p-3 gap-2"
            @click="goStep(2)"
          >
            <div>
              <StaffAvatar
                :staff="staff"
                :click-able="false"
                :icon-size="50"
                :with-name="false"
                :with-position="false"
              />
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <div class="text-lg font-bold">{{ staff.name }}</div>
              <div class="text-muted text-sm font-semibold">
                {{ outlet.outlet.location.name }}
              </div>
            </div>
            <div>
              <icon name="heroicons:chevron-right" style="height: 100%" />
            </div>
          </div>
        </div>

        <div v-if="service" class="flex flex-col">
          <div class="text-primary font-bold">Service</div>
          <div class="flex flex-col gap-1">
            <template v-for="svc in service">
              <div
                class="demo-picker text-primary flex p-3 gap-2"
                @click="goStep(3)"
              >
                <div
                  class="flex-1 flex flex-col justify-center text-lg font-bold"
                >
                  {{ svc.name }}
                </div>
                <div>
                  <icon name="heroicons:chevron-right" style="height: 100%" />
                </div>
              </div>
            </template>
          </div>
        </div>

        <div v-if="dateTime" class="flex flex-col">
          <div class="text-primary font-bold">Date & Time</div>
          <div
            class="demo-picker text-primary flex p-3 gap-2"
            @click="goStep(4)"
          >
            <div class="flex-1 flex flex-col justify-center">
              <div class="text-lg font-bold">
                {{ filterDate("EEEE, dd MMMM yyyy", dateTime) }}
              </div>
              <div class="text-muted text-sm font-semibold">
                {{ filterDate("h:mm a", dateTime) }}
              </div>
            </div>
            <div>
              <icon name="heroicons:chevron-right" style="height: 100%" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="text-primary font-bold md:hidden">Your Details</div>
        <div
          class="h-full w-full demo-card flex flex-col gap-3 p-5"
          style="background: var(--white-bg)"
        >
          <div class="flex flex-col gap-1">
            <div class="text-muted font-semibold text-md">Name</div>
            <div class="text-primary font-semibold">
              {{ bookingDetail.name }}
            </div>
          </div>
          <u-separator />
          <div class="flex flex-col gap-1">
            <div class="text-muted font-semibold text-md">Phone Number</div>
            <div class="flex items-center gap-1">
              <!-- <u-button :icon="selectedCode.icon" class="gen-btn p-0" /> -->
              <div class="text-primary font-semibold">
                +{{ bookingDetail.mobile }}
              </div>
            </div>
          </div>
          <u-separator />
          <div class="flex flex-col gap-1">
            <div class="text-muted font-semibold text-md">Email Address</div>
            <div class="text-primary font-semibold">
              {{ bookingDetail.email }}
            </div>
          </div>
          <u-separator />
          <div class="flex flex-col gap-1">
            <div class="text-muted font-semibold text-md">Booking Notes</div>
            <div class="text-primary font-semibold">
              {{ bookingDetail.note ? bookingDetail.note : "No Notes" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import type { ConfirmBooking } from "~/model/booking";
import type { AllOutlet } from "~/model/custom";
import type { MenuItem } from "~/model/service";
import type { Staff } from "~/model/staff";

const props = defineProps<{
  bookingDetail: ConfirmBooking;
  outlet: AllOutlet;
  staff: Staff;
  service: MenuItem[];
  dateTime: number;
}>();

const emit = defineEmits(["changeItem"]);

function goStep(step: number) {
  emit("changeItem", step);
}

function filterDate(formString: string, dateTime: number) {
  return format(dateTime, formString);
}
</script>

<style>
.demo-card {
  border-radius: 10px;
  border: 1px solid var(--ui-text-muted);
  background: var(--white-bg);
  color: var(--ui-primary);
}
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
