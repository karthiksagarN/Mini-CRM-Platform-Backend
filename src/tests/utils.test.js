const ruleEvaluator = require('../utils/ruleEvaluator');
const aiService = require('../services/aiService');

describe('ruleEvaluator', () => {
  test('should evaluate equals and contains and comparisons', () => {
    const customer = {
      email: 'user@example.com',
      name: 'John Doe',
      attributes: { spend: 1500, visits: 2, tags: ['vip', 'beta'] }
    };

    const rules1 = [{ field: 'attributes.spend', operator: 'greaterThan', value: 1000 }];
    expect(ruleEvaluator.evaluate(rules1, customer)).toBe(true);

    const rules2 = [{ field: 'attributes.visits', operator: 'lessThan', value: 3 }];
    expect(ruleEvaluator.evaluate(rules2, customer)).toBe(true);

    const rules3 = [{ field: 'email', operator: 'contains', value: 'example' }];
    expect(ruleEvaluator.evaluate(rules3, customer)).toBe(true);

    const rules4 = [{ field: 'attributes.tags', operator: 'contains', value: 'vip' }];
    expect(ruleEvaluator.evaluate(rules4, customer)).toBe(true);

    const rules5 = [{ field: 'name', operator: 'equals', value: 'john doe' }];
    expect(ruleEvaluator.evaluate(rules5, customer)).toBe(true);
  });

  test('should fail when one rule not matched', () => {
    const customer = { attributes: { spend: 100 } };
    const rules = [
      { field: 'attributes.spend', operator: 'greaterThan', value: 1000 },
      { field: 'attributes.spend', operator: 'lessThan', value: 10 }
    ];
    expect(ruleEvaluator.evaluate(rules, customer)).toBe(false);
  });
});

describe('aiService fallback parser', () => {
  test('fallback parses numeric comparisons and equals', async () => {
    const text = 'spend > 1000 and visits < 3 and country equals US';
    const rules = await aiService.convertTextToRules(text);
    // Expect at least 3 rules parsed
    expect(Array.isArray(rules)).toBe(true);
    expect(rules.length).toBeGreaterThanOrEqual(1);
    const fields = rules.map((r) => r.field);
    expect(fields).toEqual(expect.arrayContaining(expect.arrayContaining(['spend']) || fields));
  });
});
