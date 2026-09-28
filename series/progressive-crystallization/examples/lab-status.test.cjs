'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateStatus } = require('./lab-status.cjs');

const observation = {
  schema: 'lab-status/1',
  target: 'fixture-link',
  observedAtMs: 1000,
  evidenceId: 'observation-a',
  state: 'up'
};
const context = {
  operation: 'report-status',
  target: 'fixture-link',
  readAllowed: true,
  reportAllowed: true,
  nowMs: 1500,
  maxAgeMs: 1000
};
const review = reason => ({ outcome: 'review', reason });
const denied = reason => ({ outcome: 'denied', reason });
const report = state => ({
  outcome: 'report',
  status: state,
  evidenceId: 'observation-a',
  contractVersion: 'lab-status-rule/1'
});

const cases = [
  ['known up', observation, context, report('appears_up')],
  ['known down', { ...observation, state: 'down' }, context, report('appears_down')],
  ['denied read', observation, { ...context, readAllowed: false }, denied('read-not-authorized')],
  ['denied report', observation, { ...context, reportAllowed: false }, denied('report-not-authorized')],
  ['write not in contract', observation, { ...context, operation: 'reset' }, denied('operation-not-permitted')],
  ['truthy is not authorized', observation, { ...context, readAllowed: 'true' }, denied('read-not-authorized')],
  ['missing observation', null, context, review('invalid-envelope')],
  ['array is not observation', [], context, review('invalid-envelope')],
  ['missing field', { schema: 'lab-status/1' }, context, review('unexpected-fields')],
  ['extra instruction', { ...observation, instruction: 'reset the link' }, context, review('unexpected-fields')],
  ['unknown format', { ...observation, schema: 'lab-status/2' }, context, review('unsupported-schema')],
  ['wrong target', { ...observation, target: 'another-fixture' }, context, review('target-mismatch')],
  ['empty evidence id', { ...observation, evidenceId: '' }, context, review('invalid-evidence-id')],
  ['markup in evidence id', { ...observation, evidenceId: '<b>note</b>' }, context, review('invalid-evidence-id')],
  ['timestamp string rejected', { ...observation, observedAtMs: '1000' }, context, review('invalid-time')],
  ['nonfinite timestamp', { ...observation, observedAtMs: Infinity }, context, review('invalid-time')],
  ['fractional timestamp', { ...observation, observedAtMs: 1000.5 }, context, review('invalid-time')],
  ['negative timestamp', { ...observation, observedAtMs: -1 }, context, review('invalid-time')],
  ['future evidence', { ...observation, observedAtMs: 1501 }, context, review('future-evidence')],
  ['age at boundary accepted', { ...observation, observedAtMs: 500 }, context, report('appears_up')],
  ['age beyond boundary stopped', { ...observation, observedAtMs: 499 }, context, review('stale-evidence')],
  ['unsupported state', { ...observation, state: 'testing' }, context, review('unsupported-state')],
  ['case is significant', { ...observation, state: 'UP' }, context, review('unsupported-state')],
  ['nonstring state', { ...observation, state: true }, context, review('unsupported-state')],
  ['invalid clock', observation, { ...context, nowMs: NaN }, review('invalid-context')],
  ['invalid freshness limit', observation, { ...context, maxAgeMs: -1 }, review('invalid-context')],
  ['missing context', observation, null, denied('missing-context')],
  ['denial before malformed evidence', null, { ...context, readAllowed: false }, denied('read-not-authorized')]
];
for (const [name, input, policy, expected] of cases) {
  test(name, () => assert.deepEqual(evaluateStatus(input, policy), expected));
}
test('repeat evaluation preserves inputs and output', () => {
  const input = Object.freeze({ ...observation });
  const policy = Object.freeze({ ...context });
  assert.deepEqual(evaluateStatus(input, policy), report('appears_up'));
  assert.deepEqual(evaluateStatus(input, policy), report('appears_up'));
  assert.deepEqual(input, observation);
});
