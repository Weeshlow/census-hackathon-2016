# Salt Basic Heatmap for Parsed Census Data

> What will this show? Nobody knows!

## Building the Example

To build the example you must first generate the .bin tile data (written to the `output/` directory) and then run the web app to view the results.

### Tile Generation

Tile generation is done using the code in the `generation/` directory. If you plan on using the included Docker container to run the example, ensure that it's built before continuing (see [root README](../README.md)).

Build the JAR and generate tiles in one command
```bash
$ docker run --rm -v /$(pwd)/../parser/output:/opt/data -v /$(pwd)/output:/opt/output -v /$(pwd)/generation:/opt/salt -w "/opt/salt" uncharted/sparklet:1.6.0
```

To run the container interactively, run:
```bash
$ docker run -it -v /$(pwd)/../parser/output:/opt/data -v /$(pwd)/output:/opt/output -v /$(pwd)/generation:/opt/salt -w "/opt/salt" uncharted/sparklet:1.6.0 bash
```

### Viewing Results

Results are viewed through a simple web app contained in `webapp/`. After generating tiles, run from `webapp/`:

```
npm install
npm start
```

The application will be available at http://localhost:3000/
