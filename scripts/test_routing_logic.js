const assert = require('assert');
const { getGateCount, getStageState, deriveDecision } = require('../app.js');

assert.equal(getGateCount(86), 2, 'high score should activate both gates');
assert.equal(getGateCount(72), 1, 'middle score should activate one gate');
assert.equal(getGateCount(30), 0, 'low score should activate no gates');

assert.equal(getStageState(82), 'ready');
assert.equal(getStageState(58), 'partial');
assert.equal(getStageState(46), 'blocked');

assert.equal(deriveDecision([86, 76, 72, 82]).decision, 'BUILD');
assert.equal(deriveDecision([86, 76, 30, 82]).decision, 'SEQUENCE');
assert.equal(deriveDecision([86, 76, 72, 30]).decision, 'VALIDATE');
assert.equal(deriveDecision([30, 90, 90, 90]).decision, 'STOP');

console.log('Routing logic tests passed');
