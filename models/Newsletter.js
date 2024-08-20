import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const NewsletterSchema = new Schema({
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default model('Newsletter', NewsletterSchema); 
