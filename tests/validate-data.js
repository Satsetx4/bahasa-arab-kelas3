const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({
  console,
  document: { addEventListener() {} },
  window: {},
  setInterval,
  clearInterval
});
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), context);
vm.runInContext(`${fs.readFileSync(path.join(root, 'js/app.js'), 'utf8')}
globalThis.__validation = {
  data: ARABIC_DATA,
  config: EXAM_CONFIG,
  meta: QUESTION_TYPE_META,
  createExamQuestionSet,
  fisherYatesShuffle,
  normalizeSavedExamState
};`, context);

const { data, config, meta, createExamQuestionSet, fisherYatesShuffle, normalizeSavedExamState } = context.__validation;
const unique = values => new Set(values).size === values.length;
const questionTypes = [...new Set(data.question_bank.map(question => question.type))];

assert.equal(data.vocabularies.length, 22, 'Expected all 22 vocabulary entries.');
assert.equal(data.question_bank.length, 37, 'Expected all 37 bank questions.');
assert.ok(unique(data.vocabularies.map(item => item.id)), 'Vocabulary IDs must be unique.');
assert.ok(unique(data.question_bank.map(item => item.id)), 'Question IDs must be unique.');
assert.ok(unique(data.vocabularies.map(item => item.arabic.trim().normalize('NFC'))), 'Arabic vocabulary entries must not be duplicated.');
assert.ok(data.vocabularies.every(item => item.arabic.trim() && item.latin.trim() && item.meaning.trim()), 'Vocabulary fields must be present.');
assert.ok(questionTypes.every(type => Object.hasOwn(meta, type)), 'Every question type needs filter and badge metadata.');
assert.ok(questionTypes.every(type => Object.hasOwn(config.composition, type)), 'Every question type must appear in the exam blueprint.');
assert.ok(data.question_bank.every(question => Array.isArray(question.options) && question.options.length >= 2 && question.options.every(option => typeof option === 'string' && option.trim())), 'Every question needs non-empty text options.');
assert.ok(data.question_bank.every(question => new Set(question.options.map(option => option.trim().normalize('NFC').toLowerCase())).size === question.options.length), 'Question options must not be duplicated.');
assert.ok(data.vocabularies.every(item => [item.arabic, item.latin, item.meaning].every(value => value === value.trim())), 'Vocabulary text must not have surrounding whitespace.');
assert.ok(data.question_bank.every(question => [question.question, ...question.options].every(value => value === value.trim())), 'Question text and options must not have surrounding whitespace.');
assert.ok(data.question_bank.every(question => Number.isInteger(question.correct_answer) && question.correct_answer >= 0 && question.correct_answer < question.options.length), 'Every answer key must point to a valid option.');

const typeCounts = data.question_bank.reduce((counts, question) => {
  counts[question.type] = (counts[question.type] || 0) + 1;
  return counts;
}, {});
assert.equal(Object.values(config.composition).reduce((sum, count) => sum + count, 0), config.questionCount, 'Exam blueprint total must match its configured question count.');
assert.ok(Object.entries(config.composition).every(([type, count]) => (typeCounts[type] || 0) >= count), 'Exam blueprint cannot request more questions than the bank contains.');

let seed = 31;
const seededRandom = () => {
  seed = (seed * 48271) % 2147483647;
  return seed / 2147483647;
};
const exam = createExamQuestionSet(seededRandom);
assert.equal(exam.length, config.questionCount, 'Exam blueprint must produce the configured number of questions.');
assert.ok(unique(exam.map(question => question.id)), 'An exam must not contain duplicate questions.');
const selectedTypeCounts = exam.reduce((counts, question) => {
  counts[question.type] = (counts[question.type] || 0) + 1;
  return counts;
}, {});
assert.deepEqual(JSON.parse(JSON.stringify(selectedTypeCounts)), JSON.parse(JSON.stringify(config.composition)), 'Exam type distribution must match the blueprint.');

const original = [1, 2, 3, 4];
let shuffleSeed = 7;
const deterministicShuffle = () => {
  shuffleSeed = (shuffleSeed * 48271) % 2147483647;
  return shuffleSeed / 2147483647;
};
assert.deepEqual(JSON.parse(JSON.stringify(fisherYatesShuffle(original, deterministicShuffle))), [3, 4, 2, 1]);
assert.deepEqual(original, [1, 2, 3, 4], 'Shuffle must not mutate the question bank.');

const firstQuestion = exam[0];
const migrationNow = Date.now();
const migrated = normalizeSavedExamState({
  questionIds: exam.map(question => question.id),
  examAnswers: { [firstQuestion.id]: String(firstQuestion.correct_answer) },
  secondsRemaining: 90
});
assert.ok(migrated, 'Legacy remaining-seconds exam state should be recoverable.');
assert.equal(migrated.answers[firstQuestion.id], firstQuestion.correct_answer, 'Legacy answer values should be normalized.');
assert.ok(migrated.endsAt >= migrationNow + 88000 && migrated.endsAt <= migrationNow + 92000, 'Legacy remaining seconds should become an absolute end timestamp.');

const nullAnswerState = normalizeSavedExamState({
  questionIds: exam.map(question => question.id),
  startedAt: migrationNow,
  endsAt: migrationNow + config.durationMinutes * 60 * 1000,
  answers: { [firstQuestion.id]: null }
});
assert.ok(nullAnswerState, 'A valid active exam with an unanswered question should restore.');
assert.equal(Object.hasOwn(nullAnswerState.answers, firstQuestion.id), false, 'Null answers must not become option zero.');

const nullLegacyTimerState = normalizeSavedExamState({
  questionIds: exam.map(question => question.id),
  startedAt: migrationNow,
  secondsRemaining: null
});
assert.ok(nullLegacyTimerState, 'A null legacy timer should fall back to the valid start timestamp.');
assert.equal(nullLegacyTimerState.endsAt, migrationNow + config.durationMinutes * 60 * 1000, 'Null legacy time must not expire the exam immediately.');

console.log(`Validated ${data.vocabularies.length} vocabularies, ${data.question_bank.length} questions, and ${config.questionCount} blueprint questions.`);
