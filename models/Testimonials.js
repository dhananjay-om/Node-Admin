import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const TestimonialsSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: false },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default model('Testimonials', TestimonialsSchema); 
