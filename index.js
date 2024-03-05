// Imports the @tinyhttp module
// miliparsec is a JSON parser
// cors is a CORS middleware
// sirv is a static file server
import { App } from '@tinyhttp/app'
import { json } from 'milliparsec'
import { cors } from '@tinyhttp/cors'
import sirv from 'sirv'

// The bunWsWrapper module is a wrapper around the built-in ws module, designed to simplify the process of creating a WebSocket server
import { bunWsWrapper } from './bunWsWrapper.js'
// we need to use the node child_process module to run the commands
var spawn = require('child_process').spawn;

// open the commands.json and read the contents
const path = "commands_data/commands.json";
const file = Bun.file(path);
let commands_file = await file.json();

// for each script, add a running status, we need to use a map
// The commands are in the commands_file.command_groups[].commands[].command
commands_file.command_groups = commands_file.command_groups.map(cg => {
    cg.commands = cg.commands.map(c => {
        c.status = "ready"
        c.output = []
        return c
    })
    return cg
})


// Create a new instance of the App (from @tinyhttp/app)
const app = new App({
    // catch 404 errors and redirect to the root
    noMatchHandler: (req, res) =>
    res.redirect('/')
})
// Use the cors middleware to allow all origins
app.use(cors({ origin: '*' }))
app.options('*', cors())
// Use the json middleware to parse JSON requests
app.use(json())

// Use the sirv middleware to serve the static files from the dist directory (the output of the Vite build)
app.use('/', sirv('script-orchestra-vite/dist'))

// Use the sirv middleware to serve the static files from the commands_data directory
app.use('/commands_working_directory', sirv('commands_working_directory'))


// we need to list all the files in the commands_working_directory
// Create a new route to list all the files in the commands_working_directory
app.get('/getFiles', (req, res) => {
    let fs = require('fs');
    let files = fs.readdirSync('commands_working_directory');
    res.send(files)
});


// Create a new route to serve the commands.json file to the client
// This is actually the modified commands_file object, with the running status added, and the output array
app.get('/getCommands', (req, res) => {
    res.send(commands_file)
});

// Create a new route to run a command§
// This route takes a group_id and a command_id as parameters
app.post('/runCommand', (req, res) => {
    let group_id = req.body.group_id
    let command_id = req.body.command_id
    actuallyRunTheCommand(group_id, command_id)
    res.send("Running command")
});


app.post('/clearCommand', (req, res) => {
    let group_id = req.body.group_id
    let command_id = req.body.command_id
    let command_to_run = commands_file.command_groups.find(cg => cg.id == group_id).commands.find(c => c.id == command_id)
    command_to_run.output = []
    command_to_run.status = "ready"
    res.send("Cleared command")
});




app.post('/killCommand', (req, res) => {
    let group_id = req.body.group_id
    let command_id = req.body.command_id
    actuallyKillTheCommand(group_id, command_id)
    res.send("Killed command")
});

app.listen(3001, () => console.log('Started on http://localhost:3001'))




let ws = new bunWsWrapper(3002, {
    open: (ws) => {
        console.log("Client has connected", ws.data.id);
        // ws.send(JSON.stringify({ type: "running", data: running }))
        // we.send(JSON.stringif({ type: "contents", data: contents }))
    },
    close: (ws) => {
        console.log("Client has disconnected:", ws.data.id);
    }
});

setInterval(() => {
    ws.publish(JSON.stringify({ type: "commands_file", data: commands_file }))
}, 1000);





let actuallyKillTheCommand = (group_id,command_id) => {
    let command_to_run = commands_file.command_groups.find(cg => cg.id == group_id).commands.find(c => c.id == command_id)
    command_to_run.child_process.kill()
    command_to_run.status = "killed"
    ws.publish(JSON.stringify({ type: "status_data", group_id : group_id, command_id : command_id, status: "killed" }))
}

let actuallyRunTheCommand = async (group_id,command_id) =>{ 

    // find the command to run given the group_id and command_id - these are properties of the objects
    let command_to_run = commands_file.command_groups.find(cg => cg.id == group_id).commands.find(c => c.id == command_id)
    // set the running status to true on the main commands_file object, so that the UI can update
    command_to_run.status = "running"

    let command = command_to_run.command

    // command is an array of strings
    // get the first string and the rest of the strings as arguments
    // Shall we consider using https://stackoverflow.com/questions/57429987/nodejs-spawn-command-with-string-not-array ? 

    let command1 = command[0]
    let allOtherCommands = command.slice(1)


    let command_to_string = "$ " + command1 + " " + allOtherCommands.join(" ")



    // Run the command
    // This is the important bit!
    command_to_run.child_process = spawn(command1, allOtherCommands, {cwd:"commands_working_directory"});

    ws.publish(JSON.stringify({ type: "command_data", group_id : group_id, command_id : command_id, data: command_to_string }))
    ws.publish(JSON.stringify({ type: "status_data", group_id : group_id, command_id : command_id, status: "running" }))


    // You can also use a variable to save the output 
    // for when the script closes later
    command_to_run.output = []
    var scriptOutput = [];

    command_to_run.child_process.stdout.setEncoding('utf8');
    command_to_run.child_process.stdout.on('data', function(data) {
        //Here is where the output goes
        // console.log('stdout: ' + data);
        ws.publish(JSON.stringify({ type: "command_data", group_id : group_id, command_id : command_id, data: data }))
        ws.publish(JSON.stringify({ type: "status_data", group_id : group_id, command_id : command_id, status: "running" }))
        data=data.toString();
        scriptOutput.push(data)
        command_to_run.output.push(data)
    });

    command_to_run.child_process.stderr.setEncoding('utf8');
    command_to_run.child_process.stderr.on('data', function(data) {
        //Here is where the error output goes
        // console.log('stderr: ' + data);
        ws.publish(JSON.stringify({ type: "command_data", group_id : group_id, command_id : command_id, data: data }))
        ws.publish(JSON.stringify({ type: "status_data", group_id : group_id, command_id : command_id, status: "running" }))
        data=data.toString();
        scriptOutput.push(data)
        command_to_run.output.push(data)
    });

    command_to_run.child_process.on('close', function(code) {
        //Here you can get the exit code of the script
        command_to_run.status = "finished"
        ws.publish(JSON.stringify({ type: "status_data", group_id : group_id, command_id : command_id, status: "finished" }))
        // overwrite the output with the full output
        command_to_run.output = scriptOutput
        console.log('closing code: ' + code);
        // console.log('Full output of script: ',scriptOutput);
    });

    command_to_run.child_process.on('error', function(err) {
        //Here you can get the exit code of the script
        ws.publish(JSON.stringify({ type: "command_data", group_id : group_id, command_id : command_id, data: "ERROR : " + err }))
        ws.publish(JSON.stringify({ type: "status_data", group_id : group_id, command_id : command_id, status: "error" }))
        command_to_run.status = "error"
        console.log('error: ' + err);
    });
}