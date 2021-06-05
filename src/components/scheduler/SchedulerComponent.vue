<template>
  <div class="scheduler-component vld-parent">
    <loading :active.sync="isLoading" 
      :is-full-page="true"></loading>
    <div class="top-header bg-secondary">
      <div>
        <flat-date-picker
          :config="config"
          v-model="range"
          @change="onRangeDateChange"
          :defaultView.sync="defaultView"
        ></flat-date-picker>
      </div>
      <label class="toggleSwitch xlarge">
        <input type="checkbox" v-model="today_checked" @change="changeMode()" />
        <span>
          <span>View today</span>
          <span>View today</span>
        </span>
        <a></a>
      </label>
    </div>
    <scheduler
      ref="scheduler"
      :resources="schedulerConfig.resources"
      :column="schedulerConfig.column"
      :events="schedulerConfig.events"
      :minHeight="schedulerConfig.minHeight"
      :startDate.sync="schedulerConfig.startDate"
      :endDate.sync="schedulerConfig.endDate"
      :viewPreset="schedulerConfig.viewPreset"
      :rowHeight="schedulerConfig.rowHeight"
      :barMargin="schedulerConfig.barMargin"
      :multiEventSelect="schedulerConfig.multiEventSelect"
      :mode="schedulerConfig.mode"
      :event-renderer="schedulerConfig.eventRenderer"
      :listeners="listeners"
      :force-fit="false"
      :allowOverlap="true"
      :eventMenuFeature="schedulerConfig.features.eventMenu"
    ></scheduler>
    <div class="row" style="justify-content: flex-end;">
      <label v-for="d in departments" :key="d.departmentId">
        <input
          type="radio"
          name="department"
          :value="d.departmentId"
          v-model="activeDepartment"
          :checked="d.departmentId==activeDepartment"
          @click="getEvents(d.departmentId)"
        />
        <div class="box">
          <span>{{d.departmentName}}</span>
        </div>
      </label>
    </div>
    <v-dialog persistent v-model="eventDialog" max-width="450">
      <new-project
        v-if="!isOutOfOfficeMode && isProjectMode"
        :editMode="editMode"
        :projects="projects"
        :locations="locations"
        :projectManagers="projectManagers"
        :projectDevelopers="projectDevelopers"
        :projectManagerLocations="projectManagerLocations"
        :projectDeveloperLocations="projectDeveloperLocations"
        :listOfValues="listOfValues"
        :eventDetail="eventDetail"
        :resourceId="resourceId"
        :departmentId="activeDepartment"
        :clients="clients"
        :popupProjects="popupProjects"
      ></new-project>
      <out-of-office 
        v-if="!isProjectMode && isOutOfOfficeMode"
        :editMode="editMode"
        :eventDetail="eventDetail"
        :resourceId="resourceId"
        :departmentId="activeDepartment"
        :projectRevisionId="projectRevisionId"
      >
      </out-of-office>
    </v-dialog>
  </div>
</template>

<script>
// scheduler and its config
import Scheduler from "bryntum-vue-shared/src/Scheduler.vue";
// we need to import it here because it comes from the package
import "bryntum-scheduler/scheduler.stockholm.css";
 // Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import OutOfOffice from "./OutOfOffice";
import NewProject from "./NewProject";
import FlatDatePicker from "../common/FlatDatePicker";
import SchedulerMixin from "../../mixins/SchedulerMixin";
export default {
  name: "SchedulerComponent",
  mixins: [SchedulerMixin],
  components: {
    Loading,
    FlatDatePicker,
    Scheduler,
    OutOfOffice,
    NewProject,
  },
  data() {
    return {
    isInitialDataLoaded: false,
    isSeachMode: false,
    isLoading: true,
    isProjectMode: true,
    isOutOfOfficeMode: false,
    config: { mode: "range", dateFormat: "Y-m-d", wrap: true, altInput: true, altFormat: "M d, Y" },
    range: {},
    defaultView: 'today',
    parseFormat: "YYYY-MM-DD",
    eventDialog: false,
    editMode: false,
    projectRevisionId: 0,
    eventDetail: null,
    resourceId: '',
    listOfValues: [],
    locations: [],
    employees: [],
    clients : [],
    departments: [],
    projectManagers: [],
    projectDevelopers: [],
    projectManagerLocations: [],
    projectDeveloperLocations: [],
    events: [],
    activeDepartment: 1,
    projects: [],

    popupProjects : [],

    schedulerConfig: {
      minHeight: "50em",
      resources: [],
      events: [],
      startDate: new Date(2020, 9, 13, 9),
      endDate: new Date(2020, 9, 13, 18),
      viewPreset: "hourAndDay",
      rowHeight: 50,
      barMargin: 2,
      multiEventSelect: true,
      mode: "vertical",
      resourceImagePath: "users/",
      // Custom event renderer
      eventRenderer : ({ eventRecord }) => {

          this.popupProjects.push(eventRecord);

          return `
              <div class="" style="height:100%">
                  <div class="name">${eventRecord.addressLine1?eventRecord.addressLine1:eventRecord.projectType}
                  </div>
                  <div class="location">${eventRecord.locationName?eventRecord.locationName:''}
                    <p>(${eventRecord.status})</p>
                  </div>
                  <div class="clientName" style="position:absolute;bottom:5px;right:3px">${eventRecord.clientName?eventRecord.clientName:''}</div>
              </div>
              `;
      },

      columns : [
          { text : 'Name', field : 'name', width : '100%' }
      ],
      features    : {
        eventMenu  : {
            items : {
                // custom item with inline handler
                schedule : {
                    text   : 'Schedule',
                    weight : 200,
                    ref:"schedule-item"
                },
                hold : {
                    text   : 'Hold',
                    weight : 200
                },
                split : {
                    text   : 'Split',
                    weight : 200
                },
                edit : {
                    text   : 'Edit',
                    weight : 200
                },
                duplicate : {
                    text   : 'Duplicate',
                    weight : 200
                },
                delete : {
                    text   : 'Delete',
                    weight : 200
                },
            }
        }
    }, // eo features
    }, // eo schedulerConfig,
    listeners: {
        beforeEventEdit: this.beforeEventEditHandler,
        afterEventDrop: this.afterEventDropHandler,
        contextMenuItem: this.contextMenuItemHandler,
        eventResizeEnd: this.eventResizeEndHandler
    },
    today_checked: true
    //value: ''
    }
  },
  created() {
    const self = this;
    this.$events.on("close-dialog", val => {
      self.eventDialog = false;
    });
    this.$events.on("dialog-mode", projectMode => {
      // self.eventDetail = {};
      self.editMode = false;
      if (projectMode) {
        self.isProjectMode = true;
        self.isOutOfOfficeMode = false;
      } else {
        self.isProjectMode = false;
        self.isOutOfOfficeMode = true;
      }
    });
    this.$events.on("fetch-events",option =>{
        self.getEvents(self.activeDepartment);
    });
    this.$events.on("search-events", searchQuery => {
      let data = {...searchQuery, departmentId: self.activeDepartment }
      self.axios.post(`ProjectReview/GetEventsBySearchFilter`, data)
        .then((res)=>{
          self.isSeachMode = true;
          let result = res.data.data;
          self.range.start = result.startDate;
          self.range.end = result.endDate;
          self.onRangeDateChange();
          self.events = result.eventInfo;
          self.mapEvent(self.events);
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally((res)=>{
          self.isSeachMode = false;
        })
    });
  },
  mounted() {
    const self = this;
    self.axios
      .get("SchedulerInfo/GetInfo")
      .then(res => {
        if (res && res.data) {
          let data = res.data.data;
          self.departments = data.departments;
          self.locations = data.location;
          self.listOfValues = data.listOfValue;
          self.projectManagers = data.projectManager;
          self.projectDevelopers = data.projectDeveloper;
          self.projects = data.projectNumber;
          self.projectManagerLocations = data.projectManagerLocations;
          self.projectDeveloperLocations = data.projectDeveloperLocations;
          self.clients = data.clients;
          self.schedulerConfig.resources = self.employees = data.resources
            .map(item => {
              return {
                id: item.employeeId,
                name: item.firstName,
                departmentId: item.departmentId
              };
            });
          
        }
      })
      .finally(() => {
        self.isInitialDataLoaded = true;
        this.getEvents(this.activeDepartment);
      });
  },
  watch: {
  },
  methods: {
    beforeEventEditHandler(e){
      this.onAddOrEdit(e);
      return false;
    },
    afterEventDropHandler({context}){
      let data = context.record.data.event.data;
      this.alterRevision('drag', data);
    },
    eventResizeEndHandler(data){
      this.alterRevision('resize', data.eventRecord.data);
    },
    contextMenuItemHandler(data){
      const self = this;
      switch(data.item.text){
        case 'Schedule':{
          // self.onAddOrEdit(data, true)
           self.changeProjectStatus('Active', data.eventRecord.data.projectId);
          break;
        }
        case 'Hold':{
          self.changeProjectStatus('Pending', data.eventRecord.data.projectId);
          break;
        }
        case 'Split':{
          console.log('Split');
          self.splitRevision(data.eventRecord.data.revisionId)
          break;
        }
        case 'Edit':{
          self.onAddOrEdit(data);
          break;
        }
        case 'Duplicate':{
          console.log('Duplicate');
          self.duplicateRevision(data.eventRecord.data.revisionId)
          break;
        }
        case 'Delete':{
          self.deleteScheduledRevision(data.eventRecord.data.revisionId)
          break;
        }
      }
    },
    alterRevision(option, data){
      const self = this;
      let { startDate, endDate, resourceId, revisionId, projectId } =  data;
      console.log('after drop', {startDate, endDate, resourceId, revisionId, projectId});
      let reqData = {
        startDate: startDate.toLocaleString(),
        endDate: endDate.toLocaleString(),
        resourceId: (option === 'drag')?resourceId:-1,
        revisionId,
        projectId
      }
      console.log('after resize', {startDate, endDate, resourceId, revisionId, projectId });
      self.axios.post(`ProjectReview/AlterRevision`, reqData)
       .then((res)=>{
          console.log('updated', res)
       }).finally(()=>{

       })
    },
    onRangeDateChange(){
      let newDate = "now";
      let todayDate = this.$momentLocal(newDate).format(this.parseFormat);
      if(todayDate === this.range.start && todayDate === this.range.end){
        this.today_checked = true;
        this.defaultView = 'today';
      }else{
        this.today_checked = false;
        this.defaultView = 'all';
      }
      let splittedStartDate = this.range.start.toString().split("-");
      let splittedEndDate = this.range.end.toString().split("-");
      console.log(splittedStartDate);
      console.log(splittedEndDate)
      this.schedulerConfig.startDate = new Date(splittedStartDate[0], splittedStartDate[1]-1, splittedStartDate[2], 9);
      this.schedulerConfig.endDate = new Date(splittedEndDate[0], splittedEndDate[1]-1, splittedEndDate[2], 18);
      if(this.isInitialDataLoaded && !this.isSeachMode){
        this.getEvents(this.activeDepartment);
      }
    },
    changeMode() {
      const self = this;
      if (this.today_checked) {
        self.defaultView = 'today'
      }else{
        self.defaultView = 'all'
      }
    },
    getEvents(departmentId) {
      const self = this;
      let startDate = self.range.start;
      let endDate = self.range.end;
      self.schedulerConfig.resources = self.employees.filter(
        i => i.departmentId == departmentId
      );
      self.schedulerConfig.resources = (self.schedulerConfig.resources.length)?self.schedulerConfig.resources:[];
      self.isLoading = true;
      self.axios.get(`ProjectReview/GetEvents?startDate=${startDate}&endDate=${endDate}&departmentId=${departmentId}`)
       .then((res)=>{
         self.events =  res.data.data;
         self.mapEvent(self.events);
       }).finally(()=>{
        self.eventDialog = false;
        self.isLoading = false;
       })

    },
    onAddOrEdit(e,isNew=false){
      const self = this;
      self.resourceId = e.resourceRecord.data.id;
      if (e.eventRecord.data.hasOwnProperty("revisionId") && e.eventRecord.data.revisionId && !isNew) {
        self.editMode = true;
        self.projectRevisionId = e.eventRecord.revisionId;
        self.axios.get(`ProjectReview/GetEventByRevisionId?id=${self.projectRevisionId}`)
          .then((res)=>{
            self.eventDetail =  res.data.data.length?res.data.data[0]:{};
          if(self.eventDetail.project.projectType === 'ClientProject'){
            self.isProjectMode = true;
            self.isOutOfOfficeMode = false;
          }else{
            self.isProjectMode = false;
            self.isOutOfOfficeMode = true;
          }
          }).finally(()=>{
          self.eventDialog = true;

        })
      } else {
        self.eventDetail = {startDate: e.eventRecord.data.startDate, endDate: e.eventRecord.data.endDate};
        self.editMode = false;
        self.isProjectMode = true;
        self.isOutOfOfficeMode = false;
        self.eventDialog = true;
      }
    },
    mapEvent(data){
      const self = this;
      self.schedulerConfig.events = data.map((item)=>{
        let isProject = item.projectType === 'ClientProject';
        return {
        ...item,
        id:item.projectRevisionId,
        resourceId:item.employeeId,
        name: (isProject?item.clientName:item.projectType),
        eventColor: isProject?item.styleBackGroundColor:'#bdbdbd',
        style: `opacity:0.8;border: 1px solid ${isProject?item.styleBorder:'#FFFF'}; border-radius: 5px; color:'#FFFF'}`
        }
        });
    }
  }
};
</script>
<style lang="scss"></style>
