import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    carrier: {
      type: String,
      required: [true, 'Carrier name is required'],
      enum: ['Jio', 'Airtel', 'Vi', 'BSNL'],
    },
    signal: {
      type: Number,
      required: [true, 'Signal strength (dBm) is required'],
    },
    speed: {
      type: Number,
      required: [true, 'Download speed (Mbps) is required'],
    },
    upload: {
      type: Number,
      required: [true, 'Upload speed (Mbps) is required'],
    },
    ping: {
      type: Number,
      required: [true, 'Ping (ms) is required'],
    },
    reliability: {
      type: Number,
      required: [true, 'Reliability (%) is required'],
      min: 0,
      max: 100,
    },
    time: {
      type: String,
      default: 'Just now',
    },
  },
  {
    timestamps: true,
  }
);

const Measurement = mongoose.model('Measurement', measurementSchema);
export default Measurement;
