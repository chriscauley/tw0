'use strict';
const config = {
  V: false,
}
const argv = []

// Naive argv parsing
let i = 0
while (i<process.argv.length)  {
  const arg = process.argv[i]
  if (arg.startsWith('--')) {
    const sub = arg.slice(2)

    if (config.hasOwnProperty(sub)) {
      if (typeof config[sub] === 'boolean') {
        config[sub] = true
      } else {
        config[sub] = process.argv[i+1]
        i++
      }
      i++
      continue
    }
  }
  argv.push(arg)
  i++
}

// Store configuration on env
process.__UR = config

// Setting real ARGV
process.argv = argv

// Calling jest runner
require('jest-cli/bin/jest')