<template>
  <div>
    <v-btn
      depressed
      small
      :color="projectMode?'primary':'secondary'"
      @click="show('new-project')"
    >New Project</v-btn>
    <v-btn
      depressed
      small
      :color="projectMode?'secondary':'primary'"
      @click="show('out-of-office')"
    >Out of Office</v-btn>
    <button
      type="button"
      class="close"
      @click="hideEventDialog"
      data-dismiss="modal"
      aria-label="Close"
      style="float: right; color:#c9c8d9"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "DialogHeader",
  components: {},
  props: {
    projectMode: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({}),
  created() {},
  watch: {},
  methods: {
    hideEventDialog() {
      this.$events.emit("close-dialog", [true]);
    },
    show(option) {
      const self = this;
      if (option === "new-project") {
        this.$events.emit("dialog-mode", true);
      } else {
        this.$events.emit("dialog-mode", false);
      }
    }
  }
};
</script>
<style lang="scss"></style>
