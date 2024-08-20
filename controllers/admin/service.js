import Service from '../../models/Service.js';
import multer from 'multer';
import path from 'path';



// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});
const upload = multer({ storage: storage }).single('image');

// Servie Controllers //
export const serviceController = async (req, res) => {

    try {
        const service = await Service.find()
        res.render('admin/allservice', {service});

    }catch (error) {
        console.error('Error fetching Service:', error);
        res.status(500).send('Server Error'); 
    }
 };


 // Service Form Render
 export const createserviceController = async (req, res) => {
   
    const { id } = req.params;
    if (id) {
        // Edit mode
        try {
            const service = await Service.findById(id);
            if (!service) {
                return res.status(404).send('Service not found');
            }
            res.render('admin/service', { service, isEditing: true, servicedetails:false });
        } catch (error) {
            console.error('Server Error:', error);
            res.status(500).send('Server Error'); 
        }
    } else {
        // Add mode
        res.render('admin/service', { service: {}, savemode : true, isEditing: false, servicedetails:false });
    }


    //res.render('admin/service');
 };

 //Save Service Controller 
 export const addserviceController = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            // return res.status(500).send(err.message);
            return res.redirect(302, '/allservice?error_msg=' + encodeURIComponent(err.message));
        }

        const { id,title, description} = req.body; // Ensure author is also included
        const image = req.file ? req.file.filename : null; // Access the uploaded image filename
        try {

            if (id) {
                // Edit existing service
                const service = await Service.findById(id);
                if (!service) {
                    res.redirect(302, '/allservice?error_msg=' + encodeURIComponent('Service Not Found'));
                    return res.redirect('/service');
                }

                service.title = title;
                service.description = description;
                service.image = image || service.image; // Keep the old image if no new one is uploaded
                await service.save();
                res.redirect(302, '/allservice?success_msg=' + encodeURIComponent('Service updated successfully!'));
            } else {
                const newService = new Service({
                    title,
                    image, // Save the image filename
                    description
                });

                await newService.save();
                //res.redirect(302, '/service?success_msg=Blog Added successfully!');
                res.redirect(302, '/allservice?success_msg=' + encodeURIComponent('Service added successfully!'));
            }
        } catch (error) {
            // res.redirect(302, '/service?error_msg=Failed to add blog');
            res.redirect(302, '/allservice?error_msg=' + encodeURIComponent('Failed to add service'));
            console.error('Server Error:', error); // Log the actual error
            res.status(500).send('Server Error');
        }
    });
}

//Delete a service

export const deleteService = async (req, res) => {

    try{
        await Service.findById(req.params.id);
      
            const service = await Service.findById(req.params.id);
            if (!service) {
                res.redirect(302, '/allservice?error_msg=' + encodeURIComponent('Service Not Found'));
                return res.redirect('/allservice');
            }
            await Service.findByIdAndDelete(req.params.id);
            res.redirect(302, '/allservice?success_msg=' + encodeURIComponent('Service deleted successfully!'));
    }catch(error){
        res.redirect(302, '/allservice?error_msg=' + encodeURIComponent('Failed to add service'));
        console.error('Server Error:', error); // Log the actual error
        res.status(500).send('Server Error');
    }
};


//View Service//

export const ServiceDetails = async(req, res) =>{

    try{
        await Service.findById(req.params.id);
      
            const service = await Service.findById(req.params.id);
            if (!service) {
                res.redirect(302, '/allservice?error_msg=' + encodeURIComponent('Service Not Found'));
                return res.redirect('/allservice');
            }
            res.render('admin/service', { service, servicedetails:true, savemode : false,isEditing:false });
            
    }catch(error){
        res.redirect(302, '/allservice?error_msg=' + encodeURIComponent('Something Went wrong'));
        console.error('Server Error:', error); // Log the actual error
        res.status(500).send('Server Error');
    }
};

