import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BlogSchema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: true },
    shortdescription: { type: String, required: true },
    author: { type: String}, 
    tag: { type: String}, 
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    views: { type: Number, default: 0 }
});

export default model('Blog', BlogSchema);
