<template>
    <!-- Modal -->
    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true" style="padding-top:300px!important;">
        <div class="modal-dialog" role="document" style="display:flex;flex-direction:row;align-items:center; justify-content:center">
            <div class="modal-content" style="background-color:orange;">
                <div class="modal-header">
                    <h6>The client already exists</h6>
                </div>
                <div class="modal-footer" style = "justify-content : space-between !important;"> 
                    <button type="button" style="color:white;font-size:15px;font-family:italic">Add Rev</button>
                    <button type="button" style="color:white;font-size:15px;" data-dismiss="modal">Reset</button>
                    <button type="button" style="color:white;font-size:15px;" data-dismiss="modal">Cancel</button>
                    <!-- <button type="button" style="color:white;" data-dismiss="modal">Close</button>
                    <button type="button">Save changes</button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'ConfirmModal'
}
</script>
<style lang="scss" scoped>
.modal-content {
    width : 300px;
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
</style>