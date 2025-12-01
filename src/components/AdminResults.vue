<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-12 pt-8">
    <header class="px-4">
      <Button
        label="Назад"
        icon="pi pi-arrow-left"
        text
        class="mb-2 text-gray-500 hover:bg-gray-100 rounded-full px-4"
        @click="$router.push('/')"
      />
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Результаты голосования</h1>
      <p class="text-gray-500 mt-2 text-lg">Выберите дом и собрание для просмотра итогов</p>
    </header>

    <div class="px-4">
      <div class="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3">
            <label class="font-bold text-gray-700 uppercase text-xs tracking-wider ml-1">Шаг 1: Дом</label>
            <Dropdown
              v-model="selectedHouse"
              :options="houses"
              optionLabel="house_name"
              optionValue="id"
              placeholder="-- Выберите дом --"
              class="w-full !rounded-2xl !border-gray-200"
              filter
              @change="loadMeetings"
            />
          </div>

          <div class="space-y-3">
            <label class="font-bold text-gray-700 uppercase text-xs tracking-wider ml-1">Шаг 2: Собрание</label>
            <Dropdown
              v-model="selectedMeeting"
              :options="houseMeetings"
              optionLabel="label"
              optionValue="id"
              placeholder="-- Выберите собрание --"
              class="w-full !rounded-2xl !border-gray-200"
              :disabled="!selectedHouse"
              :loading="meetingsLoading"
              emptyMessage="Нет собраний в этом доме"
            />
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100 flex justify-end">
          <Button
            label="Показать результаты"
            icon="pi pi-chart-pie"
            class="!rounded-2xl !py-3 !px-6 !font-bold"
            @click="goToResults"
            :disabled="!selectedMeeting"
          />
        </div>

      </div>

      <div v-if="!selectedHouse" class="mt-8 text-center py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
        <i class="pi pi-search text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Выберите дом, чтобы увидеть список доступных собраний</p>
      </div>

    </div>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "AdminResults",
  components: { Dropdown, Button },
  data() {
    return {
      dataStore: useDataStore(),
      houses: [],
      selectedHouse: null,

      houseMeetings: [],
      selectedMeeting: null,
      meetingsLoading: false
    };
  },
  async mounted() {
    // Загружаем список домов
    await this.dataStore.get_houses(0, 100);
    this.houses = this.dataStore.houses;
  },
  methods: {
    async loadMeetings() {
      // Сброс выбора при смене дома
      this.selectedMeeting = null;
      this.houseMeetings = [];

      if (!this.selectedHouse) return;

      this.meetingsLoading = true;
      // Используем новый метод стора, который мы добавили ранее
      const meetings = await this.dataStore.get_house_meetings(this.selectedHouse);
      this.meetingsLoading = false;

      // Преобразуем данные в формат, удобный для Dropdown (label/value)
      this.houseMeetings = meetings.map(m => ({
        id: m.id,
        // Форматируем дату красиво
        label: `Собрание от ${new Date(m.date).toLocaleDateString()} (ID: ${m.id})`
      }));
    },
    goToResults() {
      // Перенаправляем на существующую страницу результатов
      this.$router.push(`/voting-results/${this.selectedMeeting}`);
    }
  }
};
</script>
