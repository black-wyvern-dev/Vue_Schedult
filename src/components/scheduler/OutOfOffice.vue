<template>
  <div class="card">
    <div class="card-header bg-transparent">
      <dialog-header :projectMode="isProjectMode"></dialog-header>
    </div>
    <div class="card-body" style="font-size: 12px; background-color: #edf0f5">
      <b>Select type of time off</b>
      <br />
      <div class="switch-field">
        <input
          type="radio"
          id="radio-one"
          name="timeOff"
          v-model="event.projectType"
          value="OutOfOfficePTO"
        />
        <label for="radio-one">PTO</label>
        <input
          type="radio"
          id="radio-two"
          name="timeOff"
          v-model="event.projectType"
          value="OutOfOfficeSickDay"
        />
        <label for="radio-two">Sick day</label>
      </div>
      <div class="form-group d-flex align-items-center">
        <label for="selectTimePeriod" class="mb-0">
          <b>Select time period :</b>
        </label>
        <v-checkbox v-model="event.fullDay"></v-checkbox>
        <span>Full day</span>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="from">From</label>
          <v-menu
            v-model="startDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            class="custom-datepicker"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @input="startDatePicker = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div
          class="form-group col-md-6"
          style="margin-top: 8px"
          v-if="!event.fullDay"
        >
          <label for></label>
          <input
            type="time"
            class="form-control"
            name="start time"
            v-model="startTime"
            v-validate="'required'"
            id
            placeholder="00:00 AM"
          />
          <span class="text-danger text-sm">{{
            errors.first("start time")
          }}</span>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-sm-6">
          <label for="to">To</label>
          <v-menu
            v-model="endDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            class="custom-datepicker"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDate"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              @input="endDatePicker = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div
          class="form-group col-sm-6"
          style="margin-top: 8px"
          v-if="!event.fullDay"
        >
          <label for></label>
          <input
            type="time"
            class="form-control"
            id
            placeholder="00:00 AM"
            v-model="endTime"
            v-validate="'required'"
            name="end time"
          />
          <span class="text-danger text-sm">{{
            errors.first("end time")
          }}</span>
        </div>
      </div>
    </div>
    <div
      class="card-footer bg-transparent d-flex justify-content-center"
      v-if="!editMode"
    >
      <a
        style="float: right; color: blue"
        routerLink="javscript:void(0)"
        @click="scheduleOutOfOffice()"
      >
        <small>SCHEDULE</small>
      </a>
    </div>
    <div
      class="card-footer bg-transparent d-flex justify-content-between"
      v-else
    >
      <a routerLink="javscript:void(0)" @click="deleteOutOfOffice()">
        <small>DELETE</small>
      </a>
      <a
        style="color: blue"
        routerLink="javscript:void(0)"
        @click="updateOutOfOffice()"
      >
        <small>CHANGE</small>
      </a>
    </div>
  </div>
</template>
<script>
import DialogHeader from "./DialogHeader";
import SchedulerMixin from "../../mixins/SchedulerMixin";
export default {
  name: "OutOfOffice",
  mixins: [SchedulerMixin],
  components: {
    DialogHeader,
  },
  props: {
    resourceId: {
      type: [String, Number],
      default: "",
    },
    departmentId: {
      type: [String, Number],
      default: "",
    },
    eventDetail: {
      type: Object,
      default: () => null,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    projectRevisionId: {
      type: Number,
    },
  },
  data: () => ({
    isProjectMode: false,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    startDatePicker: false,
    endDatePicker: false,
    startTime: "",
    endTime: "",
    event: {
      projectRevisionId: "",
      projectType: "OutOfOfficePTO",
      resourceId: "",
      departmentId: "",
      fullDay: true,
      startDate: new Date(),
      endDate: new Date(),
    },
  }),
  created() {
    this.$events.on("dialog-mode", (projectMode) => {
      if (!projectMode) {
        self.isProjectMode = false;
      }
    });
  },
  mounted() {
    const self = this;
    self.mapDataToDialog();
  },
  watch: {
    eventDetail: {
      handler(val) {
        const self = this;
        self.mapDataToDialog();
      },
      deep: true,
    },
  },
  methods: {
    scheduleOutOfOffice() {
      const self = this;
      this.$validator.validate().then((valid) => {
        if (valid) {
          let e = self.event;
          if (!self.event.editMode) {
            let startDate = new Date(self.startDate + " " + self.startTime);
            let endDate = new Date(self.endDate + " " + self.endTime);
            if (self.event.fullDay) {
              startDate = new Date(self.startDate + " " + "09:30:00");
              endDate = new Date(self.endDate + " " + "16:30:00");
            }
            let data = {
              ProjectType: self.event.projectType,
              ResourceId: self.resourceId,
              Departmentid: self.departmentId,
              Allday: self.event.fullDay,
              StartDate: startDate.toLocaleString(),
              EndDate: endDate.toLocaleString(),
              Status: "Active",
            };
            self.axios
              .post(`ProjectReview/SaveOffDay`, data)
              .then((res) => {})
              .finally((d) => {
                self.$events.emit("close-dialog", [true]);
                self.$events.emit("fetch-events", ["fetch"]);
              });
          }
        }
      });
    },
    deleteOutOfOffice() {
      const self = this;
      self.deleteScheduledRevision(self.event.projectRevisionId);
    },
    updateOutOfOffice() {
      const self = this;
      let startDate = new Date(self.startDate);
      let endDate = new Date(self.endDate);
      if (self.event.fullDay) {
        startDate = new Date(self.startDate + " " + "09:30:00");
        endDate = new Date(self.endDate + " " + "16:30:00");
      } else {
        startDate = new Date(self.startDate + " " + self.startTime);
        endDate = new Date(self.endDate + " " + self.endTime);
      }
      let data = {
        ProjectType: self.event.projectType,
        ProjectId: self.eventDetail.projectId,
        ProjectRevisionId: self.eventDetail.projectRevisionId,
        ResourceId: self.resourceId,
        Departmentid: self.departmentId,
        Allday: self.event.fullDay,
        StartDate: startDate.toLocaleString(),
        EndDate: endDate.toLocaleString(),
        Status: "Active",
      };
      self.axios
        .post(`ProjectReview/UpdateOffDay`, data)
        .then((res) => {})
        .finally((d) => {
          self.$events.emit("close-dialog", [true]);
          self.$events.emit("fetch-events", ["fetch"]);
        });
    },
    mapEventData(data) {
      const self = this;
      if (Object.keys(data).length) {
        let project = data;
        if (self.editMode) {
          project = data.project;
        }
        return {
          projectRevisionId: data.projectRevisionId,
          projectType: project.projectType,
          fullDay: data.allDay,
          startDate: data.startDate,
          endDate: data.endDate,
        };
      }
      return {
        projectRevisionId: "",
        projectType: "OutOfOfficePTO",
        fullDay: true,
        startDate: new Date(),
        endDate: new Date(),
      };
    },
    mapDataToDialog() {
      const self = this;
      if (!self.editMode) {
        self.event = self.mapEventData({});
      } else {
        debugger
        console.log('data', self.eventDetail)
        self.event = self.mapEventData(self.eventDetail);
        self.startDate = new Date(self.event.startDate)
          .toISOString()
          .substr(0, 10);
        let endTempDate = new Date(self.event.endDate);
        self.endDate = `${endTempDate.getFullYear()}-${endTempDate.getMonth()+1}-${endTempDate.getDate()}`;
        self.startTime = this.$momentLocal(self.event.startDate)
          .format("HH:mm")
          .toString();
        self.endTime = this.$momentLocal(self.event.endDate)
          .format("HH:mm")
          .toString();
      }
    },
  },
};
</script>
<style lang="scss"></style>
