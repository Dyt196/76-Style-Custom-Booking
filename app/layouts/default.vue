<script setup lang="ts"></script>
<template>
  <UPage>
    <div
      class="w-dvw fixed demo-main-bg flex py-2 demo-header z-50 gap-5 md:gap-2 px-5 md:px-[10vw] items-center style-76"
      style="height: 70px"
    >
      <UDrawer
        direction="left"
        class="bg-primary md:hidden style-76"
        :overlay="false"
        :handle="false"
      >
        <UButton color="secondary" variant="outline" icon="ci:hamburger-md" />

        <template #content>
          <div
            class="flex flex-col gap-2 pt-5 style-76 text-secondary bg-primary"
          >
            <a
              href="https://www.76style.com"
              class="hover:underline text-md font-bold px-5 py-2"
            >
              <div>Home</div>
            </a>

            <a
              href="https://www.76style.com/about-us/"
              class="hover:underline text-md font-bold px-5 py-2"
            >
              <div>About Us</div>
            </a>

            <a
              href="https://www.76style.com/our-team/"
              class="hover:underline text-md font-bold px-5 py-2"
            >
              <div>Our Team</div>
            </a>

            <a
              href="https://www.76style.com/products-services/"
              class="hover:underline text-md font-bold px-5 py-2"
            >
              <div>Products & Services</div>
            </a>

            <a
              href="https://www.76style.com/news/"
              class="hover:underline text-md font-bold px-5 py-2"
            >
              <div>News</div>
            </a>

            <a
              href="https://www.76style.com/contact-us/"
              class="hover:underline text-md font-bold px-5 py-2"
            >
              <div>Contact Us</div>
            </a>
          </div>
        </template>
      </UDrawer>
      <a href="https://www.76style.com/home/">
        <img
          src="https://www.76style.com/wp-content/uploads/2024/06/76STYLE-Website-1.png"
          class="md:h-full h-10"
          alt=""
        />
      </a>
      <div class="flex-1 hidden md:flex gap-5 text-white items-center pl-15">
        <a href="https://www.76style.com" class="hover:underline text-sm">
          <div>Home</div>
        </a>

        <a
          href="https://www.76style.com/about-us/"
          class="hover:underline text-sm"
        >
          <div>About Us</div>
        </a>

        <a
          href="https://www.76style.com/our-team/"
          class="hover:underline text-sm"
        >
          <div>Our Team</div>
        </a>

        <a
          href="https://www.76style.com/products-services/"
          class="hover:underline text-sm"
        >
          <div>Products & Services</div>
        </a>

        <a href="https://www.76style.com/news/" class="hover:underline text-sm">
          <div>News</div>
        </a>

        <a
          href="https://www.76style.com/contact-us/"
          class="hover:underline text-sm"
        >
          <div>Contact Us</div>
        </a>
      </div>
    </div>
    <slot />

    <div
      class="w-full demo-main-bg demo-main-text demo-footer flex flex-col md:flex-row md:items-center md:justify-between text-md md:text-xs"
    >
      <div>© 2025 {{ $t("general.rightReserved") }} JulyTech Sdn. Bhd</div>
      <div class="flex items-center gap-[25px]">
        <a
          href="https://salon.tunai.io/useragreement"
          target="_blank"
          class="hover:underline"
        >
          {{ $t("general.termOfUse") }}
        </a>
        <a
          href="https://salon.tunai.io/privacypolicy"
          target="_blank"
          class="hover:underline"
        >
          {{ $t("general.privacyPolicy") }}
        </a>
      </div>
    </div>
  </UPage>
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

.demo-main-bg {
  background-color: #281700;
}

.demo-main-text {
  color: #ffffff;
}

.demo-main-title {
  color: #cb9b2b;
}

.demo-footer {
  padding: 5px 5vw;
}

.demo-header {
  height: 70px;
}

.demo-body {
  margin-top: 70px;
  background-color: #ddd8c5;
}
</style>
