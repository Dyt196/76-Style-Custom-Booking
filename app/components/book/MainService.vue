<template>
  <div class="w-full max-w-full h-full max-h-full flex flex-col gap-2">
    <div
      ref="sectionScroll"
      class="flex gap-2 pb-1 items-center overflow-x-auto main-hide-scrollbar scroll-smooth touch-pan-x whitespace-nowrap"
    >
      <div
        id="svc-all"
        :class="`style-chip py-1 px-2 cursor-pointer ${selectedSection.sectionID == 0 ? 'picked' : ''}`"
        @click="
          selectedSection = { sectionID: 0, section: 'NONE' };
          goSection('svc-all');
        "
      >
        All
      </div>
      <template
        v-for="(lbl, l) of sectionList.sort((a, b) =>
          a.section.localeCompare(b.section),
        )"
        :key="l"
      >
        <div
          :id="`svc-${lbl.sectionID}`"
          :class="`style-chip py-1 px-2 cursor-pointer ${selectedSection.sectionID == lbl.sectionID && selectedSection.section == lbl.section ? 'picked' : ''}`"
          @click="
            selectedSection = lbl;
            goSection(`svc-${lbl.sectionID}`);
          "
        >
          {{ lbl.section }}
        </div>
      </template>
    </div>
    <div
      class="flex-1 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
    >
      <div class="grid grid-cols-2 gap-3">
        <template v-for="(serv, t) in filterList" :key="t">
          <div
            :class="`demo-picker font-semibold p-2 ${isSelected(serv) ? 'picked' : ''}`"
            @click="selectService(serv)"
          >
            {{ serv.name }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { select } from "#build/ui";
import type { MenuItem, Section } from "~/model/service";
import type { Staff } from "~/model/staff";

const props = defineProps<{
  selectedStaff: Staff;
  selectedService: MenuItem[];
  serviceList: MenuItem[];
}>();
const emit = defineEmits(["selectService"]);

const sectionScroll = ref<HTMLElement | null>(null);

function goSection(theId: string) {
  const target = sectionScroll.value?.querySelector<HTMLElement>(`#${theId}`);
  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}

const listService = computed(() => {
  const excludedSection = props.selectedStaff.excludes
    ? props.selectedStaff.excludes.filter((stf) => stf.deleteDate == 0)
    : [];
  const toExclude = new Set(
    excludedSection.filter((f) => f.deleteDate == 0).map((s) => s.sectionID),
  );
  return props.serviceList.filter((svc) => !toExclude.has(svc.sectionID));
  // return props.serviceList;
});

const filterList = computed(() => {
  if (selectedSection.value.sectionID == 0) {
    return listService.value.sort((a, b) => a.sortID - b.sortID);
  } else {
    return listService.value
      .filter(
        (svc) =>
          svc.sectionID == selectedSection.value.sectionID &&
          svc.section == selectedSection.value.section,
      )
      .sort((a, b) => a.sortID - b.sortID);
  }
});

const selectedSection = ref({ sectionID: 0, section: "NONE" });

const sectionList = computed(() => {
  let newSection: Section[] = [];
  for (const serv of listService.value.sort((a, b) => a.sortID - b.sortID)) {
    if (
      newSection.filter(
        (sect) =>
          sect.section == serv.section && sect.sectionID == sect.sectionID,
      ).length == 0 &&
      serv.section.trim()
    ) {
      newSection.push({
        section: serv.section,
        sectionID: serv.sectionID,
      });
    }
  }
  return newSection;
});

function isSelected(svc: MenuItem) {
  const filtSet = props.selectedService.filter(
    (sVal) => sVal.skuID == svc.skuID,
  );
  return filtSet.length > 0;
}

function selectService(svc: MenuItem) {
  emit("selectService", svc);
}
</script>

<style>
.style-chip {
  border-radius: 50px;
  color: var(--ui-primary);
}

.style-chip:hover {
  background: var(--ui-bg-muted);
}

.style-chip.picked {
  color: var(--white-bg);
  background: var(--ui-primary);
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
