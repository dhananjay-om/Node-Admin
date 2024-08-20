import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SettingSchema = new Schema({
    title: { type: String, required: false },
    image: { type: String, required: false },
    copyright: { type: String, required: false },
    address: { type: String}, 
    email: { type: String}, 
    phone: { type: String}, 
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    }
});

export default model('Setting', SettingSchema);
