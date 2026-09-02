require('reflect-metadata');
const test = require('node:test');
const assert = require('node:assert/strict');
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');
const {
  UpdateProfileDto,
  UpdatePurposeDto,
  UpdatePrioritiesDto,
} = require('../dist/profiles/dto/update-profile.dto');

test('profile DTO converts browser number fields and accepts valid bounds', async () => {
  const profile = plainToInstance(UpdateProfileDto, { age: '31', displayName: 'Amina' });
  assert.equal(profile.age, 31);
  assert.deepEqual(await validate(profile), []);

  const priorities = plainToInstance(UpdatePrioritiesDto, {
    priorityDeen: '75',
    priorityFamily: '90',
  });
  assert.equal(priorities.priorityDeen, 75);
  assert.deepEqual(await validate(priorities), []);
});

test('purpose DTO rejects short statements and non-string tags', async () => {
  const purpose = plainToInstance(UpdatePurposeDto, {
    purposeStatement: 'Too short',
    lifeTags: ['family', 7],
  });
  const errors = await validate(purpose);
  assert.equal(errors.length, 2);
});
