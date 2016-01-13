(function() {
  'use strict';
  const fs = require('fs');

  let demographics = {};
  const races = ['white','black', 'native', 'asian', 'hawaiian', 'hispanic'];

  let data = fs.readFileSync('../data/census-demographics.csv', 'utf8');
  data.split('\n').forEach(function(line) {
    let fields = line.split(',');
    let bestFit = 5;
    for(let i=6; i < fields.length; i++) {
      if (parseFloat(fields[bestFit]) < parseFloat(fields[i])) {
        bestFit = i;
      }
    }
    if (!isNaN(fields[bestFit])) {
      demographics[fields[0]] = [races[bestFit - 5], fields[bestFit]];
      // console.log(fields[0] + ' = ' + races[bestFit - 5] + ', ' + fields[bestFit]);
    }
  });
  module.exports = function(name) {
    return demographics[name];
  };
}());
