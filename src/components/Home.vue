<template>
  <div class="max-w-5xl mx-auto space-y-10">

    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-gray-200">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Моя недвижимость</h1>
      </div>
    </header>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="h-[400px] rounded-[32px] bg-gray-200 animate-pulse"></div>
      <div class="h-[400px] rounded-[32px] bg-gray-200 animate-pulse"></div>
    </div>

    <div v-else-if="properties.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-300">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <i class="pi pi-home text-3xl text-gray-300"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900">Нет недвижимости</h3>
      <p class="text-gray-500">Объекты появятся здесь после добавления</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="flat in properties"
        :key="flat.id"
        class="group relative flex flex-col overflow-hidden rounded-[32px] bg-[#1c1c1e] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <div class="relative h-64 w-full overflow-hidden bg-gray-800">
          <img
            v-if="flat.picture_url"
            :src="flat.picture_url"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="House"
          />
          <div v-else class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <i class="pi pi-image text-4xl text-gray-600 mb-2"></i>
            <span class="text-gray-500 text-xs font-medium uppercase tracking-widest">Нет фото</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/20 to-transparent"></div>
        </div>

        <div class="relative flex flex-grow flex-col px-6 pb-8 -mt-16">

          <div class="self-start mb-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 shadow-lg">
            <h2 class="text-xl font-bold text-white tracking-wide leading-tight">
              {{ flat.house_name }}
            </h2>
            <p class="text-sm text-white/70 mt-1 font-medium">Квартира {{ flat.flat_number }}</p>
          </div>

          <div class="space-y-6">
            <div class="flex items-end justify-between border-b border-white/10 pb-4">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Площадь</span>
              <div class="text-2xl font-semibold text-white leading-none">
                {{ flat.area }} <span class="text-base font-normal text-gray-500">м²</span>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Собственники</span>
                <i class="pi pi-users text-gray-600 text-xs"></i>
              </div>

              <div class="bg-white/5 rounded-2xl p-2 border border-white/5 space-y-1">
                <template v-if="flat.owners && flat.owners.length">
                  <div
                    v-for="(owner, index) in flat.owners"
                    :key="index"
                    class="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {{ index + 1 }}
                      </div>
                      <span class="text-sm text-gray-200 truncate font-medium">{{ owner.name }}</span>
                    </div>

                    <span class="ml-2 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-gray-300 border border-white/10 whitespace-nowrap">
                      {{ parseInt(owner.share) }}%
                    </span>
                  </div>
                </template>
                <div v-else class="text-center py-4">
                  <span class="text-sm text-gray-600 italic">Данные загружаются...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "Home",
  data() {
    return {
      dataStore: useDataStore(),
      properties: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      this.properties = await this.dataStore.get_user_properties();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
};
</script>
