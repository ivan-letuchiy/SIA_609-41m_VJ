<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <DataTable
      :value="meetings"
      :lazy="true"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[2, 5, 10]"
      :totalRecords="meetings_total"
      @page="onPageChange"
      responsive-layout="scroll"
      :first="offset"
    >
      <Column field="id" header="ID" />
      <Column field="date" header="Дата собрания">
        <template #body="slotProps">
          {{ new Date(slotProps.data.date).toLocaleDateString() }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "MeetingsList",
  components: { DataTable, Column },

  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    };
  },

  computed: {
    meetings() {
      return this.dataStore.meetings;
    },
    meetings_total() {
      return this.dataStore.meetings_total;
    },
  },

  mounted() {
    this.dataStore.get_meetings();
    this.dataStore.get_meetings_total();
  },

  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_meetings(this.offset / this.perpage, this.perpage);
    },
  },
};
</script>
