<template>
  <div id="app">
    <v-app>
    <SchedulerManagement/>
    </v-app>
  </div>
</template>

<script>
import SchedulerManagement from './pages/Schedule_Management'
export default {
  name: 'App',
  components: {
    SchedulerManagement
  }
}
</script>

