import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ServiceSchema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default model('Service', ServiceSchema); 
