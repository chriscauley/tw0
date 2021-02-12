/*
  My goal is a function like f(a, b, c) => randInt
  I tried many different algorithms and they all had too much periodicity for [r(n), r(n+1)...]
  Finally settled on an array of nums=randInt(0,2^16) and then r(s) => nums[s]

  May eventually just replace with something like f(a, b, c) => a*p1+a*p2+a*p3... (pn= large prime)
  because the goal of this is random modding (see random.choice)
*/

const seededPRNG = seed => {
  seed = seed % 2147483647
  if (seed <= 0) seed += 2147483646
  const raw = () => (seed = (seed * 16807) % 2147483647)
  raw()
  return raw
}

const r = seededPRNG(123)
const nums = Array(Math.pow(2, 16)).fill().map(() => r())

const random = (seed) => {
  return nums[Math.abs(seed%nums.length)]
}

export default random

random.choice = (seed, array) => array[random(seed)%array.length]
