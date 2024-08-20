import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AccountSchema = new Schema({
    name: { type: String, required: false },
    image: { type: String, required: false },
    description: { type: String, required: false },
    postion: { type: String}, 
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    }
});

export default model('Account', AccountSchema);
