# @calumk/script-orchestra

A minimal application for running scripts remotely, and seeing the output.

> [!WARNING]
> Very much a beta - No auth yet, no versioning, no tests, no error handling, no logging, no security, no nothing.


> [!NOTE]
> Pull Requests welcome! :)

![splash image](splash.png)


## To Run

Clone the repo.
```
$ git clone https://github.com/calumk/script-orchestra.git
```

Install the repo.
```
$ bun i
```

Edit the config file
```
code commands_data/commands.json
```


Run the repo.
```
$ bun index.js
```

## To Debug

You can rebuild the vite project, or run it in dev mode if you like, but you will need to change some port settings.



## Experimental Build

An Experimental build for OSX allows running the app as a standalone application. This is very much a work in progress, and is not recommended for use yet.

To rebuild the app, run the following command:
```
bun build index.js --compile --outfile standalone_osx_experimental
```

> [!Note] 
> The HTML file is bundled into the app, so you will need to rebuild the app if you change the HTML file.
> The vite app is bundled into a single HTML file which is then embedded into the app!