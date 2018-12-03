<template>
  <div>
    <div class="body-container">
      <mobtable/>
      <div class="calc second-column">
        <div class="stats">
          <b-input-group prepend="Server drop rate">
            <b-form-input v-model="server_rate" placeholder="" value="5"/>
          </b-input-group>
          <b-input-group prepend="Player dex">
            <b-form-input v-model="player_dex" placeholder="" />
          </b-input-group>
          <b-input-group prepend="Monster dex">
            <b-form-input v-model="monster_dex" placeholder="" disabled />
          </b-input-group>
          <b-input-group prepend="Steal skill level">
            <b-form-input v-model="steal_level" placeholder="from 1 to 10" />
          </b-input-group>
          <b-input-group prepend="Steal bonus">
            <b-form-input v-model="steal_bonus" placeholder="" value="0" />
          </b-input-group>
          <b-alert show variant="info">Steal chance: {{ steal_chance }}%</b-alert>
        </div>
        <div class="droptable">
          <b-table 
            striped 
            hover 
            :items="drop"
            @row-clicked="drop_select">
            <template slot="HEAD_Chance" slot-scope="data">
              Base Drop Rate
            </template>
          </b-table>
        </div>
      </div>
      <div class="chart third-column">
        <plot 
          :chart-data="plotData" 
          :options="plotOptions" 
        />
        <span id="tooltip_plot_dex" class="tooltip-target">
          <center>
          <b-form-checkbox id="chk_plot_dex"
                          v-model="calc_chance_on_dex"
                          @change="hide_tooltip">
            Use <b>player_dex</b> as X-axis
          </b-form-checkbox>
          </center>
          <b-tooltip ref="tooltip" target="tooltip_plot_dex" class="tooltip-formula">
            <b>actual_steal_chance</b> is a function of <b>possible_steal_chance</b> which is a function of (monster_dex, player_dex, steal_level, steal_bonus) where <b>player_dex</b> is in a range of 1..150
          </b-tooltip>
        </span>

        <b-alert show variant="info" class="info d-flex justify-content-between align-items-center flex-row">
          <div v-b-modal.modal class="info-faq" id="info_img"><div class="img"></div></div>
          <b-tooltip ref="tooltip" target="info_img" class="tooltip-formula">
            info
          </b-tooltip>
          <div class="info-contacts">
            <div>discord: <a href="http://martini.pink/">http://martini.pink</a></div>
            <div>project source: <a href="https://github.com/morrah/stealcalc/">github.com/morrah/stealcalc</a></div>
          </div>
        </b-alert>
      </div>
    </div>
    <b-modal id="modal" title="information" size="lg" header-bg-variant="info" ok-variant="info" ok-only>
      <p><b>how to use</b></p>
      <ul>
        <li>click on the <i>Goat</i> row of Monster table, drop table appears;</li>
        <li>click on the <i>Blue Herb</i> row of Drop table, steal distribution chart is plotted;</li>
        <li>
          for the x5 rates server chance to steal a blue herb is 
          maximal (4.95%) when your base Steal chance equals 24%;
        </li>
        <li>
          use calculator to find out what dexterity 
          you need and what Steal skill level to use 
          to obtain 24% base Steal chance;
        </li>
      </ul>
      <p><b>chart description</b></p>
      <ul>
        <li>axis X is a range of possible steal chances from 1 to 100;</li>
        <li>
          axis Y is an actual chance to steal the item calculated over the 
          <span 
            id="tooltip-formula-target"
            class="tooltip-target"
          >formula</span>;
        <b-tooltip ref="tooltip" target="tooltip-formula-target" class="tooltip-formula">
          Y = base_item_chance * X * (1-sum(previous_slots_chances))
        </b-tooltip>
        </li>
      </ul>
      <p>calculation method is described at originsRO gitlab <a href="https://gitlab.com/OriginsRO/OriginsRO/issues/1002">issue#1002</a></p>
      <p>example of building a chance distribution chart in <a href="https://docs.google.com/spreadsheets/d/1PwyVIpNy8LgOO1erVUaP76AaaXHyFKz9uyYdfNNsjwQ/edit#gid=895320786">google spreadsheets</a></p>
      <p>monster list (pre-re/mob_db.conf) is taken from <a href="https://github.com/HerculesWS/Hercules/blob/stable/db/pre-re/mob_db.conf">github.com/HerculesWS</a> and converted to <a href="https://files.catbox.moe/hg7pju.json">json</a></p>
    </b-modal>
  </div>
</template>

<script>
import Mobtable from '~/components/Mobtable.vue'
import Plot from '~/components/Plot.vue'

export default {
  components: {
    Mobtable,
    Plot
  },
  computed: {
    monster_dex() { return this.$store.state.mob_selected ? 
                           this.$store.state.mob_selected.Stats.Dex :
                           null },
    drop() { return this.$store.state.mob_selected ? 
                    this.dropsToList(this.$store.state.mob_selected.Drops) :
                    [] },
    steal_chance() {
      const monster_dex = parseInt(this.monster_dex);
      const player_dex  = parseInt(this.player_dex);
      const steal_level = parseInt(this.steal_level);
      const steal_bonus = parseInt(this.steal_bonus);
      return this.calc_steal_chance(monster_dex, player_dex, steal_level, steal_bonus);
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.resizeBlocks);
      this.resizeBlocks();
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeBlocks);
  },
  data() {
    return {
      player_dex: null,
      steal_level: null,
      steal_bonus: 0,
      server_rate: 5,
      plotData: null,
      calc_chance_on_dex: false,
      plotOptions: {
        responsive: true, 
        maintainAspectRatio: false,
      }
    }
  },
  watch: {
    player_dex: function() {
      this.chk_use_dex_change();
    },
    steal_level: function() {
      this.chk_use_dex_change();
    },
    steal_bonus: function() {
      this.chk_use_dex_change();
    },
    server_rate: function() {
      this.chk_use_dex_change();
    },
    calc_chance_on_dex: function() {
      this.chk_use_dex_change();
    }
  },
  methods: {
    resizeBlocks(event) {
      const body = document.querySelector('body');
      const filter_input = document.querySelector('#mob_filter');
      const mobtable = document.querySelector('.mobtable-container');
      const stats = document.querySelector('.stats');
      const droptable = document.querySelector('.droptable');

      // let the css work for a mobile version
      if (window.matchMedia('(max-width: 768px)').matches || (event && event.target.outerWidth < 768)) {
        mobtable.style.maxHeight = "";
        droptable.style.maxHeight = "";
        return;
      }

      // add function to calc real height
      // https://stackoverflow.com/a/50490646
      function getRealHeight(el, justMargins=false) {
          var element = el,
              height = element.getBoundingClientRect().height,
              style = window.getComputedStyle(element);
          if (justMargins) {
              height = 0;
          }
          height = ["top", "bottom"]
            .map(function(side) {
              return parseInt(style['margin-' + side], 10) + parseInt(style['padding-' + side], 10)
            })
            .reduce(function(total, side) {
              return total + side
            }, height);
          return height;
      }

      mobtable.style.maxHeight = window.innerHeight
                               - getRealHeight(filter_input) 
                               - getRealHeight(mobtable, true)
                               + "px";
      droptable.style.maxHeight = window.innerHeight
                                - getRealHeight(stats) 
                                - getRealHeight(droptable, true)
                                + "px";
    },
    hide_tooltip() {
      this.$root.$emit('bv::hide::tooltip', 'tooltip_plot_dex');
    },
    dropsToList(list) {
      const that = this;
      if (list === undefined) {
        return [];
      }
      return list.map(function(item) {
        const chance = (Object.values(item)[0] / 100 * that.server_rate).toFixed(2);
        return {
          "Name": Object.keys(item)[0], 
          "Chance": chance > 100 ? 100 : chance,
        }
      });
    },
    drop_select(item, index) {
      const chosen_idx = index;
      this.$store.state.drop_index_selected = index;
      var x_axis = [];
      var y_axis = [];
      var result_chance;
      var accumulator;
      var steal_chance_iterator;
      const drops = this.dropsToList(this.$store.state.mob_selected.Drops);
      const MAX_X_AXIS = this.calc_chance_on_dex ? 150 : 100;
      if (this.calc_chance_on_dex) {
        var monster_dex = parseInt(this.monster_dex);
        var steal_level = parseInt(this.steal_level);
        var steal_bonus = parseInt(this.steal_bonus);
      }

      for (var i=1; i <= MAX_X_AXIS; i++) {
        x_axis.push(i);
        if (this.calc_chance_on_dex) {
          steal_chance_iterator = this.calc_steal_chance(monster_dex, i, steal_level, steal_bonus);
        } else {
          steal_chance_iterator = i;
        }
        accumulator = 0;
        for (var drop_idx=0; drop_idx<=chosen_idx; drop_idx++) {
          result_chance = drops[drop_idx].Chance * steal_chance_iterator * (1-accumulator) / 100 / 100;
          accumulator += result_chance;
        }
        y_axis.push((result_chance * 100).toFixed(2));
      }
      this.fillData(x_axis, y_axis);
    },
    chk_use_dex_change() {
      if (this.$store.state.drop_index_selected) {
        this.drop_select(undefined, this.$store.state.drop_index_selected);
      }
    },
    calc_steal_chance(monster_dex, player_dex, steal_level, steal_bonus) {
      var steal_chance = (player_dex - monster_dex)/2 + steal_level*6 + 4 + steal_bonus || 0;
      return steal_chance > 100 ? 100 : (steal_chance < 0 ? 0 : steal_chance)
    },
    fillData(x_axis, y_axis) {
      const that = this;
      var x_point;
      if (this.calc_chance_on_dex) {
        x_point = this.player_dex;
      } else {
        x_point = this.steal_chance;
      }
      var datasets = [];
      datasets.push({
        label: this.calc_chance_on_dex ? 'player dex' : 'player steal chance',
        backgroundColor: '#FF0000',
        data: [{x: Math.round(x_point), y: y_axis[Math.round(x_point)-1]}],
      });
      datasets.push({
        label: '% to steal',
        backgroundColor: '#ADD8E6',
        data: y_axis,
      });
      this.plotData = {
        labels: x_axis,
        datasets: datasets
      };
      /*
      this.plotOptions = {
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: x_label
            }
          }],
        }
      };
    */
    }
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  max-height: 100vw;
}

tbody > tr {
  cursor: pointer;
}

.body-container {
  display: flex;
  flex-direction: row;
}

.mobtable-container {
  overflow-y: scroll;
  min-width: 25vw;
}

.calc {
  display: flex;
  flex-direction: column;
  min-width: 25vw;
}

.droptable {
  overflow-y: scroll;
}

.chart {
  width: 100%;
  position: relative;
}

@media (max-width: 768px) {
  .body-container {
    display: block;
  }
  .mobtable-container {
    max-height: 40vh; /* switch to using select2 dropdown */
    overflow-y: scroll;
    width: auto;
    margin-bottom: 1rem;
  }
  .calc {
    margin-bottom: 1rem;
    width: auto;
  }
  .droptable {
    max-height: none;
    order: -1;
  }
}

.info {
  height: 8rem;
  font-size: small;
  margin-top: 2rem;
  margin-left: 4rem;
  margin-right: 4rem;
}

.info-faq .img {
  background-image: url('~static/faq.svg');
  width: 4rem;
  height: 4rem;
  background-size: 100% auto;
  position: relative;
  cursor: pointer;
}

.tooltip-target {
  border-bottom: 1px blue dashed;
  cursor: pointer;
}

.tooltip .tooltip-inner {
	max-width: 100%; 
}
</style>
