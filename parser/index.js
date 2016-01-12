(function() {
'use strict';

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'output';
const MAX_TEST_LINES = 10;

let dataRe = /\"data\"\s?:\s?\[/;

const modules = {};
const buffs = {}; // buffers for each file
const startedData = {}; // whether or not we've reached the actual data in each file
const outputStreams = {}; // output streams for each file
const counts = {};

// search the buffer for the start of the data
function processBuffer(file) {
  if (startedData[file] === undefined || startedData[file] === false) {
    let match = dataRe.exec(buffs[file]);
    if (match !== null) {
      startedData[file] = true;
      buffs[file] = buffs[file].substring(match.index + match[0].length);
    }
  } else {
    let newline;
    while ((newline = buffs[file].indexOf('\n')) >= 0) {
      if (newline === 0) {
        buffs[file] = buffs[file].slice(1);
        continue;
      }
      try {
        processRecord(file, buffs[file].slice(0, newline));
      } catch(err) {
        //skip record
      }
      buffs[file] = buffs[file].slice(newline+1);
    }
  }
}

// pump a record through the correct parser. output to csv file.
function processRecord(file, line) {
  counts[file] = counts[file] + 1;
  if (line[0] === ',') {
    line = line.slice(1).trim();
  }
  const record = JSON.parse(line);

  // iterate over keys in module and run functions against record
  try {
    let values = [];
    for (let key of Object.keys(modules[file])) {
      let field = JSON.stringify(modules[file][key](record));
      if (typeof field === 'string') {
        field = field.trim();
      }
      values.push(field);
    }
    outputStreams[file].write(values.join(',') + '\n');
  } catch (lineerr) {
    console.error(`error while processing line from ${file}\n${line}\n${lineerr}`);
    // skip record
  }
}

// read all the source files and kick off parsers for them
fs.readdir(process.argv[2], function(err, files) {
  // make output directory
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
  }

  for (let f of files) {
    // try to load specific parsing module for f, if we fail then we don't need to parse the file
    try {
      const moduleName = path.join('modules', f.substring(0, f.length-5) + '.js');
      modules[f] = require('./' + moduleName)(f);
      console.log(`Loaded parsing module for ${f}`);

      // open output stream
      const outputName = path.join(OUTPUT_DIR, f.substring(0, f.length-5) + '.csv');
      outputStreams[f] = fs.createWriteStream(outputName);

      // start a line count
      counts[f] = 0;

      // write out column names to CSV
      let columnNames = Object.keys(modules[f]).map(c => `"${c}"`).join(',');
      outputStreams[f].write(columnNames + '\n');

      // create a new string buffer for this file
      buffs[f] = '';

      // use processBuffer to look for individual records to pump through module[f]
      let stream = fs.createReadStream(path.join(process.argv[2], f), {flags: 'r'});
      stream.on('data', d => {
        if (process.env['TEST'] && counts[f] > MAX_TEST_LINES) {
          stream.close();
        } else {
          buffs[f] += d.toString();
          processBuffer(f);
        }
      });
      stream.on('end', () => {
        console.log(`Finished reading file ${f}`);
        buffs[f] += '\n';
        processBuffer(f);
        outputStreams[f].end();
      });
    } catch(err) {
      // console.dir(err);
      console.error(`Cannot load parsing module for ${f}`);
    }
  }
});

})();
