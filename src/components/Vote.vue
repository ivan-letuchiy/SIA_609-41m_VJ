<template>
  <div class="max-w-3xl mx-auto space-y-8 pb-12">

    <header class="pt-8 px-4" v-if="meeting">
      <Button icon="pi pi-arrow-left" label="Назад" text @click="$router.go(-1)" class="mb-4 text-gray-500" />
      <h1 class="text-3xl font-extrabold text-gray-900">Голосование</h1>
      <p class="text-gray-500 mt-2">Собрание от {{ new Date(meeting.date).toLocaleDateString() }}</p>
    </header>

    <div v-if="loading" class="p-8 text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <form v-else @submit.prevent="submitVotes" class="px-4 space-y-6">

      <div v-for="(question, index) in meeting.questions" :key="question.id"
           class="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100">

        <h3 class="text-xl font-bold text-gray-800 mb-4 flex gap-3">
          <span class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm shrink-0">
            {{ index + 1 }}
          </span>
          {{ question.question_text }}
        </h3>

        <div class="space-y-3 pl-11">
          <div v-for="answer in question.answers" :key="answer.id"
               class="flex items-center p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
               :class="{'bg-blue-50 border-blue-300': userVotes[question.id] === answer.answer_text}"
               @click="userVotes[question.id] = answer.answer_text">

            <RadioButton
              v-model="userVotes[question.id]"
              :inputId="`q${question.id}_a${answer.id}`"
              :value="answer.answer_text"
              class="mr-3"
            />
            <label :for="`q${question.id}_a${answer.id}`" class="cursor-pointer w-full font-medium text-gray-700">
              {{ answer.answer_text }}
            </label>
          </div>
        </div>
      </div>

      <div class="sticky bottom-4 z-20">
        <Button
          type="submit"
          label="Подтвердить выбор"
          icon="pi pi-check"
          class="w-full !rounded-2xl !py-4 !text-lg shadow-xl"
          :loading="sending"
          :disabled="!isAllAnswered"
        />
      </div>

    </form>
  </div>
</template>

<script>
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "Vote",
  components: { Button, RadioButton },
  data() {
    return {
      dataStore: useDataStore(),
      meeting: null,
      userVotes: {}, // { question_id: "Ответ" }
      loading: true,
      sending: false,
    };
  },
  computed: {
    // Проверка, что на все вопросы дан ответ
    isAllAnswered() {
      if (!this.meeting || !this.meeting.questions) return false;
      return this.meeting.questions.every(q => this.userVotes[q.id]);
    }
  },
  async mounted() {
    const id = this.$route.params.id;
    this.meeting = await this.dataStore.get_meeting_details(id);
    this.loading = false;
  },
  methods: {
    async submitVotes() {
      if (!this.isAllAnswered) return;
      this.sending = true;

      // Формируем массив для отправки
      const votesArray = Object.keys(this.userVotes).map(qId => ({
        question_id: parseInt(qId),
        answer: this.userVotes[qId]
      }));

      const success = await this.dataStore.submit_vote({ votes: votesArray });

      if (success) {
        // Редирект на результаты или список
        this.$router.push('/meetings');
      }
      this.sending = false;
    }
  }
};
</script>
