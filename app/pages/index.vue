<script setup lang="ts">
import { useDemoStore } from "~/stores/demoStore";
import { demoRouting } from "~/config/demoRoutes";
import FallbackPage from "~/components/fallbackPage.vue";
import { useDemoDbStore } from "~/stores/demoDbStore";
import RolesNav from "~/components/rolesNav.vue"
import RoutesNav from "~/components/routesNav.vue"
import Loader from "~/components/loader.vue"

const demoStore = useDemoStore();
const demoDbStore = useDemoDbStore();
// Включаем все компоненты demo через import.meta.glob
const modules = import.meta.glob<Component>(
    '/components/**/*.vue'
);

// Выбираем динамический компонент для текущего роута demo
const viewComponent = computed(() => {
  const role = demoStore.currentRole;
  const view = demoStore.currentView;

  const isRouteAllowed = demoRouting[role]?.routes?.some(
      r => r.key === view
  );

  const safeView = isRouteAllowed
      ? view
      : demoRouting[role]?.routes?.[0]?.key;

  // Формируем путь относительно import.meta.glob
  const path = `/components/${role}/${safeView}.vue`;

  const loader = modules[path];

  if (!loader) return FallbackPage;

  return defineAsyncComponent(loader);
});

// Ключ для обновления компонента при смене роли или view
const viewKey = computed(() => `${demoStore.currentRole}:${demoStore.currentView}`);

// Инициализация demoDbStore при монтировании
onMounted(async () => {
  await demoDbStore.initDb();
  await demoDbStore.loadAll();
});
</script>

<template>
  <main class="main">
    <div class="demo block">
      <RolesNav/>
      <div class="demo__content">
        <RoutesNav/>
        <div class="demo__body">
          <ClientOnly>
            <Suspense>
              <component :is="viewComponent" :key="viewKey" />
              <template #fallback>
                <Loader />
              </template>
            </Suspense>
          </ClientOnly>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.demo {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  border-radius: 10px;
  @media (max-width: 576px) {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }

  &__content {
    width: 100%;
    overflow-y: auto;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__body {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 500px;
  }

  &__button {
    min-width: fit-content;
    text-decoration: none;
    border-radius: 0.625rem;
    border: none;
    color: var(--parent-text-light);
    background-color: var(--parent-color-accent);
    padding: 0.625rem 2rem;
    font-weight: 600;
    font-size: var(--parent-text-md);
    @media (max-width: 1024px) {
      font-size: var(--parent-text-s);
      padding: 0.5rem 1.7rem;
    }
    @media (max-width: 768px) {
      font-size: var(--parent-text-xs);
    }
    @media (max-width: 576px) {
      font-size: var(--parent-text-xxs);
    }
    @media (max-width: 480px) {
      font-size: var(--parent-text-3xs);
      padding: 0.5rem 1rem
    }
    &:hover {
      background-color: var(--parent-color-accent-hover);
    }
  }
}
</style>
