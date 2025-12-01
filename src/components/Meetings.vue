<template>
  <div class="max-w-4xl mx-auto space-y-10 pb-12">

    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-gray-200">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          Собрания
          <span class="text-2xl px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">{{ meetings.length }}</span>
        </h1>
        <p class="text-gray-500 mt-2 text-lg">Голосуйте и следите за решениями онлайн</p>
      </div>
    </header>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 bg-white rounded-[28px] animate-pulse"></div>
    </div>

    <div v-else-if="meetings.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] shadow-sm">
      <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <i class="pi pi-check text-2xl text-green-600"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900">Все спокойно</h3>
      <p class="text-gray-500">Нет активных собраний</p>
    </div>

    <div v-else class="space-y-12">

      <div v-for="(groupMeetings, houseName) in groupedMeetings" :key="houseName" class="space-y-4">

        <div class="sticky top-[70px] z-30 bg-[#f2f2f7]/95 backdrop-blur-sm py-3 px-1">
          <h2 class="text-lg font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
            <i class="pi pi-map-marker text-blue-500"></i>
            {{ houseName }}
          </h2>
        </div>

        <div
          v-for="meeting in groupMeetings"
          :key="meeting.id"
          class="group bg-white p-6 rounded-[28px] shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-100 relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div class="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">

            <div class="flex items-center gap-6 w-full md:w-auto">
              <div class="flex flex-col items-center justify-center w-20 h-20 bg-[#f8f9fa] group-hover:bg-blue-50 text-gray-900 group-hover:text-blue-600 rounded-2xl border border-gray-100 group-hover:border-blue-100 transition-colors duration-300">
                <span class="text-xs font-bold uppercase tracking-widest opacity-60">{{ new Date(meeting.date).toLocaleString('ru', { month: 'short' }).replace('.', '') }}</span>
                <span class="text-3xl font-black leading-none mt-1">{{ new Date(meeting.date).getDate() }}</span>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2.5 h-2.5 rounded-full shadow-sm" :class="meeting.has_voted ? 'bg-green-500' : 'bg-amber-500 animate-pulse'"></span>
                  <h3 class="font-extrabold text-xl text-gray-900">Общее собрание</h3>
                </div>
                <p class="text-gray-500 font-medium text-sm">
                  Дата проведения: {{ new Date(meeting.date).toLocaleDateString() }}
                </p>
              </div>
            </div>

            <div class="w-full md:w-auto flex flex-col items-end gap-2">
              <Button
                :label="meeting.has_voted ? 'Посмотреть итоги' : 'Участвовать'"
                :icon="meeting.has_voted ? 'pi pi-chart-bar' : 'pi pi-arrow-right'"
                :severity="meeting.has_voted ? 'secondary' : 'primary'"
                rounded
                class="!px-6 !py-3 !font-bold w-full md:w-auto shadow-sm"
                :class="meeting.has_voted ? '!bg-gray-100 !text-gray-600 !border-none' : '!bg-black !border-black hover:!bg-gray-800'"
                @click="handleMeetingClick(meeting)"
              />
              <span class="text-xs font-bold uppercase tracking-wider px-2" :class="meeting.has_voted ? 'text-green-600' : 'text-amber-600'">
                {{ meeting.has_voted ? 'Вы уже проголосовали' : 'Ваш голос не учтен' }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "MeetingsList",
  components: { Button },
  data() {
    return {
      dataStore: useDataStore(),
      meetings: [],
      loading: true,
    };
  },
  computed: {
    // Теперь house_name приходит с Бэкенда, поэтому группировка будет работать корректно
    groupedMeetings() {
      return this.meetings.reduce((groups, meeting) => {
        // Если вдруг имя не пришло, будет заглушка, но после фикса PHP придет реальный адрес
        const houseName = meeting.house_name || 'Адрес не указан';

        if (!groups[houseName]) {
          groups[houseName] = [];
        }
        groups[houseName].push(meeting);
        return groups;
      }, {});
    }
  },
  methods: {
    handleMeetingClick(meeting) {
      const route = meeting.has_voted ? `/voting-results/${meeting.id}` : `/vote/${meeting.id}`;
      this.$router.push(route);
    }
  },
  async mounted() {
    try {
      this.meetings = await this.dataStore.get_meetings_with_status();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  },
};
</script>
