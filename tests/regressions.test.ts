import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDateToTimestamp, sortDocumentsNewestFirst } from '../src/lib/dateUtils';
import { requireAdminAuth } from '../server/requireAdminAuth';

test('ID timestamps in seconds and milliseconds represent the same instant', () => {
  assert.equal(parseDateToTimestamp(undefined, 'art-1740998372'), 1740998372000);
  assert.equal(parseDateToTimestamp(undefined, 'art-1740998372000'), 1740998372000);
});

test('Vietnamese dates validate calendar days, including leap years', () => {
  assert.equal(parseDateToTimestamp('31/02/2026'), 0);
  assert.equal(parseDateToTimestamp('29/02/2025'), 0);
  assert.equal(parseDateToTimestamp('29/02/2024'), new Date(2024, 1, 29).getTime());
  assert.equal(parseDateToTimestamp('bad', 'doc-1740998372'), 1740998372000);
});

test('document ordering compares fallback seconds with ISO dates without mutating input', () => {
  const documents = [{ id: 'doc-1740998372' }, { id: 'old', issueDate: '2020-01-01' }] as any;
  const original = [...documents];
  assert.equal(sortDocumentsNewestFirst(documents)[0].id, 'doc-1740998372');
  assert.deepEqual(documents, original);
});

for (const headers of [{}, { 'x-staff-role': 'ADMIN', 'x-admin-token': 'admin-session-active' }, { authorization: 'Bearer' }, { authorization: 'Bearer forged-token' }]) {
  test(`admin APIs reject unverified authentication: ${JSON.stringify(headers)}`, async () => {
    let status = 0;
    let calledNext = false;
    const response = { status(code: number) { status = code; return this; }, json(body: any) { assert.equal(body.success, false); } };
    await requireAdminAuth({ headers } as any, response as any, () => { calledNext = true; });
    assert.equal(status, 401);
    assert.equal(calledNext, false);
  });
}
