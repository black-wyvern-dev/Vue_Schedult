// Todo: set icon for danger and warning
export default {
  methods: {
    deleteScheduledRevision(revesionId) {
      const self = this;
      self.axios.delete(`ProjectReview/${revesionId}`)
        .then((res) => {
          self.$events.emit("close-dialog", [true]);
          self.$events.emit("fetch-events", ['fetch']);
        })
        .finally((res) => { });
    },
    changeProjectStatus(option, projectId) {
      const self = this;
      let data = {
        ProjectId: projectId,
        Status: option
      }
      self.axios
        .post(`ProjectReview/UpdateProjectSatatus`, data)
        .then(res => {
        })
        .finally(d => {
          self.$events.emit("close-dialog", [true]);
          self.$events.emit("fetch-events", ["fetch"]);
        });

    },
    splitRevision(revesionId) {
      const self = this;
      self.axios.get(`ProjectReview/SplitProjectRevision?projectRevisionId=${revesionId}`)
        .then((res) => {
          self.$events.emit("fetch-events", ['fetch']);
        })
        .finally((res) => { });
    },
    duplicateRevision(revesionId) {
      const self = this;
      self.axios.get(`ProjectReview/DuplicateProjectRevision?projectRevisionId=${revesionId}`)
        .then((res) => {
          self.$events.emit("fetch-events", ['fetch']);
        })
        .finally((res) => { });
    }
  }
};