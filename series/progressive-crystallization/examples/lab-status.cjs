'use strict';

// Pure fixture demonstration. The supplied permission flags are not authentication.
const fields = ['evidenceId', 'observedAtMs', 'schema', 'state', 'target'];
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const clockValue = value => Number.isSafeInteger(value) && value >= 0;
const review = reason => ({ outcome: 'review', reason });
const denied = reason => ({ outcome: 'denied', reason });

function evaluateStatus(observation, context) {
  if (!record(context)) return denied('missing-context');
  if (context.operation !== 'report-status') return denied('operation-not-permitted');
  if (context.readAllowed !== true) return denied('read-not-authorized');
  if (context.reportAllowed !== true) return denied('report-not-authorized');
  if (typeof context.target !== 'string' || !context.target.trim() ||
      !clockValue(context.nowMs) || !clockValue(context.maxAgeMs)) {
    return review('invalid-context');
  }
  if (!record(observation)) return review('invalid-envelope');
  const keys = Object.keys(observation).sort();
  if (keys.length !== fields.length || keys.some((key, i) => key !== fields[i])) {
    return review('unexpected-fields');
  }
  if (observation.schema !== 'lab-status/1') return review('unsupported-schema');
  if (observation.target !== context.target) return review('target-mismatch');
  if (typeof observation.evidenceId !== 'string' ||
      !/^[a-z][a-z0-9-]{0,63}$/.test(observation.evidenceId)) {
    return review('invalid-evidence-id');
  }
  if (!clockValue(observation.observedAtMs)) return review('invalid-time');
  if (observation.observedAtMs > context.nowMs) return review('future-evidence');
  if (context.nowMs - observation.observedAtMs > context.maxAgeMs) return review('stale-evidence');
  if (observation.state !== 'up' && observation.state !== 'down') return review('unsupported-state');
  return {
    outcome: 'report',
    status: observation.state === 'up' ? 'appears_up' : 'appears_down',
    evidenceId: observation.evidenceId,
    contractVersion: 'lab-status-rule/1'
  };
}

module.exports = { evaluateStatus };
