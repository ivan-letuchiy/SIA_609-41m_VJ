<template>
  <div class="max-w-3xl mx-auto space-y-8 pb-12">

    <header class="pt-8 px-4" v-if="meeting">
      <Button icon="pi pi-arrow-left" label="К списку" text @click="$router.push('/meetings')" class="mb-4 text-gray-500" />
      <h1 class="text-3xl font-extrabold text-gray-900">Итоги голосования</h1>
      <p class="text-gray-500 mt-2">Результаты в реальном времени</p>
    </header>

    <div v-if="loading" class="p-8 text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div v-else class="px-4 space-y-6">

      <div v-for="(result, index) in results" :key="index"
           class="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100">

        <h3 class="text-lg font-bold text-gray-800 mb-6 flex gap-3">
          <span class="w-7 h-7 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs shrink-0">
            {{ index + 1 }}
          </span>
          {{ result.question_text }}
        </h3>

        <div class="space-y-4">
          <div v-for="stat in result.stats" :key="stat.vote_answer" class="space-y-1">

            <div class="flex justify-between text-sm font-medium">
              <span class="text-gray-700">{{ stat.vote_answer }}</span>
              <span class="text-gray-900 font-bold">
                {{ Math.round((stat.total / result.total_votes) * 100) }}%
                <span class="text-gray-400 font-normal">({{ stat.total }})</span>
              </span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div class="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                   :style="{ width: (stat.total / result.total_votes) * 100 + '%' }"></div>
            </div>

          </div>

          <div v-if="result.total_votes === 0" class="text-center text-gray-400 text-sm italic py-2">
            Голосов пока нет
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
  name: "VotingResults",
  components: { Button },
  data() {
    return {
      dataStore: useDataStore(),
      meeting: null,
      results: [],
      loading: true,
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    const data = await this.dataStore.get_meeting_results(id);

    if (data) {
      this.meeting = data.meeting;
      this.results = data.results;
    }
    this.loading = false;
  }
};
</script>
