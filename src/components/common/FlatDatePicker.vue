<template>
  <div class="d-flex">
          <v-btn class="datepicker-icon" outlined x-small fab color="#9da4c2" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        <flat-pickr
          v-model="date"
          placeholder="Select date"
          name="date"
          class="input-date-picker transparent w-180"
          :config="config"
          autocomplete="off"
          data-input
          @on-open="pickerOpened"
          @on-close="pickerClosed"
        />
          <v-btn class="datepicker-icon" outlined x-small fab color="#9da4c2" @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
  </div>
</template>

<script>
export default {
  name: "flat-date-picker",
  props: {
    config: {
      type: Object,
      required: true,
    },
    defaultView: {
      type: String,
      default: "today",
    }
  },
  data: () => {
    return {
      date: '',
      range: {
        start: new Date(),
        end: new Date(),
      },
      viewMode: "today",
      parseFormat: "YYYY-MM-DD",
      pickerOpen: false,
    };
  },
  created() {
    this.viewMode = this.defaultView;
    let start, end;
    if(this.viewMode == 'today'){
        start = this.$momentLocal("now").format(this.parseFormat);
        end = this.$momentLocal("now").format(this.parseFormat);
    }
    if(this.config.mode === 'single') {
      this.date = start;
    } else {
      this.date = start +' to '+ end;
    }
  },
  watch: {
    date(val) {
      this.dateToRange(val);
    },
    defaultView(val) {
      if(this.viewMode !== this.defaultView){
        this.viewMode = this.defaultView;
      }
    },
    pickerOpen(isOpen){
       if(isOpen == false && this.range.start == this.range.end){
            this.$emit("input", this.range);
            this.$emit("change", this.range);
       }
    },
    viewMode(val) {
      let start, end ;
      let newDate = "now";
      if(val === 'today'){
          start = this.$momentLocal(newDate).format(this.parseFormat);
          end = this.$momentLocal(newDate).format(this.parseFormat);
      }else{
          start = this.range.start;
          end = this.range.end;
      }
      if(this.config.mode === 'single') {
        this.date = start;
      } else {
        this.date = start +' to '+ end;
      }
    }
  },
  methods: {
    next() {
      let start, end;
        start = this.$momentLocal(this.range.start).add(1,'days').format(this.parseFormat);
        end = this.$momentLocal(this.range.start).add(1,'days').format(this.parseFormat);
      if(this.config.mode === 'single') {
        this.date = start;
      } else {
        this.date = start +' to '+ end;
      }
    },
    prev() {
      let start, end;
        start = this.$momentLocal(this.range.start).subtract(1,'days').format(this.parseFormat);
        end = this.$momentLocal(this.range.start).subtract(1,'days').format(this.parseFormat);

      if(this.config.mode === 'single') {
        this.date = start;
      } else {
        this.date = start +' to '+ end;
      }
    },
    pickerOpened(selectedDates, dateStr, instance) { 
      this.pickerOpen = true;
    },
    pickerClosed(selectedDates, dateStr, instance) { 
      this.pickerOpen = false;
      // if we have one date and no ' to ' we set it
      if (this.config.mode === 'range') {
        if(selectedDates.length === 1){
          this.date = this.date + " to " + this.date;
        } else if (selectedDates.length === 2 && selectedDates[0].getTime() === selectedDates[1].getTime()) {
          this.date = this.date + " to " + this.date;
        }
      }
    },
    dateToRange(val) {
      if (!Array.isArray(val)) {
        let dateArr = val.split(" to ");
        if (dateArr.length > 1) {
          this.range = {
            start: dateArr[0],
            end: dateArr[1],
          };
        } else {
          this.range = {
            start: val,
            end: val,
          };
        }
        if(!this.pickerOpen && dateArr.length>1) { 
          this.$emit("input", this.range);
          this.$emit("change", this.range);
        }
      }
    }
  }
};
</script>
