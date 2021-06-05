<template>
  <div class="card">
    <div class="card-header bg-transparent">
      <dialog-header :projectMode="isProjectMode"></dialog-header>
    </div>
    <div class="card-body" style="font-size: 12px; background-color: #edf0f5">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="clientname">CLIENT NAME</label>
          <!-- <input type="text" class="form-control" id="clientname" name="client name" v-model="event.clientName" v-validate="'required'" />
          <span class="text-danger text-sm">{{
            errors.first("client name")
          }}</span> -->
          <model-list-select
              :list="clients"
              v-model="event.clientName"
              option-value="clientId"
              option-text="clientName"
              :isDisabled="editMode"
              name = "client name"
              placeholder
              style = "width: 100% !important"
              v-validate = "'required'"
            ></model-list-select>
            <span class="text-danger text-sm">{{
            errors.first("client name")
          }}</span>

        </div>
        <div class="form-group col-md-6">
          <label for="projectnumber">PROJECT NUMBER</label>
          <div class="input-group">
            <model-list-select
              :list="projects"
              v-model="event.projectNumberId"
              option-value="projectNumberId"
              option-text="projectNumber"
              :isDisabled="editMode"
              placeholder
            ></model-list-select>
            <div class="input-group-append">
              <button
                class="btn btn-primary"
                type="button"
                @click.prevent="getProjectDetail(event.projectNumberId)"
                :disabled="editMode"
              >ADD</button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="address">ADDRESS</label>
          <input type="text" class="form-control" id="address" name="address" v-model="event.address" v-validate="'required'"/>
          <span class="text-danger text-sm">{{
            errors.first("address")
          }}</span>          
        </div>
        <div class="form-group col-md-6">
          <label for="nickname">NICKNAME</label>
          <input type="text" class="form-control" id="nickname" name="nick name" v-model="event.nickName" v-validate="'required'"/>
          <span class="text-danger text-sm">{{
            errors.first("nick name")
          }}</span>          
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="addDescriptors">ADD DESCRIPTORS</label>
          <select class="form-control" id="addDescriptors" name="descriptors" v-model="addressDescriptor" v-validate="'required'">
            <option disabled :value="null" selected>Select option</option>
            <option
              v-for="item in addressDescriptors"
              :key="item.id"
              :value="item.value"
            >{{item.text}}</option>
          </select>
          <span class="text-danger text-sm">{{
            errors.first("descriptors")
          }}</span>
        </div>
        <div
          class="form-group col-md-3"
          v-for="item in event.addressDescriptors"
          :key="item.addressDescriptorId"
        >
          <label :for="item.addressDescriptorType">{{item.addressDescriptorType}}</label>
          <input
            type="text"
            class="form-control"
            :id="item.addressDescriptorType"
            v-model="item.addressDescriptorValue"
          />
        </div>
      </div>
      <br />
      <div class="form-row">
        <div class="pl-2 d-flex align-items-center">
          <label for="location">LOCATION:</label>
          <v-select
            v-model="event.locationId"
            :items="locations"
            label="+ ADD PROJECT LOCATION"
            item-text="locationName"
            item-value="locationId"
            dense
            solo
            style="height:38px"
            name="location"
            v-validate="'required'"
          ></v-select>
          <span class="text-danger text-sm">{{
            errors.first("location")
          }}</span>
        </div>
        <div class="form-group col-md-6">
          <div class="bg-white p-2">
            <b>PROJECT MANAGER</b>
            <div class="project-dev-manager">
              <div v-for="loc in projectManagerLocations" :key="loc.id">
                <small
                  class="cursor-pointer"
                  @click="toggleProjectManager(loc.id)"
                >{{projectManagerActiveLocation == loc.id && showProjectManagers?'-':'+'}} {{loc.name}}</small>
                <ul v-if="projectManagerActiveLocation == loc.id && showProjectManagers">
                  <li
                    v-for="pmanager in loc.children"
                    :key="'d'+pmanager.id"
                    :class="event.projectManagerId==pmanager.id?'active':''"
                    @click="setProjectManager(pmanager)"
                  >{{pmanager.name}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group col-md-6">
          <div class="bg-white p-2">
            <b>PROJECT DEVELOPER</b>
            <div class="project-dev-manager">
              <div v-for="loc in projectDeveloperLocations" :key="loc.id">
                <small
                  class="cursor-pointer"
                  @click="toggleProjectDeveloper(loc.id)"
                >{{projectDeveloperActiveLocation == loc.id && showProjectDevelopers?'-':'+'}} {{loc.name}}</small>
                <ul v-if="projectDeveloperActiveLocation == loc.id && showProjectDevelopers">
                  <li
                    v-for="pdeveloper in loc.children"
                    :key="'d'+pdeveloper.id"
                    :class="event.projectDeveloperId==pdeveloper.id?'active':''"
                    @click="setProjectDeveloper(pdeveloper)"
                  >{{pdeveloper.name}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="hours">HOURS</label>
          <div class="d-flex bg-white p-2 justify-content-between">
            <h3>{{event.projectHour}}</h3>
            <span>
              Project
              <br />Hour
            </span>
            <div class="d-flex">
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="secondary"
                @click="operation('decrement','project')"
              >
                <v-icon dark>mdi-minus</v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="secondary"
                @click="operation('increment','project')"
              >
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="d-flex bg-white p-2 justify-content-between">
            <h3>{{event.revisionHour}}</h3>
            <span>
              This
              <br />Revision
            </span>
            <div class="d-flex">
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="secondary"
                @click="operation('decrement','revision')"
              >
                <v-icon dark>mdi-minus</v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="secondary"
                @click="operation('increment','revision')"
              >
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <div class="form-group col-md-4" v-if="isVisibleDetail">
          <label class="text-secondary">VIEW REVISION HISTORY</label>
          <div class="mt-4">
            <p class="text-secondary">DEVELOPER</p>
            <small>{{event.projectDeveloperName}}</small>
          </div>
          <div class="mt-4">
            <p class="text-secondary">PROJECT MANAGER</p>
            <small>{{event.projectManagerName}}</small>
          </div>
          <div class="mt-4">
            <p class="text-secondary">HOURS</p>
            <small>Hours: {{event.projectHour}} Revisions: {{event.revisionHour}}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer bg-transparent d-flex justify-content-between">
      <!-- <small v-if="!editMode">MARK AS PENDING</small> -->
        <div v-if="!editMode" class="cursor-pointer">
            <input class="s-card" type="checkbox" id="status" :value="isPending" :checked="isPending" @change="isPending=!isPending">
            <label for="status" class="cursor-pointer s-card-detail">
            <div class="">{{isPending?'PENDING':'MARK AS PENDING'}}</div>
            </label>
        </div>
      <div class="d-flex flex-row align-items-center" v-else>
        <small class="mr-2 text-danger cursor-pointer" @click="deleteRevision()">DELETE</small>
        <small class="mr-2 cursor-pointer" v-if="event.status!='Closed'" @click="changeStatus('Closed')">CLOSE PROJECT</small>
        <small class="mr-2 cursor-pointer" v-else @click="changeStatus('Active')">RE-OPEN PROJECT</small>
        <small class="mr-2 cursor-pointer" v-if="event.status!='Pending'" @click="changeStatus('Pending')">HOLD</small>
        <small class="mr-2 cursor-pointer" v-else @click="changeStatus('Active')">SCHEDULE</small>
      </div>
      <a
        style="float:right; color: blue"
        v-if="!editMode"
        routerLink="javscript:void(0)"
        @click="saveProjectRevWithPn"
      >
        <small>SCHEDULE PROJECT</small>
      </a>
      <a
        style="float:right; color: blue"
        v-else
        routerLink="javscript:void(0)"
        @click="updateEvent"
      >
        <small>SAVE</small>
      </a>
    </div>
    <ConfirmationBox
      v-show="isModalVisible"
      @close="isModalVisible=false"
    />
  </div>
</template>

<script>
import DialogHeader from "./DialogHeader";
import { ModelListSelect } from "vue-search-select";
import SchedulerMixin from "../../mixins/SchedulerMixin";

import ConfirmationBox  from "./../common/sampleModal.vue";


export default {
  name: "NewProject",
  mixins: [SchedulerMixin],
  components: {
    DialogHeader,
    ModelListSelect,
    ConfirmationBox
  },
  props: {
    popupProjects : {
      type:Array,
      default:() => null
    },
    clients : {
      type : Array,
      default : () => null
    },
    resourceId: {
      type: [String, Number],
      default: ""
    },
    departmentId: {
      type: [String, Number],
      default: ""
    },
    eventDetail: {
      type: Object,
      default: () => null
    },
    editMode: {
      type: Boolean,
      default: false
    },
    listOfValues: {
      type: Array,
      default: () => []
    },
    projects: {
      type: Array,
      default: () => []
    },
    locations: {
      type: Array,
      default: () => []
    },
    projectManagers: {
      type: Array,
      default: () => []
    },
    projectDevelopers: {
      type: Array,
      default: () => []
    },
    projectManagerLocations: {
      type: Array,
      default: () => []
    },
    projectDeveloperLocations: {
      type: Array,
      default: () => []
    }
  },
  destroyed : {
    modalunVisible () {
      this.isModalVisible = false;
    }
  },
  data: () => ({
    isVisibleDetail : false,
    isClicked : false,
    isModalVisible : false,
    isProjectMode: true,
    projectDeveloperActiveLocation: "",
    projectManagerActiveLocation: "",
    showProjectDevelopers: false,
    showProjectManagers: false,
    addressDescriptors: [],
    addressDescriptor: null,
    isPending: false,
    event: {
      clientName: "",
      projectNumberId: "",
      projectNumber: "",
      address: "",
      nickName: "",
      addressDescriptors: [],
      locationId: "",
      projectManagerId: "",
      projectDeveloperId: "",
      projectDeveloperName: "",
      projectManagerName: "",
      projectHour: 0,
      revisionHour: 0,
      status: 'Active'
    }
  }),
  created() {
    this.$events.on("dialog-mode", projectMode => {
      if (projectMode) {
        self.isProjectMode = true;
      }
    });
  },
  mounted() {
    const self = this;
    self.getAddressDescriptors();
    self.mapDataToDialog();
  },
  watch: {
    addressDescriptor: function(addressDescriptorValue) {
      const self = this;
      let ad = self.addressDescriptors.filter(
        item => item.value == addressDescriptorValue
      );
      if (ad.length) {
        let existing = self.event.addressDescriptors.filter(
          adItem => adItem.addressDescriptorType == ad[0].value
        );
        if (!existing.length) {
          self.event.addressDescriptors.push({
            addressDescriptorId: ad[0].id,
            addressDescriptorType: ad[0].text,
            addressDescriptorValue: ""
          });
        }
      }
    },
    'eventDetail': {
     handler(val){
      const self = this;
      self.mapDataToDialog();
     },
     deep: true
    }
  },
  methods: {
    AddRevision() {
      this.isClicked = true;
      this.isVisibleDetail = true;
      let revision_cnt = 0;
      const self= this;
      let total_hour = 0;
      console.log("-------------------")
      console.log(self.event);

      console.log("-================-")
      console.log(this.popupProjects);

      self.showProjectDevelopers = true;
      self.showProjectManagers = true;
      
      this.popupProjects.map((item) => {
        if ( item.clientName == self.event.clientName) {
        console.log(item.clientName, self.event.clientName);
          revision_cnt ++;
          self.event.projectNumberId = item.projectId;
          self.event.projectNumber = item.projectNumber;
          self.event.address = item.addressLine1;
          self.event.nickName = "client";
          self.event.locationId = item.locationId;
          self.event.projectManagerId = item.projectManagerId;
          self.event.projectDeveloperId = item.projectDeveloperId;
          self.event.projectDeveloperName = item.projectDeveloperName;
          self.event.projectManagerName = item.projectManagerName;
          self.event.status = 'Active';
          total_hour += item.projectHour;
        }
      });
      self.event.revisionHour = revision_cnt;
      self.event.projectHour = 0;
    },
    setProjectManager(item) {
      const self = this;
      self.event.projectManagerId = item.id;
      self.event.projectManagerName = item.name;
    },
    setProjectDeveloper(item) {
      const self = this;
      self.event.projectDeveloperId = item.id;
      self.event.projectDeveloperName = item.name;
    },
    getAddressDescriptors() {
      const self = this;
      self.addressDescriptors = self.listOfValues.filter(
        item => item.category == "AddressDescriptor"
      );
    },
    getSelectedProject(pno) {
      const self = this;
      let tempProjects = self.projects;
      let data = tempProjects.filter(item => item.projectNumber === pno);
      if (data.length) {
        data = data[0];
        self.event = self.mapEventData(data);
        self.showProjectDevelopers = true;
        self.showProjectManagers = true;
      }
    },
    getProjectDetail(projectNumberID) {
      const self = this;
      self.axios
        .get(`ProectNumber/${projectNumberID}`)
        .then(res => {
          self.event = self.mapEventData(res.data);
          self.event.projectHour = 0;
          self.event.revisionHour = 0;
          self.showProjectDevelopers = true;
          self.showProjectManagers = true;
        })
        .finally(() => {});
    },
    saveProjectRevWithPn() {
      //schedule project revision with project number
      const self = this;
      
      if (self.isClicked == false){
        let eventLength = this.popupProjects.length;
        console.log(eventLength);
        for (var i= 0 ; i < eventLength; i++){
          if (this.popupProjects[i].clientName == self.event.clientName){
            // document.getElementById('confirmModal').classList.add('show');
            // document.getElementById('confirmModal').role="dialog";
            // document.getElementById('confirmModal').style.display = "block";
            this.isModalVisible = true;
            this.currentClientId = self.event.clientName;
            return;
            break;
          }
        }
      }

      this.$validator.validate().then((valid) => {
      if (valid) {
      let e = self.event;
      let pHour = e.projectHour ? e.projectHour : 1;
      let startDate = self.eventDetail.startDate;
      let endDate = self.eventDetail.startDate;
      endDate = new Date(endDate);
      console.log('event', e)
      endDate.setTime(endDate.getTime() + pHour * 60 * 60 * 1000);

      let data = {
        ProjectType: "ClientProject",
        ResourceId: self.resourceId,
        Departmentid: self.departmentId,
        Allday: 0,
        StartDate: self.eventDetail.startDate.toLocaleString(),
        EndDate: endDate.toLocaleString(),
        ClientName: e.clientName,
        Address1: e.address,
        Address2: null,
        City: null,
        State: null,
        Status: self.isPending?'Pending':'Active',
        ZipCode: "",
        NickName: e.nickName,
        LocationId: e.locationId,
        ProjectId: e.projectNumberId,
        AddressDescriptors: e.addressDescriptors,
        ProjectHours: e.projectHour,
        NumberOfRevision: e.revisionHour,
        ProjectDeveloperId: e.projectDeveloperId,
        ProjectManagerId: e.projectManagerId,
        projectNumbers: null
      };
      if (!self.editMode && e.projectNumberId && e.projectNumber) {
        self.axios
          .post(`ProjectReview/SaveRevisionWithProjectNumber`, data)
          .then(res => {
          })
          .finally(d => {
            self.$events.emit("close-dialog", [true]);
            self.$events.emit("fetch-events", ["fetch"]);
          });
      } else {
        // schedule project revision without project number
        delete data.ProjectId;
        self.saveProjectRevWithoutPn(data);
      }
      }
      });
    },
    saveProjectRevWithoutPn(data) {
      const self = this;
      self.axios
        .post(`ProjectReview`, data)
        .then(res => {
        })
        .finally(d => {
          self.$events.emit("close-dialog", [true]);
          self.$events.emit("fetch-events", ["fetch"]);
        });
    },
    updateEvent() {
      const self = this;
      let e = self.event;
      let pHour = e.projectHour ? e.projectHour : 1;
      let startDate = self.eventDetail.startDate;
      let endDate = self.eventDetail.startDate;
      endDate = new Date(endDate);
      console.log('event', e)
      endDate.setTime(endDate.getTime() + pHour * 60 * 60 * 1000);
      let data = {
        ProjectType: "ClientProject",
        ResourceId: self.resourceId,
        Departmentid: self.departmentId,
        Allday: 0,
        StartDate: self.eventDetail.startDate.toLocaleString(),
        EndDate: endDate.toLocaleString(),
        ClientId: self.eventDetail.project.projectNumber.clientId,
        ClientName: e.clientName,
        Address1: e.address,
        Address2: null,
        City: null,
        State: null,
        Status: self.isPending?'Pending':'Active',
        ZipCode: "",
        NickName: e.nickName,
        LocationId: e.locationId,
        ProjectId: self.eventDetail.projectId,
        ProjectNumberId: e.projectNumberId,
        AddressDescriptors: e.addressDescriptors,
        ProjectHours: e.projectHour,
        NumberOfRevision: e.revisionHour,
        ProjectDeveloperId: e.projectDeveloperId,
        ProjectManagerId: e.projectManagerId,
        ProjectRevisionId: self.eventDetail.projectRevisionId,
        projectNumbers: null
      };
      console.log('event update', self.event)
      console.log('event detail', self.eventDetail)
      self.axios
        .put(`ProjectReview`, data)
        .then(res => {
        })
        .finally(d => {
          self.$events.emit("close-dialog", [true]);
          self.$events.emit("fetch-events", ["fetch"]);
        });

    },
    deleteRevision() {
      const self= this;
      self.deleteScheduledRevision(self.eventDetail.projectRevisionId);
    },
    changeStatus(option){
      const self = this;
      self.changeProjectStatus(option, self.eventDetail.projectId);
    },
    mapEventData(data,option) {
      const self = this;
      if (Object.keys(data).length) {
        let project = data;
        if (self.editMode) {
          project = data.project.projectNumber;
        }
        self.projectDeveloperActiveLocation = project.locationId;
        self.projectManagerActiveLocation = project.locationId;
        return {
          projectNumberId: project.projectNumberId,
          clientName: project.client.clientName,
          projectNumber: project.projectNumber,
          status: (self.editMode)?data.project.status:self.isPending?'Pending':'Active',
          address: project.addressLine1,
          nickName: project.nickName,
          addressDescriptors: project.addressDescriptors || [],
          locationId: project.locationId,
          projectManagerId: project.projectManagerId,
          projectDeveloperId: project.projectDeveloperId,
          projectManagerName: project.projectManager.projectManagerName,
          projectDeveloperName: project.projectDeveloper.projectDeveloperName,
          projectHour: data.hours,
          revisionHour: data.revisionNumber
        };
      }
      return {
        projectNumberId: "",
        clientName: "",
        projectNumber: "",
        status: self.isPending?'Pending':'Active',
        address: "",
        nickName: "",
        addressDescriptors: [],
        locationId: "",
        projectManagerId: "",
        projectDeveloperId: "",
        projectHour: 0,
        revisionHour: 0
      };
    },
    mapDataToDialog(data) {
      const self = this;
      self.isVisibleDetail = self.editMode;
      if (!self.editMode) {
        self.event = self.mapEventData({});
        self.showProjectDevelopers = false;
        self.showProjectManagers = false;
      } else {
        self.event = self.mapEventData(self.eventDetail);
        self.showProjectDevelopers = true;
        self.showProjectManagers = true;
      }
    },
    // Increment or Decrement
    operation(type, option) {
      const self = this;
      let pHourString = self.event.projectHour.toString();
      let pHourInteger = self.isNumeric(pHourString)
        ? parseInt(pHourString)
        : 0;
      let rHourString = self.event.revisionHour.toString();
      let rHourInteger = self.isNumeric(rHourString)
        ? parseInt(rHourString)
        : 0;
      switch (type) {
        case "increment": {
          if (option === "project") {
            self.event.projectHour = pHourInteger + 1;
          } else {
            self.event.revisionHour = rHourInteger + 1;
          }
          break;
        }
        case "decrement": {
          if (option === "project") {
            self.event.projectHour = pHourInteger ? pHourInteger - 1 : 0;
          } else {
            self.event.revisionHour = rHourInteger ? rHourInteger - 1 : 0;
          }
          break;
        }
      }
    },
    toggleProjectDeveloper(lID) {
      const self = this;
      if (lID == self.projectDeveloperActiveLocation) {
        self.showProjectDevelopers = !self.showProjectDevelopers;
      } else {
        self.projectDeveloperActiveLocation = lID;
        self.showProjectDevelopers = true;
      }
    },
    toggleProjectManager(lID) {
      const self = this;
      if (lID == self.projectManagerActiveLocation) {
        self.showProjectManagers = !self.showProjectManagers;
      } else {
        self.projectManagerActiveLocation = lID;
        self.showProjectManagers = true;
      }
    },
    isNumeric(str) {
      if (typeof str != "string") return false; // we only process strings!
      return (
        !isNaN(str) && !isNaN(parseFloat(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      ); // ...and ensure strings of whitespace fail
    }
  }
};
</script>
<style lang="scss">
.project-dev-manager {
  padding: 10px;
  small {
    font-size: 15px;
  }
  ul {
    list-style: none;
    font-size: 14px;
    li {
      cursor: pointer;
      &.active {
        color: blue;
      }
    }
  }
}
.s-card {
  visibility: hidden;
  &:checked {
  visibility: visible;
  margin-right: 5px;
}
}
</style>
