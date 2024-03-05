<script setup>
import { ref, onMounted } from "vue";
import { getRouteShim } from "../routeshim.js";


let command = ref({});
let getCommand = async () => {
  fetch(getRouteShim() + "/getCommands", {
    method: "GET",
  })
  .then((response) => response.json())
  .then((data) => {
    command.value = data
  }); 
}
onMounted(() => {
  getCommand();
})
</script>
<template>
    <h1> Welcome to @calumk/script-orchestra</h1>
    <p> This is a simple script server that allows you to run scripts on a server and see the output in real time. </p>

    <center>

            <svg version="1.1" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> 
                    <circle class="st1" cx="16" cy="6" r="2"></circle> 
                    <polyline class="st1" points="7,23.2 16,8 27,26 8.8,26 "></polyline> 
                    <line class="st1" x1="17" y1="21" x2="23" y2="29"></line>
                </g>
            </svg>

    </center>

    <Divider></Divider>
    <h3>Current File Loaded : </h3>
    <b>name</b> : {{ command.name }}<br/>
    <b>description</b> : {{ command.description }}<br/>
    <b>version</b> : {{ command.version }}<br/>
</template>

<style> 
.icon{
    width: 100px;
    height: 100px;
}
.st0{fill:none;stroke:#000000;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;} .st1{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> 
