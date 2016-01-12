# census-raw-parser

Parses the raw census data into CSV files.

```bash
$ npm install
$ npm start [path/to/raw-data/dir]
```

## Developing

Try to follow the format in [parser/modules/template.js](parser/modules/template.js) when implementing parsing modules.

You can run the script in test mode (against 10 lines of each source file) via:

```bash
$ npm test [path/to/raw-data/dir]
```
