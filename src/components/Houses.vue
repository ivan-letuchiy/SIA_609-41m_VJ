<template>
  <DataTable
    :value="houses"
    :lazy="true"
    :paginator="true"
    :rows="perpage"
    :rowsPerPageOptions="[2, 5, 10]"
    :totalRecords="houses_total"
    @page="onPageChange"
    responsive-layout="scroll"
    :first="offset"
  >
    <Column field="id" header="ID" />
    <Column field="house_name" header="Наименование дома" />
  </DataTable>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "HousesList",
  components: { DataTable, Column },

  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    };
  },

  computed: {
    houses() {
      return this.dataStore.houses;
    },
    houses_total() {
      return this.dataStore.houses_total;
    },
  },

  mounted() {
    this.dataStore.get_houses();
    this.dataStore.get_houses_total();
  },

  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_houses(this.offset / this.perpage, this.perpage);
    },
  },
};
</script>

<style scoped>
</style>
