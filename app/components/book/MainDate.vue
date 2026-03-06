<script lang="ts" setup>
import { format } from "date-fns";
import type {
  DateBlock,
  DateSlot,
  OutletConfigMain,
  StaffSlot,
} from "~/model/booking";
import type { MenuItem } from "~/model/service";
import type { BlockedSlot, Staff } from "~/model/staff";

const props = defineProps<{
  outletSetup: OutletConfigMain;
  selectedStaff: Staff;
  selectedService: MenuItem[];
  selectedTime: number | null;
}>();

const emit = defineEmits(["selectDate"]);

function selectDate(dte: number) {
  emit("selectDate", dte);
}

const chosenMonday = ref(Date.now());
const chosenDay = ref<DateBlock>({
  slotTimeStamp: [],
  dayTimeStamp: Date.now(),
});

const staffSlot = ref<StaffSlot[]>([]);

const loadDate = ref(false);

function getDayCode(theDate: number) {
  const checkDate = new Date(theDate);
  return checkDate.getDay();
}

const currentWeekRange = ref<DateBlock[]>([]);

const blockedSlot = ref<BlockedSlot[]>([]);

const nowDate = ref(Date.now());

function filterDate(formString: string, dateTime: number) {
  return format(dateTime, formString);
}

function nextRange() {
  const targetMonday = new Date(chosenMonday.value);
  targetMonday.setDate(targetMonday.getDate() + 7);
  // giveOutRange(8, 21, targetMonday.getTime());
  // generateSlot(targetMonday.getTime());
  generateNewSlot(targetMonday.getTime());
}

function prevRange() {
  const targetMonday = new Date(chosenMonday.value);
  targetMonday.setDate(targetMonday.getDate() - 7);
  // giveOutRange(8, 21, targetMonday.getTime());
  // generateSlot(targetMonday.getTime());
  generateNewSlot(targetMonday.getTime());
}

function checkFuture() {
  const futureMiliSecond =
    props.outletSetup.config.futureInDays * 24 * 60 * 60 * 1000;
  const limitDate = nowDate.value + futureMiliSecond;
  const addWeek = 7 * 24 * 60 * 60 * 1000;
  return chosenMonday.value + addWeek < limitDate;
}

async function generateNewSlot(theDateRange: number) {
  let dataRange: DateBlock[] = [];

  const mondayDate = new Date(theDateRange);
  const day = mondayDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  mondayDate.setDate(mondayDate.getDate() + diffToMonday);
  mondayDate.setHours(0, 0, 0, 0);
  chosenMonday.value = mondayDate.getTime();

  const sundayDate = new Date(mondayDate);
  sundayDate.setDate(mondayDate.getDate() + 7);

  const todayDate = new Date(nowDate.value);

  const slotResponse = await getDateAvailability(
    props.selectedStaff.staffID.toString(),
    props.outletSetup.outletID,
    mondayDate.getTime() > todayDate.getTime()
      ? mondayDate.getTime() / 1000
      : nowDate.value / 1000,
    sundayDate.getTime() / 1000,
    props.selectedService.reduce((total, svc) => total + svc.duration, 0) / 15,
    0,
    props.selectedStaff.staffID.toString(),
  );

  let availSlot: DateSlot[] = [];

  if (slotResponse.slotTime.length > 0) {
    staffSlot.value = slotResponse.slotTime;
    const dates = new Set<number>();

    slotResponse.slotTime.forEach((staff) => {
      staff.slots.forEach((slot) => {
        dates.add(slot.date);
      });
    });

    availSlot = Array.from(dates).map((date) => ({
      date,
      slots: [],
    }));
  }
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(mondayDate);
    dayDate.setDate(mondayDate.getDate() + i);

    let times: number[] = [];
    const filteredSlot = availSlot.filter((tSlot) => {
      const checkDate = new Date(tSlot.date * 1000);
      return checkDate.getDate() == dayDate.getDate();
    });

    if (filteredSlot) {
      times = filteredSlot
        .map((tSlot) => tSlot.date * 1000)
        .sort((a, b) => a - b);
    }

    dataRange.push({
      dayTimeStamp: dayDate.getTime(),
      slotTimeStamp: times,
    });
  }

  currentWeekRange.value = dataRange;
}

function disablePrevDay(day: number) {
  const buffer = props.outletSetup.config.buffer * 60 * 60 * 1000;
  const toDate = new Date(nowDate.value + buffer);
  toDate.setHours(0, 0, 0, 0);
  return day < toDate.getTime();
}

function disableFuture(dayTime: number) {
  const todayDate = new Date(nowDate.value);
  todayDate.setHours(0, 0, 0, 0);
  const futureInMili =
    props.outletSetup.config.futureInDays * 24 * 60 * 60 * 1000;
  return dayTime > todayDate.getTime() + futureInMili;
}

function filterTimeSlot(hourStart: number, hourEnd: number) {
  const lastHour = props.selectedService[0];
  const startTime = new Date(chosenDay.value.dayTimeStamp);
  const endTime = new Date(chosenDay.value.dayTimeStamp);
  startTime.setHours(hourStart, 0, 0, 0);
  endTime.setHours(hourEnd, 0, 0, 0);
  if (chosenDay.value != null) {
    if (lastHour?.lastHour) {
      const [hours, minutes, seconds] = lastHour.lastHour
        .split(":")
        .map(Number);
      const limitChosen = new Date(chosenDay.value.dayTimeStamp);
      limitChosen.setHours(hours ? hours : hourEnd, minutes, seconds, 0);
      if (limitChosen.getTime() < endTime.getTime()) {
        return chosenDay.value.slotTimeStamp
          .filter(
            (slt) => slt >= startTime.getTime() && slt < limitChosen.getTime(),
          )
          .sort((a, b) => a - b);
      }
    }
    return chosenDay.value.slotTimeStamp
      .filter((slt) => slt >= startTime.getTime() && slt < endTime.getTime())
      .sort((a, b) => a - b);
  } else {
    return [];
  }
}

onMounted(async () => {
  loadDate.value = true;
  const buffer = props.outletSetup.config.buffer * 60 * 60 * 1000;
  const targetDate = nowDate.value + buffer;
  // giveOutRange(8, 21, props.pickedTime ? props.pickedTime : targetDate);
  // generateSlot(props.pickedTime ? props.pickedTime : targetDate);
  await generateNewSlot(props.selectedTime ? props.selectedTime : targetDate);
  const today = new Date(props.selectedTime ? props.selectedTime : targetDate);
  today.setHours(0, 0, 0, 0);
  const checkRange = currentWeekRange.value.find(
    (rng) => rng.dayTimeStamp == today.getTime(),
  );
  if (checkRange) {
    chosenDay.value = checkRange;
    // calPick.value = checkRange.dayTimeStamp;
    // const todayYear = today.getFullYear();
    // const todayMonth = today.getMonth() + 1;
    // const todayDay = today.getDate();
    // calPick.value = new CalendarDate(todayYear, todayMonth, todayDay);
    // refetchBlockedDate(chosenDay.value);
  }
  loadDate.value = false;

  const landTimer = setInterval(() => {
    nowDate.value = Date.now();
  }, 60000);

  onUnmounted(() => clearInterval(landTimer));
});
</script>

<template>
  <div class="w-full max-w-full h-full max-h-full flex flex-col gap-2">
    <div class="flex items-center w-full">
      <div>
        <div
          :class="`flex w-[30px] h-[30px] md:w-10 md:h-10 items-center justify-center p-2 hover:cursor-pointer ${chosenMonday <= nowDate ? 'invisible' : ''}`"
          style="
            color: var(--white-bg);
            background-color: var(--ui-primary);
            border-radius: 50%;
          "
          @click="prevRange()"
        >
          <u-icon
            name="heroicons:chevron-left"
            style="height: 100%; width: 100%"
          />
        </div>
      </div>
      <div class="flex-1 text-center font-bold text-primary text-lg">
        {{ filterDate("MMMM yyyy", chosenMonday) }}
      </div>
      <div>
        <div
          :class="`flex w-[30px] h-[30px] md:w-10 md:h-10 items-center justify-center p-2 hover:cursor-pointer ${!checkFuture() ? 'invisible' : ''}`"
          style="
            color: var(--white-bg);
            background-color: var(--ui-primary);
            border-radius: 50%;
          "
          @click="nextRange()"
        >
          <u-icon
            name="heroicons:chevron-right"
            style="height: 100%; width: 100%"
          />
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-7 md:gap-3 gap-1 items-center overflow-x-auto main-hide-scrollbar whitespace-nowrap scroll-smooth touch-pan-x"
    >
      <template v-for="(dat, d) of currentWeekRange" :key="d">
        <div
          :class="`flex flex-col gap-0 items-center justify-center demo-picker py-3 ${disablePrevDay(dat.dayTimeStamp) || disableFuture(dat.dayTimeStamp) ? 'disabled' : ''} ${chosenDay.dayTimeStamp == dat.dayTimeStamp ? 'picked' : ''}`"
          @click="
            if (
              !disablePrevDay(dat.dayTimeStamp) &&
              // day.slotTimeStamp.length > 0 &&
              !disableFuture(dat.dayTimeStamp)
            ) {
              chosenDay = dat;
              // refetchBlockedDate(day);
              // setCalPick(dat.dayTimeStamp);
            }
          "
        >
          <div class="text-md font-bold">
            {{ filterDate("E", dat.dayTimeStamp) }}
          </div>
          <div class="text-xl font-bold">
            {{ filterDate("dd", dat.dayTimeStamp) }}
          </div>
        </div>
      </template>
    </div>
    <div class="flex gap-3">
      <div class="flex-1 text-center text-primary font-bold">Morning</div>
      <div class="flex-1 text-center text-primary font-bold">Afternoon</div>
      <div class="flex-1 text-center text-primary font-bold">Evening</div>
    </div>
    <div
      v-if="filterTimeSlot(0, 24).length > 0"
      class="flex-1 flex gap-3 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
    >
      <div class="flex-1 flex flex-col gap-3">
        <template v-for="(time, t) in filterTimeSlot(0, 12)" :key="t">
          <div
            :class="`demo-picker font-semibold text-center py-2 ${selectedTime == time ? 'picked' : ''}`"
            @click="selectDate(time)"
          >
            {{ filterDate("hh:mm a", time) }}
          </div>
        </template>
      </div>
      <div class="flex-1 flex flex-col gap-3">
        <template v-for="(time, t) in filterTimeSlot(12, 17)" :key="t">
          <div
            :class="`demo-picker font-semibold text-center py-2 ${selectedTime == time ? 'picked' : ''}`"
            @click="selectDate(time)"
          >
            {{ filterDate("hh:mm a", time) }}
          </div>
        </template>
      </div>
      <div class="flex-1 flex flex-col gap-3">
        <template v-for="(time, t) in filterTimeSlot(17, 24)" :key="t">
          <div
            :class="`demo-picker font-semibold text-center py-2 ${selectedTime == time ? 'picked' : ''}`"
            @click="selectDate(time)"
          >
            {{ filterDate("hh:mm a", time) }}
          </div>
        </template>
      </div>
    </div>
    <div
      v-else
      class="flex-1 flex justify-center items-center font-medium text-primary"
    >
      Fully Booked. Please choose another day.
    </div>
  </div>
</template>

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
