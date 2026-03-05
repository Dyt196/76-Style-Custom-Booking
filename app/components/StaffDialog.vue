<script lang="ts" setup>
import type { Outlet } from "~/model/merchant";
import type { Staff, WorkGallery } from "~/model/staff";

const props = defineProps<{
  staff: Staff;
  outlet: Outlet;
}>();

const emit = defineEmits(["closeDialog", "openBooking"]);

const opImage = ref(false);
const selectedImage = ref("");

function openBook() {
  emit("openBooking");
}

function closeDialog() {
  emit("closeDialog");
}

function openImage(img: string) {
  selectedImage.value = img;
  opImage.value = true;
}

const imageSet = ref<WorkGallery[]>([]);

onMounted(async () => {
  imageSet.value = await getStaffGallery(props.staff.staffID);
});
</script>

<template>
  <div
    class="w-full max-h-[80vh] h-[80vh] p-2 flex flex-col style-76"
    style="
      background-color: var(--ui-bg-muted);
      color: var(--ui-primary);
      border-radius: 10px;
      border: var(--ui-border);
      box-shadow: 1px 2px 2px var(--ui-border);
    "
  >
    <div class="md:block hidden">
      <div
        class="flex items-center justify-center p-2 hover:cursor-pointer"
        style="
          width: 45px;
          height: 45px;
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
    <div
      class="flex-1 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
    >
      <div class="flex flex-col gap-3 flex-1 md:hidden p-3">
        <div class="flex w-full gap-5">
          <div>
            <StaffAvatar
              :staff="staff"
              :click-able="false"
              :icon-size="100"
              :with-name="false"
              :with-position="false"
            />
          </div>
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-xl font-bold text-primary">{{ staff.name }}</div>
            <div class="text-muted text-md font-semibold">
              {{ staff.employee?.title }}
            </div>
          </div>
          <div
            class="flex items-center justify-center p-2 hover:cursor-pointer"
            style="
              width: 30px;
              height: 30px;
              color: var(--demo-white);
              background-color: var(--demo-primary);
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
        <div
          class="w-full [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        >
          <div
            class="text-sm text-justify font-medium text-(--demo-muted)"
            style="white-space: pre-line"
            v-html="staff.employee?.html"
          />
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-lg font-semibold">Work</div>
          <div
            v-if="imageSet.length == 0"
            class="flex items-center justify-center text-md p-5 text-muted font-semibold"
          >
            Empty Gallery
          </div>
          <div v-else class="grid grid-cols-2 gap-2">
            <template v-for="(gal, g) of imageSet" :key="g">
              <div
                class="overflow-hidden"
                style="width: 100%; aspect-ratio: 1; border-radius: 10px"
                @click="openImage(gal.url)"
              >
                <img
                  :src="gal.url"
                  style="object-fit: cover; height: 100%; width: 100%"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="flex-1 hidden md:flex flex-col p-5">
        <div class="flex px-5 w-full gap-5">
          <div>
            <StaffAvatar
              :staff="staff"
              :click-able="false"
              :icon-size="200"
              :with-name="false"
              :with-position="false"
            />
          </div>
          <div
            class="flex-1 flex flex-col gap-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          >
            <div class="text-4xl font-extrabold text-(--demo-primary)">
              {{ staff.name }}
            </div>
            <div class="text-lg font-bold text-(--demo-secondary)">
              {{ staff.employee?.title }}
            </div>
            <div
              class="text-sm text-justify font-medium text-(--demo-muted)"
              style="white-space: pre-line"
              v-html="staff.employee?.html"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-lg font-semibold">Work</div>
          <div
            v-if="imageSet.length == 0"
            class="flex items-center justify-center text-md p-5 text-muted font-semibold"
          >
            Empty Gallery
          </div>
          <div v-else class="grid grid-cols-4 gap-2">
            <template v-for="(gal, g) of imageSet" :key="g">
              <div
                class="overflow-hidden demo-case"
                style="width: 100%; aspect-ratio: 1; border-radius: 10px"
                @click="openImage(gal.url)"
              >
                <img class="demo-image" :src="gal.url" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <div
        style="
          border-radius: 25px;
          background-color: var(--ui-primary);
          color: var(--white-bg);
        "
        class="text-center p-2 font-bold cursor-pointer"
        @click="openBook()"
      >
        Book Now
      </div>
    </div>
    <u-modal
      v-model:open="opImage"
      class="max-w-[100vw] md:max-w-[80vw]"
      title="Open Image"
    >
      <template #content>
        <img
          class="md:hidden"
          style="width: 100%; height: auto; object-fit: contain"
          :src="selectedImage"
        />
        <div
          class="w-full max-h-[90vh] h-[90vh] hidden md:flex p-5 flex-col style-76"
          style="
            background: var(--white-bg);
            color: var(--ui-primary);
            border-radius: 10px;
            border: var(--ui-border);
            box-shadow: 1px 2px 2px var(--ui-border);
          "
        >
          <div
            class="flex items-center justify-center p-2 hover:cursor-pointer"
            style="
              width: 45px;
              height: 45px;
              color: var(--white-bg);
              background-color: var(--ui-primary);
              border-radius: 50%;
            "
            @click="opImage = false"
          >
            <u-icon
              name="heroicons:x-mark-solid"
              style="height: 100%; width: 100%"
            />
          </div>
          <u-separator class="py-3" />
          <div
            class="flex-1 overflow-y-auto main-hide-scrollbar scroll-smooth touch-pan-y"
          >
            <img
              style="
                width: 100%;
                height: auto;
                object-fit: contain;
                border-radius: 10px;
              "
              :src="selectedImage"
            />
          </div>
        </div>
      </template>
    </u-modal>
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

.demo-image {
  object-fit: cover;
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;
}

.demo-case:hover {
  cursor: pointer;
}

.demo-case:hover .demo-image {
  transform: scale(1.1);
}
</style>
