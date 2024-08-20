
import Setting from "../../models/Setting.js";
const aboutController =async (req,res)=>{
    const setting = await Setting.findOne();
    res.render('frontend/about',{setting: setting});
}

export {aboutController} 