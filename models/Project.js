import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    shortdescription: { type: String, required: true },
    rating: { type: String, required: true },
    client: { type: String, required: true },
    website: { type: String, required: true },
    completed: { type: String, required: true },
    tag: { type: String, required: true },
    category: { type: String, required: false },
    image: { type: String, required: false },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default model('Project', ProjectSchema); 
