<template>
  <div class="">
    <b-form-input id="mob_filter" v-model="filter" placeholder="Type to Filter" />
    <div class="mobtable-container">
      <b-table striped 
               hover 
               :items="mob_db" 
               :fields="fields" 
               :filter="filter" 
               @row-clicked="mob_select">
        </b-table>
    </div>
  </div>
</template>

<style>

</style>

<script>
import data from '~/static/data/mob_db.json'

export default {
  data() {
    return {
      filter: null,
      fields: {
        id: {
          key: 'Id',
        },
        name: {
          key: 'Name',
        },
      },
      mob_db: data
    }
  },
  methods: {
    mob_select(item) {
      this.$store.commit('set_mob', item);
    }
  }
}
</script>
