const mongoose = require('mongoose');
const validator = require('validator');

const agentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: true },
  dateCreated: { type: Date, default: Date.now },
});

const Agent = mongoose.model('Agent', agentSchema);

const AgentCounter = mongoose.model('AgentCounter', {
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

async function getNextAgentId() {
  const counter = await AgentCounter.findByIdAndUpdate(
    { _id: 'agentId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

module.exports = { Agent, getNextAgentId };
