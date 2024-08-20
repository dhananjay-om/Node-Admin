
import Setting from "../../models/Setting.js";
import Service from '../../models/Service.js';
import Project from '../../models/Project.js';
import Testimonials from '../../models/Testimonials.js';
const serviceController =async (req,res)=>{
    const setting = await Setting.findOne();
    const service = await Service.find();
   
    const limit = 4;
    const testimonials = await Testimonials.find()
                        .sort({ date: -1 })
                        .limit(limit); 

    const project = await Project.find();
    res.render('frontend/service', { setting: setting, service: service, project: project, testimonials: testimonials});
}

export {serviceController} 