(function() {
'use strict';

const fs = require('fs');
const path = require('path');

let dataRe = /\"data\"\s?:\s?\[/;

let buffs = {}; //buffers for each file
let startedData = {}; //whether or not we've reached the actual data in each file
// search the buffer for the start of the data
function processBuffer(file) {
  if (startedData[file] === undefined || startedData[file] === false) {
    let match = dataRe.exec(buffs[file]);
    if (match !== null) {
      startedData[file] = true;
      buffs[file] = buffs[file].substring(match.index + match[0].length);
      processRecords(file);
    }
  } else {
    processRecords(file);
  }
}

// find records in the data and pump them through the parser
function processRecords(file) {
  let buffer = buffs[file];
  let newline = buffer.indexOf('\n');

  try {
    while(newline >= 0) {
      const line = buffer.substring(0, newline).trim();
      console.log(JSON.parse(line));
      buffer = buffer.slice(newline);
      newline = buffer.indexOf('\n');
    }
  } catch(err) {
    //continue buffering
  }
}

// read all the source files and kick off parsers for them
fs.readdir(process.argv[2], function(err, files) {
  for (let f of files) {
    buffs[f] = '';
    // TODO load specific parsing module for f
    // if it exists, then extract one object at a time and pass it through parse
    let stream = fs.createReadStream(path.join(process.argv[2], f), {flags: 'r'});

    stream.on('data', d => {
      buffs[f] += d.toString();
      processBuffer(f);
    });
  }
});

})();
