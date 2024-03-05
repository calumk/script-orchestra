<script setup>
import { ref, onMounted } from "vue";
import { getRouteShim } from "../routeshim.js";
// let routeshim  = ""


let files = ref({});
let getCommand = async () => {
  fetch(getRouteShim() + "/getFiles", {
    method: "GET",
  })
  .then((response) => response.json())
  .then((data) => {
    files.value = data
  }); 
}
onMounted(() => {
  getCommand();
})

// goToFile, simply redirects to the file, does not use the router
let goToFile = (file) => {
  window.location.href = routeshim + "/commands_working_directory/" + file;
}
</script>
<template>
    <h1> Files </h1>
    <Message severity="info" >
      Click on a file to view it, files are loaded from "/commands_working_directory"
    </Message>

    <div class="flex flex-column gap-2">
      <div v-for="file in files" class="flex">
        <Button class="w-full justify-content-center" severity="info" @click ="goToFile(file)"> {{ file }} </Button>
      </div>
    </div>
</template>

<style> 
.icon{
    width: 100px;
    height: 100px;
}
.st0{fill:none;stroke:#000000;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;} .st1{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> 
