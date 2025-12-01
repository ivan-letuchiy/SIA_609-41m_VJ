<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-12">

    <header class="pt-8 px-4">
      <Button
        icon="pi pi-arrow-left"
        label="Назад"
        text
        @click="$router.push('/houses')"
        class="mb-4 text-gray-500 hover:bg-gray-100 rounded-full px-4"
      />
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Создание нового дома</h1>
      <p class="text-gray-500 mt-2 text-lg">Заполните адрес и диапазон квартир</p>
    </header>

    <div class="px-4">
      <form @submit.prevent="submitForm" class="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">

        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
            Название дома
          </label>
          <InputText
            v-model="houseName"
            placeholder="Например: ул. Ленина 1"
            class="w-full !rounded-2xl !bg-gray-50 !border-transparent hover:!bg-gray-100 focus:!bg-white focus:!border-blue-500 !p-4 transition-all"
            :class="{ '!border-red-500 !bg-red-50': vError.houseName }"
          />
          <small v-if="vError.houseName" class="text-red-500 ml-1">Введите название</small>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
              Начальный номер
            </label>
            <InputNumber
              v-model="startFlat"
              inputId="startFlat"
              showButtons
              :min="1"
              class="w-full"
              inputClass="!rounded-2xl !bg-gray-50 !border-transparent !p-4 w-full"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
              Конечный номер
            </label>
            <InputNumber
              v-model="endFlat"
              inputId="endFlat"
              showButtons
              :min="1"
              class="w-full"
              inputClass="!rounded-2xl !bg-gray-50 !border-transparent !p-4 w-full"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
            Фотография фасада
          </label>
          <div class="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center hover:bg-gray-50 cursor-pointer relative">
            <input type="file" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div v-if="!selectedFile" class="text-gray-500 font-bold">Нажмите для загрузки фото</div>
            <div v-else class="text-green-600 font-bold">{{ selectedFile.name }}</div>
          </div>
        </div>

        <div class="pt-4">
          <Button
            type="submit"
            label="Создать"
            class="w-full !rounded-2xl !py-4 !text-lg !font-bold shadow-lg"
            :loading="loading"
          />
        </div>

      </form>
    </div>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber'; // Добавили InputNumber
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "CreateHouse",
  components: { InputText, InputNumber, Button, Toast },

  data() {
    return {
      dataStore: useDataStore(),
      toast: useToast(),
      houseName: "",
      startFlat: 1, // По умолчанию 1
      endFlat: 1,
      selectedFile: null,
      loading: false,
      vError: { houseName: false }
    };
  },

  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },

    async submitForm() {
      this.vError.houseName = !this.houseName.trim();

      // Простая валидация
      if (this.vError.houseName || !this.selectedFile) {
        this.toast.add({ severity: 'warn', summary: 'Внимание', detail: 'Заполните название и выберите фото', life: 3000 });
        return;
      }

      if (this.endFlat < this.startFlat) {
        this.toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Конечный номер не может быть меньше начального', life: 3000 });
        return;
      }

      this.loading = true;

      const formData = new FormData();
      formData.append('house_name', this.houseName);
      formData.append('image', this.selectedFile);

      // Добавляем данные о квартирах
      formData.append('start_flat', this.startFlat);
      formData.append('end_flat', this.endFlat);

      await this.dataStore.create_house(formData);

      this.loading = false;

      if (this.dataStore.errorCode === 0) {
        this.toast.add({ severity: 'success', summary: 'Успешно', detail: 'Дом и квартиры созданы', life: 3000 });
        setTimeout(() => this.$router.push('/houses'), 1000);
      } else {
        this.toast.add({ severity: 'error', summary: 'Ошибка', detail: this.dataStore.errorMessage, life: 3000 });
      }
    }
  }
};
</script>
