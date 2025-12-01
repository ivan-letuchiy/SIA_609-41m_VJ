<template>
  <div class="max-w-3xl mx-auto space-y-8 pb-12 pt-8">

    <header class="px-4">
      <Button
        label="Назад"
        icon="pi pi-arrow-left"
        text
        class="mb-2 text-gray-500 hover:bg-gray-100 rounded-full px-4"
        @click="$router.push('/')"
      />
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Создание собрания</h1>
      <p class="text-gray-500 mt-2 text-lg">Заполните повестку дня и варианты голосования</p>
    </header>

    <div class="px-4">
      <form @submit.prevent="submitMeeting" class="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="font-bold text-gray-700 uppercase text-xs tracking-wider ml-1">Дом</label>
            <Dropdown
              v-model="selectedHouse"
              :options="houses"
              optionLabel="house_name"
              optionValue="id"
              placeholder="Выберите дом"
              class="w-full !rounded-2xl !border-gray-200"
              :filter="true"
            />
          </div>

          <div class="space-y-2">
            <label class="font-bold text-gray-700 uppercase text-xs tracking-wider ml-1">Дата проведения</label>
            <Calendar
              v-model="meetingDate"
              dateFormat="dd.mm.yy"
              showIcon
              class="w-full"
              inputClass="!rounded-2xl !border-gray-200"
              placeholder="Выберите дату"
            />
          </div>
        </div>

        <hr class="border-gray-100">

        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">Вопросы повестки</h2>
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ questions.length }} добавлено</span>
          </div>

          <div class="bg-gray-50 p-6 rounded-[24px] border border-gray-200 space-y-5 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300">

            <div class="space-y-2">
              <label class="font-bold text-gray-700 text-sm ml-1">Текст вопроса</label>
              <InputText
                v-model="currentQuestion.text"
                placeholder="Например: Утверждение годового отчета"
                class="w-full !rounded-xl !border-gray-300 focus:!border-blue-500 !bg-white"
              />
            </div>

            <div class="space-y-2">
              <label class="font-bold text-gray-700 text-sm ml-1">Варианты ответов</label>
              <div class="flex gap-2">
                <InputText
                  v-model="currentAnswer"
                  placeholder="Вариант ответа (Нажмите Enter)"
                  class="w-full !rounded-xl !border-gray-300 focus:!border-blue-500 !bg-white"
                  @keyup.enter="addAnswer"
                />
                <Button
                  icon="pi pi-plus"
                  @click="addAnswer"
                  class="!rounded-xl !w-12"
                  severity="secondary"
                  v-tooltip="'Добавить вариант'"
                />
              </div>

              <div class="flex flex-wrap gap-2 mt-2 min-h-[30px]">
                <span v-for="(ans, idx) in currentQuestion.answers" :key="idx" class="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm flex items-center gap-2 shadow-sm text-gray-700">
                  {{ ans }}
                  <i class="pi pi-times cursor-pointer text-gray-400 hover:text-red-500 transition-colors" @click="removeAnswer(idx)"></i>
                </span>
                <span v-if="currentQuestion.answers.length === 0" class="text-xs text-gray-400 italic py-1.5">Добавьте минимум 2 варианта ответа</span>
              </div>
            </div>

            <Button
              label="Добавить вопрос в список"
              icon="pi pi-arrow-down"
              class="w-full !rounded-xl mt-2"
              severity="secondary"
              outlined
              @click="addQuestionToMeeting"
              :disabled="!currentQuestion.text || currentQuestion.answers.length < 2"
            />
          </div>

          <transition-group name="list" tag="div" class="mt-6 space-y-3">
            <div v-for="(q, idx) in questions" :key="idx" class="bg-blue-50 p-5 rounded-[20px] flex justify-between items-start border border-blue-100 group hover:shadow-md transition-all">
              <div>
                <p class="font-bold text-gray-900 text-lg mb-2">
                  <span class="text-blue-500 mr-2">#{{ idx + 1 }}</span>
                  {{ q.text }}
                </p>
                <div class="flex flex-wrap gap-2">
                   <span v-for="ans in q.answers" :key="ans" class="text-xs bg-white text-blue-700 px-2 py-1 rounded-md border border-blue-100 font-medium">
                     {{ ans }}
                   </span>
                </div>
              </div>
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                @click="questions.splice(idx, 1)"
              />
            </div>
          </transition-group>
        </div>

        <div class="pt-6 border-t border-gray-100">
          <Button
            type="submit"
            label="Опубликовать собрание"
            class="w-full !rounded-2xl !py-4 !text-lg !font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
            :loading="loading"
            :disabled="questions.length === 0 || !selectedHouse || !meetingDate"
          />
        </div>

      </form>
    </div>
    <Toast />
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "CreateMeeting",
  components: { Dropdown, Calendar, InputText, Button, Toast },
  data() {
    return {
      dataStore: useDataStore(),
      toast: useToast(),
      houses: [],
      selectedHouse: null,
      meetingDate: null,
      loading: false,

      currentQuestion: { text: '', answers: [] },
      currentAnswer: '',
      questions: []
    };
  },
  async mounted() {
    // Получаем все дома (так как это админ, лимит большой)
    await this.dataStore.get_houses(0, 1000);
    this.houses = this.dataStore.houses;
  },
  methods: {
    addAnswer() {
      if (this.currentAnswer.trim()) {
        this.currentQuestion.answers.push(this.currentAnswer.trim());
        this.currentAnswer = '';
      }
    },
    removeAnswer(index) {
      this.currentQuestion.answers.splice(index, 1);
    },
    addQuestionToMeeting() {
      this.questions.push({
        text: this.currentQuestion.text,
        answers: [...this.currentQuestion.answers]
      });
      // Сброс формы вопроса
      this.currentQuestion = { text: '', answers: [] };
    },
    async submitMeeting() {
      this.loading = true;

      // Форматирование даты в YYYY-MM-DD с учетом часового пояса
      const dateObj = new Date(this.meetingDate);
      const offset = dateObj.getTimezoneOffset();
      const adjustedDate = new Date(dateObj.getTime() - (offset*60*1000));
      const formattedDate = adjustedDate.toISOString().split('T')[0];

      const payload = {
        house_id: this.selectedHouse,
        date: formattedDate,
        questions: this.questions
      };

      const success = await this.dataStore.create_meeting(payload);
      this.loading = false;

      if (success) {
        this.toast.add({ severity: 'success', summary: 'Готово', detail: 'Собрание успешно создано', life: 3000 });
        // Полный сброс формы
        this.selectedHouse = null;
        this.meetingDate = null;
        this.questions = [];
      } else {
        this.toast.add({ severity: 'error', summary: 'Ошибка', detail: this.dataStore.errorMessage || 'Не удалось сохранить', life: 3000 });
      }
    }
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
