(function() {
'use strict';

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'output';
const MAX_TEST_LINES = 10;
const DELIMITER = ',';
const MAX_CHUNK_SIZE_BYTES = process.env["MAX_CHUNK_SIZE_BYTES"] ? Number(process.env["MAX_CHUNK_SIZE_BYTES"]) : 1024*1024*100;

let dataRe = /\"data\"\s?:\s?\[/;

const bytesWritten = {}; //the number of bytes written to an output file for a specific input dataset
const chunkCounts = {}; // the current number of output files for a particular input dataset
const columnNames = {}; // CSV column names for each dataset
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
    writeToStream(values.join(DELIMITER) + '\n', file);
  } catch (lineerr) {
    console.error(`error while processing line from ${file}\n${line}\n${lineerr}`);
    // skip record
  }
}


// Create a new output stream for an input dataset file
function openStream(f)  {
  if (chunkCounts[f] === undefined) {
    chunkCounts[f] = 0;
  } else {
    chunkCounts[f] = chunkCounts[f] + 1;
  }

  // end the previous stream if there was one
  if (outputStreams[f] !== undefined) {
    outputStreams[f].end();
  }

  // open output stream
  const outputName = path.join(OUTPUT_DIR, f.substring(0, f.length-5) + '-' + chunkCounts[f] + '.csv');
  outputStreams[f] = fs.createWriteStream(outputName);

  // reset bytes written
  bytesWritten[f] = 0;

  // write out column names to CSV
  if (!columnNames[f]) {
    columnNames[f] = Object.keys(modules[f]).map(c => `"${c}"`).join(DELIMITER);
  }

  writeToStream(columnNames[f] + '\n', f);
}

// Write to the output stream for input file f. Handles chunking of output.
function writeToStream(str, f)  {
  if (bytesWritten[f] > MAX_CHUNK_SIZE_BYTES) {
    openStream(f);
  }
  outputStreams[f].write(str);
  bytesWritten[f] += Buffer.byteLength(str, 'utf8');
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

      // create an output stream
      openStream(f);

      // start a line count
      counts[f] = 0;

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
