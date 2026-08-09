import mongoose from 'mongoose';

const carrierSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    score: {
      type: Number,
      required: true,
    },
    signalStrength: {
      type: Number,
      required: true,
    },
    downloadSpeed: {
      type: Number,
      required: true,
    },
    uploadSpeed: {
      type: Number,
      required: true,
    },
    ping: {
      type: Number,
      required: true,
    },
    reliability: {
      type: Number,
      required: true,
    },
    trustScore: {
      type: Number,
      required: true,
    },
    coverage: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Carrier = mongoose.model('Carrier', carrierSchema);
export default Carrier;
