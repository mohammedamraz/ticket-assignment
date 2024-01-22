const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  severity: { type: String, required: true },
  type: { type: String, required: true },
  assignedTo: { type: Number },
  status: { type: String, default: 'assigned' },
  resolvedOn: { type: Date, default: null },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

const TicketCounter = mongoose.model('TicketCounter', {
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

async function getNextTicketId() {
  const counter = await TicketCounter.findByIdAndUpdate(
    { _id: 'ticketId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

module.exports = { Ticket, getNextTicketId };
