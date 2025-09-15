/**
 * ruleEvaluator.evaluate(rules, customer)
 * rules: array of { field, operator, value }
 * customer: object with attributes + known fields (email, name)
 *
 * Supported operators: equals, contains, greaterThan, lessThan
 */

function getValueByField(customer, field) {
  // support nested attributes using dot notation
  if (!field) return undefined;
  const parts = field.split('.');
  let current = customer;
  for (const p of parts) {
    if (current == null) return undefined;
    current = current[p];
  }
  return current;
}

function applyOperator(op, left, right) {
  if (op === 'equals') {
    if (typeof left === 'string' && typeof right === 'string') return left.toLowerCase() === String(right).toLowerCase();
    return left === right;
  } else if (op === 'contains') {
    if (Array.isArray(left)) return left.includes(right);
    if (typeof left === 'string') return left.toLowerCase().includes(String(right).toLowerCase());
    return false;
  } else if (op === 'greaterThan') {
    return Number(left) > Number(right);
  } else if (op === 'lessThan') {
    return Number(left) < Number(right);
  }
  throw new Error(`Unsupported operator: ${op}`);
}

exports.evaluate = (rules, customer) => {
  if (!Array.isArray(rules) || rules.length === 0) return false;
  for (const r of rules) {
    const left = getValueByField(customer, r.field) ?? getValueByField(customer.attributes || {}, r.field);
    const operator = r.operator;
    const right = r.value;
    if (!applyOperator(operator, left, right)) {
      return false;
    }
  }
  return true;
};
