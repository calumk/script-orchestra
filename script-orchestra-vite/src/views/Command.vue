<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
import { getRouteShim } from "../routeshim.js";



let command = ref({});
let getCommand = async () => {
  fetch(getRouteShim() + "/getCommands", {
    method: "GET",
  })
  .then((response) => response.json())
  .then((data) => {
    command.value = data.command_groups.find(group => group.id == route.params.group_id).commands.find(command => command.id == route.params.command_id);
    // array to string
    command.value.command_formatted = command.value.command.join(" ");

    console.log("hello")
    console.log(command.value.name)
    console.log(command.value.output)

    for (let output of command.value.output){
        let p = document.createElement("p");
        p.innerHTML = output;
        document.getElementById("time").appendChild(p);
        document.getElementById("time").scrollTop =
        document.getElementById("time").scrollHeight;
    }

  }); 
}

watch(() => route.params, () => {
  document.getElementById("time").innerHTML = "";
  getCommand();
  // delete all elements in the time div
  
})
onMounted(() => {
  document.getElementById("time").innerHTML = "";
  getCommand();
  // document.getElementById("time").innerHTML = "";
})


let runCommand = (group_id, command_id) => {
  // post to the server http request
  fetch(getRouteShim() + "/runCommand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: group_id, command_id: command_id}),
  });
};

let clearCommand = async (group_id, command_id) => {
  // post to the server http request
  await fetch(getRouteShim() + "/clearCommand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: group_id, command_id: command_id}),
  });
  document.getElementById("time").innerHTML = "";
  await getCommand();
};

let killCommand = (group_id, command_id) => {
  // post to the server http request
  fetch(getRouteShim() + "/killCommand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: group_id, command_id: command_id}),
  });
};



const webSocket = new WebSocket("ws://" + location.hostname + ":3002");
	webSocket.onmessage = (event) => {

		let data = JSON.parse(event.data, null, 2);

		if (data.type == "command_data") {
      console.log(data)
      if(data.group_id == route.params.group_id && data.command_id == route.params.command_id){
        let p = document.createElement("p");
        p.innerHTML = data.data;
        document.getElementById("time").appendChild(p);
        document.getElementById("time").scrollTop =
          document.getElementById("time").scrollHeight;
      }
		}

    if(data.type == "status_data"){
      if(data.group_id == route.params.group_id && data.command_id == route.params.command_id){
        command.value.status = data.status;
        console.log("Status:")
        console.log(command.value.status)
      }
    }

		// if (data.type == "running") {
		// 	if (data.data == true) {
		// 		document.getElementById("loadButton").disabled = true;
		// 	} else {
		// 		document.getElementById("loadButton").disabled = false;
		// 	}
		// }

	};

</script>
<template>
  <h2>{{ command.name }}</h2>
  <h3>{{ command.description }}</h3>


  <pre
    style="
            background-color: green;
            color: #fff;
            overflow-y: scroll;
            width:100%;
            border-radius: 5px;
            border: 1px solid #000;
            text-align: left !important;
            padding:10px;
    ">$ {{ command.command_formatted }}</pre>
  <br/>
  <div class="flex flex-row justify-content-center gap-2 text-align-center" style="	text-align: center !important">
    <Button rounded 
      class="w-full justify-content-center " 
      @click="runCommand(route.params.group_id, route.params.command_id)" 
      :disabled="(command.status=='running') ? true : false 
    ">
      Run Command : {{ command.status }}
    </Button>
    <Button rounded 
      class="w-full justify-content-center " 
      @click="killCommand(route.params.group_id, route.params.command_id)"  
      :disabled="(command.status=='running') ? false : true " 
      :severity="(command.status=='running') ? 'warning' : 'secondary' ">
      Kill Command
    </Button>
    <Button rounded 
      class="w-full justify-content-center " 
      @click="clearCommand(route.params.group_id, route.params.command_id)"
      severity="info">
      Clear Command
    </Button>
  </div>
  <br/>
  <pre
    id="time"
    style="
      background-color: #222;
      color: #fff;
      height: 500px;
      overflow-y: scroll;
      width:100%;
      border-radius: 5px;
      border: 1px solid #000;
      text-align: left !important;
    "
  ></pre>
</template>