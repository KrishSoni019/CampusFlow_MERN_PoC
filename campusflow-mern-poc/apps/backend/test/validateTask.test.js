import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTaskInput } from '../src/utils/validateTask.js';

test('accepts a valid task payload', () => {
  const result = validateTaskInput({ title: 'Submit assignment', priority: 'High', status: 'Pending' });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('rejects a missing or too-short title', () => {
  const result = validateTaskInput({ title: ' ' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.title);
});

test('rejects unsupported priority and status values', () => {
  const result = validateTaskInput({ title: 'A valid title', priority: 'Urgent', status: 'Started' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.priority);
  assert.ok(result.errors.status);
});

test('allows a partial update without a title', () => {
  const result = validateTaskInput({ status: 'Completed' }, { partial: true });
  assert.equal(result.valid, true);
});
