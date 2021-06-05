<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <h6>The client already exists</h6>
                    </div>

                    <div class="modal-footer">
                        <button v-on:click="confirmation" type="button" style="color:white;font-size:15px;font-family:italic">Add Rev</button>
                        <button v-on:click="$emit('close')" type="button" style="color:white;font-size:15px;" data-dismiss="modal">Reset</button>
                        <button v-on:click="$emit('close')" type="button" style="color:white;font-size:15px;" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name : 'ConfirmationBox',
    methods : {
        confirmation:function() {
            this.$parent.AddRevision();
            this.$emit('close');
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 5px 0px;
  background-color: orange;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  
    .modal-header {
        height : 30px !important;
        margin-top : 10px;
        display:flex;
        flex-direction :column;
        justify-content : center !important;
        align-items:center;
        color : white;
        margin-bottom: -1px;
    }
    .modal-footer {
        height : 30px;
        display:flex;
        flex-direction :column;
        justify-content : space-between !important;
        margin-bottom:20px;
    }
}


.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>