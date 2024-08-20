import Testimonials from '../../models/Testimonials.js';


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

// Testimonials Controllers //
export const testimonialsController = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit; // Number of documents to skip
    try {
        const totalTestimonials = await Testimonials.countDocuments();
        const testimonials = await Testimonials.find()
        .sort({ date: -1 })
        .sort({ date: -1 }) // Sort by date descending
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit to 5 documents
        const totalPages = Math.ceil(totalTestimonials / limit); // Calculate total pages
        res.render('admin/testimonial', { testimonials, currentPage: page,
            totalPages, successMsg: null, errorMsg: null });
    } catch (error) {
        console.error('Error fetching Testimonials:', error);
        res.status(500).send('Server Error'); 
    }
};

//Save Project Controller 
export const addtestimonialController = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            // return res.status(500).send(err.message);
            return res.redirect(302, '/testimonial?errorMsg=' + encodeURIComponent(err.message));
        }

        const { id,name,message} = req.body; // Ensure author is also included
        const image = req.file ? req.file.filename : null; // Access the uploaded image filename
        try {

            if (id) {
                // Edit existing project
                const testimonials = await Testimonials.findById(id);
                if (!testimonials) {
                    res.redirect(302, '/testimonial?errorMsg=' + encodeURIComponent('Testimonial Not Found'));
                    return res.redirect('/testimonial');
                }

                testimonials.name = name;
                testimonials.message = message;

                await testimonials.save();
                res.redirect(302, '/testimonial?successMsg=' + encodeURIComponent('Testimonial updated successfully!'));
            } else {
                const newTestimonials = new Testimonials({
                    name,
                    message,
                    image
                });

                await newTestimonials.save();
                const page = parseInt(req.query.page) || 1; // Current page number, default to 1
                const limit = 5; // Number of posts per page
                const skip = (page - 1) * limit; // Number of documents to skip
                const totalTestimonials = await Testimonials.countDocuments();
                const testimonials = await Testimonials.find()
                .sort({ date: -1 })
                .sort({ date: -1 }) // Sort by date descending
                .skip(skip) // Skip documents for pagination
                .limit(limit); // Limit to 5 documents
                const totalPages = Math.ceil(totalTestimonials / limit); // Calculate total pages
                res.render('admin/testimonial', {testimonials, currentPage: page,
                    totalPages, successMsg: 'Testimonial added successfully!', errorMsg: null });
                // res.redirect(302, '/testimonial?successMsg=' + encodeURIComponent('Testimonial added successfully!'));
            }
        } catch (error) {
            // res.redirect(302, '/service?error_msg=Failed to add blog');
            res.redirect(302, '/testimonial?errorMsg=' + encodeURIComponent('Failed to add Testimonial'));
            console.error('Server Error:', error); // Log the actual error
            res.status(500).send('Server Error');
        }
    });
}


//Delete a Testimonial
export const deleteTestimonial = async (req, res) => {

    try{
        await Testimonials.findById(req.params.id);
      
            const testimonials1 = await Testimonials.findById(req.params.id);
            if (!testimonials1) {
                res.redirect(302, '/testimonial?error_msg=' + encodeURIComponent('Project Not Found'));
                return res.redirect('/testimonial');
            }
            await Testimonials.findByIdAndDelete(req.params.id);
            const page = parseInt(req.query.page) || 1; // Current page number, default to 1
                const limit = 5; // Number of posts per page
                const skip = (page - 1) * limit; // Number of documents to skip
                const totalTestimonials = await Testimonials.countDocuments();
                const testimonials = await Testimonials.find()
                .sort({ date: -1 })
                .sort({ date: -1 }) // Sort by date descending
                .skip(skip) // Skip documents for pagination
                .limit(limit); // Limit to 5 documents
                const totalPages = Math.ceil(totalTestimonials / limit); // Calculate total pages
                res.render('admin/testimonial', {testimonials, currentPage: page,
                    totalPages, successMsg: 'Testimonial added successfully!', errorMsg: null });
    }catch(error){
        res.redirect(302, '/testimonial?errorMsg=' + encodeURIComponent('Failed to add project'));
        console.error('Server Error:', error); // Log the actual error
        res.status(500).send('Server Error');
    }
};