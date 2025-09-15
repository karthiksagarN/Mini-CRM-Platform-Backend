const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
// Note: The ruleEvaluator utility is no longer needed for the main segmentation
// const ruleEvaluator = require('../utils/ruleEvaluator'); 

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * createSegment: saves a segment document
 */
exports.createSegment = async (name, rules, createdBy) => {
  // normalize rules
  const normalizedRules = rules.map(rule => {
    let field = rule.field;
    if (field && !field.includes('.')) {
      field = `attributes.${field}`;
    }
    return { ...rule, field };
  });

  const seg = new Segment({ name, rules: normalizedRules, createdBy });
  await seg.save();
  return seg;
};

exports.getSegmentById = async (id) => {
  return Segment.findById(id).lean();
};

/**
 * Converts segmentation rules into a MongoDB query object.
 * @param {Array} rules - The array of segmentation rules.
 * @returns {Object} - A MongoDB query object.
 */
const buildMongoQueryFromRules = (rules) => {
  if (!rules || rules.length === 0) {
    return {}; // Return empty query to match all documents if no rules
  }

  const queryParts = rules.map(rule => {
    const { field, operator, value } = rule;
    const mongoPart = {};
    const normalizedField = field.includes('.') ? field : `attributes.${field}`;

    switch (operator) {
      case 'greaterThan':
        mongoPart[normalizedField] = { '$gt': value };
        break;
      case 'lessThan':
        mongoPart[normalizedField] = { '$lt': value };
        break;
      case 'equals':
        mongoPart[normalizedField] = { '$eq': value };
        break;
      case 'contains':
        // Case-insensitive regex search
        mongoPart[normalizedField] = { '$regex': value, '$options': 'i' };
        break;
      default:
        // Optional: throw an error for unsupported operators
        console.warn(`Unsupported operator: ${operator}`);
        return null;
    }
    return mongoPart;
  }).filter(part => part !== null); // Filter out any unsupported rules

  // Combine all rules with an AND condition
  return { '$and': queryParts };
};


/**
 * evaluateRules: Efficiently finds customers matching segment rules using a database query.
 */
exports.evaluateRules = async (rules) => {
  // 1. Build a native MongoDB query from the rules
  const mongoQuery = buildMongoQueryFromRules(rules);

  // 2. Execute the query to let the database do the filtering
  const matchedCustomers = await Customer.find(mongoQuery).lean();
  
  // 3. Return the matched customers
  return { customers: matchedCustomers, count: matchedCustomers.length };
};


exports.getAllSegments = async () => {
  return Segment.find({}).lean();
};


// AI RULES BUILDING (No changes needed here)
exports.buildRulesFromAI = async (prompt) => {
  const systemPrompt = `
You are an assistant that converts natural language customer segmentation requests 
into structured JSON rules.

Rule format:
[
  { "field": "spend", "operator": "greaterThan", "value": 1000 },
  { "field": "age", "operator": "lessThan", "value": 30 }
]
Operators allowed: equals, contains, greaterThan, lessThan.
Only return valid JSON, No Explanation at all.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  });

  let rules = [];
  try {
    rules = JSON.parse(completion.choices[0].message.content.trim());
  } catch (e) {
    throw new Error("Failed to parse AI response");
  }

  return rules.map(r => ({
    ...r,
    field: r.field.includes('.') ? r.field : `attributes.${r.field}`
  }));
};