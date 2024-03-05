<script setup>
import { ref, onMounted } from "vue";
import PanelMenu from 'primevue/panelmenu';
import { useRouter } from 'vue-router'
let $router = useRouter();
import { getRouteShim } from "./routeshim.js";

// import { routeshim } from "routeshim.js";

// let routeshim  = ""


let command_file = ref({});
let getCommands = async () => {
  fetch(getRouteShim()+"/getCommands", {
    method: "GET",
  })
  .then((response) => response.json())
  .then((data) => {
    command_file.value = data;
    convertToPanelMenu();
  });
};


// we need to convert the command_groups to a PrimeVue PanelMenu model
const items = ref([]);
let convertToPanelMenu = () => {
  let newItems = [];

  for (let group of command_file.value.command_groups) {
    let newGroup = {
      label: group.name,
      items: [],
    };
    if(group.commands){
      for (let command of group.commands) {
      newGroup.items.push({
        label: command.name,
        command: command.name,
        command_group: group.name,
        icon: "pi pi-fw pi-cog",
        command: () => {

          console.log(group.id, command.id);
          $router.push({ name: "Command", params: { group_id: group.id, command_id: command.id } });
          // runCommand(command.name);
        },
      });
    }
    }
    newItems.push(newGroup);
  }
  items.value = newItems;
}


  onMounted(() => {
    console.log("mounted");
    getCommands();
  });

</script>

<template>
<div class="mx-8">
  <h2 @click="$router.push('/')">@calumk/script-orchestra</h2>
  <div class="flex flex-row gap-3">
      <div class="flex-none flex flex-column" style="width: 20rem;">
        <PanelMenu :model="items" style="width: 20rem" />
        <Divider></Divider>
        <Button @click="$router.push('/files')" label="Files" severity="secondary"/>
      </div>
      <div class="flex-grow-1 flex flex-column" style="max-width: 800px;">
        <Panel>
          <Suspense>
            <router-view></router-view>
          </Suspense>
        </Panel>
      </div>
  </div>
</div>
Built
</template>
<style scoped>
  h2:hover{
    cursor: pointer;
  }
</style>
