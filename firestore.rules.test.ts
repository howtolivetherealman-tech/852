import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rulesPath = path.join(process.cwd(), 'firestore.rules');
const rulesContent = fs.readFileSync(rulesPath, 'utf-8');

test('Firestore Rules: Enforces global default-deny safety net', () => {
  assert.ok(rulesContent.includes('match /{document=**} {\n      allow read, write: if false;\n    }'));
});

test('Firestore Rules: Secures all 15 collections defined in firebase-blueprint.json', () => {
  const requiredCollections = [
    'match /admins/{adminId}',
    'match /reporters/{reporterId}',
    'match /reporterPrivateDocuments/{docId}',
    'match /reporterIds/{cardId}',
    'match /states/{stateId}',
    'match /districts/{districtId}',
    'match /mandals/{mandalId}',
    'match /news/{newsId}',
    'match /newsCategories/{categoryId}',
    'match /advertisements/{adId}',
    'match /websiteSettings/{settingId}',
    'match /adSenseSettings/{configId}',
    'match /notifications/{notificationId}',
    'match /auditLogs/{logId}',
    'match /membershipRenewals/{renewalId}',
  ];
  for (const col of requiredCollections) {
    assert.ok(rulesContent.includes(col), `Missing rule block for ${col}`);
  }
});

test('Firestore Rules: Dirty Dozen - Prevents reporter from editing restricted profile fields', () => {
  assert.ok(
    rulesContent.includes("incoming().diff(existing()).affectedKeys().hasOnly(['residentialAddress', 'updatedAt'])"),
    'Reporter update rule must restrict affectedKeys to residentialAddress and updatedAt'
  );
});

test('Firestore Rules: Dirty Dozen - Isolates Aadhaar private documents from public access', () => {
  assert.ok(
    rulesContent.includes('match /reporterPrivateDocuments/{docId}') &&
      rulesContent.includes('allow get: if isSignedIn() && isValidId(docId) && (request.auth.uid == docId || isAdmin());'),
    'Aadhaar private documents must only be readable by owner or Admin'
  );
});

test('Firestore Rules: Dirty Dozen - Prevents email spoofing by requiring email_verified == true', () => {
  assert.ok(
    rulesContent.includes("request.auth.token.email == 'brkr1042@gmail.com' && request.auth.token.email_verified == true"),
    'Admin email check must enforce email_verified == true'
  );
});
