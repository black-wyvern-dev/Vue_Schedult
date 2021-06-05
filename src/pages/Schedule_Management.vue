<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 logo">
        <img src="@/assets/logo.png" />
      </div>
      <div class="right-header-content">
        <div class="row">
          <div class="col-md-6">
            <h4>Schedule Management</h4>
            <small>
              Home
              <v-icon>arrow_right</v-icon>Schedule Management
            </small>
          </div>
          <div class="col-md-6">
            <v-autocomplete
                clearable
                :loading="loading"
                :items="items"
                :search-input.sync="search"
                item-text="name"
                item.value="name"
                v-model="select"
                flat
                color="black"
                hide-no-data
                hide-selected
                label="Search by Client Name or Project number..."
                prepend-icon="search"
                return-object
            ></v-autocomplete>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <scheduler-component />
    </div>
  </div>
</template>

<script>
import SchedulerComponent from "../components/scheduler/SchedulerComponent";
export default {
  name: "SchedulerManagement",
  components: {
    SchedulerComponent
  },
  data: () => ({
    loading: false,
    items: [],
    search: null,
    select: null,
    timeout: null,
    searchResult: null
  }),
  watch: {
    search(val) {
      console.log('--val', val)
      val && !this.select && this.querySelections(val);
      if(this.select === undefined){
        this.$events.emit("fetch-events", ["today"]);
      }
    },
    select(val) {
      let selectedData = val || {};
      console.log(selectedData)
      let {clientId=0, clientName="", projectNumberId=0} = selectedData;
      if(clientId){
        clientName = selectedData.name;
      }
      let searchQuery = {clientName, projectNumberId};
      if(clientName || projectNumberId){
        this.$events.emit("search-events", searchQuery);
      }

    }
  },
  methods: {
  querySelections(v) {
    // clear timeout variable
    clearTimeout(this.timeout);
    const self = this;
    self.loading = true;
    this.timeout = setTimeout(function () {
        self.axios.get(`ProjectReview/GetFilterSuggestion?search=${v}`)
        .then((res)=>{
        self.items = res.data.data;
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally((res)=>{
        self.loading = false;
        })
    }, 1000);
  }
  }
};
</script>

<style lang="scss">
.logo {
  background: #fff;
  padding: 0px !important;
  text-align: center;
  min-width: 280px;
  img {
    height: 110px;
  }
}
.right-header-content {
  flex: auto;
  padding-right: 50px;
  .row {
    align-items: flex-end;
    height: 100%;
    .col-md-6 {
      padding: 20px 0px 10px 30px !important;
      &:last-child {
        padding: 20px 0px 20px 30px !important;
      }
    }
  }
}
@media (min-width: 768px) {
  .col-md-2 {
    flex: 0 0 16.666667%;
    max-width: 12.5% !important;
    box-shadow: inset 0px 6px 16px 2px #929eaaba;
    font-weight: 700;
    font-family: revert;
    border: 1px solid #929eaaba;
  }
}
.col-md-2:hover {
  cursor: pointer;
  box-shadow: none;
  border: none;
}
</style>