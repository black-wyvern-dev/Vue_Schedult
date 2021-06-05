<template>
  <div class="datepicker-div">
    <v-menu
      ref="open"
      :close-on-content-click="false"
      v-model="open"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="inner" :style="dateFormatted.indexOf('~')>-1?'width:470px':'width:285px'">
          <v-btn class="datepicker-icon" outlined x-small fab color="#9da4c2" @click="prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-text-field
            v-model="dateFormatted"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
          <v-btn class="datepicker-icon" outlined fab color="#9da4c2" @click="next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </template>
      <v-date-picker
        v-model="dates"
        no-title
        @input="hideDatePicker"
        persistent
        range
        :allowed-dates="allowedDates"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    value: {
      type: [Array],
      required: true,
    },
  },
  data: () => ({
    dates: [],
    dateFormatted: '',
    open: false,
    
  }),
  created() {
    this.dates = this.value;
  },
  methods: {
    formatDate(dates) {
      if (!dates.length) return '';
      let startDate =  dates[0];
      let endDate = dates[1];
      if(endDate){
        let cStartDate = this.$moment(new Date(startDate)).add(1, 'day').format("dddd, MMM DD, YYYY");
        let cEndDate = this.$moment(new Date(endDate)).add(1, 'day').format("dddd, MMM DD, YYYY");
        if(cStartDate == cEndDate){
          return cStartDate;
        }
        return cStartDate + " ~ " + cEndDate;
      }else{
        return this.$moment(new Date(startDate)).add(1, 'day').format("dddd, MMM DD, YYYY");
      }
    },
    prev() {
      let startDate =  this.$moment(new Date(this.dates[0])).add(1, 'day');
      this.dates = [this.$moment(new Date(startDate)).subtract(1, 'day').format("YYYY-MM-DD"),this.$moment(new Date(startDate)).subtract(1, 'day').format("YYYY-MM-DD")]
    },
    next() {
      let startDate =  this.$moment(new Date(this.dates[0])).add(1, 'day');
      this.dates = [this.$moment(new Date(startDate)).add(1, 'day').format("YYYY-MM-DD"),this.$moment(new Date(startDate)).add(1, 'day').format("YYYY-MM-DD")]
    },
    allowedDates(val) {
      const self=  this;
      let startDate = self.dates[0];
      return true;
    },
    hideDatePicker(){
      const self = this;
      //self.open = false;
      
      if(self.dates.length>1){
         self.open = false;
      }
    }
  },
  watch: {
    dates() {
      this.dateFormatted = this.formatDate(this.dates);
    },
    dateFormatted(val) {
      // this.date = this.$moment(new Date(val), "YYYY-MM-DD").format(
      //   "YYYY-MM-DD"
      // );
      this.$emit(
        "input",
        this.dates
      );
      this.$emit(
        "change",
        this.dates
      );
    },
    value(val) {
      this.dates = val;
    }
  },
};
</script>
<style lang="scss" scoped>
.datepicker-div,
.inner {
  display: flex;
  align-items: center;
}
.datepicker-icon {
  height: 20px!important;
  width: 20px!important;
  &:first-child {
    margin-right: 30px;
  }
}
</style>
