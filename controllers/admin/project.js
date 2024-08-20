import Project from '../../models/Project.js';
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

// Project Controllers //
export const projectController = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit; // Number of documents to skip
    try {
        const totalBlogs = await Project.countDocuments();
        const project = await Project.find()
        .sort({ date: -1 })
        .sort({ date: -1 }) // Sort by date descending
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit to 5 documents
        const totalPages = Math.ceil(totalBlogs / limit); // Calculate total pages
        res.render('admin/allproject', {project, currentPage: page,
            totalPages});

    }catch (error) {
        console.error('Error fetching Project:', error);
        res.status(500).send('Server Error'); 
    }
 };

 // Project Form Render
 export const createprojectController = async (req, res) => {
   
    const { id } = req.params;
    if (id) {
        // Edit mode
        try {
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).send('Project not found');
            }
            res.render('admin/project', { project, savemode : true, isEditing: true, projectdetails:false  });
        } catch (error) {
            console.error('Server Error:', error);
            res.status(500).send('Server Error');
        }
    } else {
        // Add mode
        res.render('admin/project', { project: {}, savemode : true, isEditing: false, projectdetails:false });
    }


    //res.render('admin/service');
 };

 //Save Project Controller 
 export const addprojectController = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            // return res.status(500).send(err.message);
            return res.redirect(302, '/allproject?error_msg=' + encodeURIComponent(err.message));
        }

        const { id,title,rating,client,website,completed,tag, description,shortdescription} = req.body; // Ensure author is also included
        const image = req.file ? req.file.filename : null; // Access the uploaded image filename
        try {

            if (id) {
                // Edit existing project
                const project = await Project.findById(id);
                if (!project) {
                    res.redirect(302, '/allproject?error_msg=' + encodeURIComponent('Project Not Found'));
                    return res.redirect('/project');
                }

                project.title = title;
                project.description = description;
                project.image = image || project.image; // Keep the old image if no new one is uploaded
                project.tag = tag,
                project.shortdescription = shortdescription,
                project.rating = rating,
                project.client = client,
                project.website = website,
                project.completed = completed; // Save the new data to the database
                
                
                await project.save();
                res.redirect(302, '/allproject?success_msg=' + encodeURIComponent('Project updated successfully!'));
            } else {
                const newProject = new Project({
                    title,
                    rating,
                    client,
                    website,
                    completed,
                    tag,
                    description,
                    shortdescription,
                    image
                });

                await newProject.save();
                //res.redirect(302, '/service?success_msg=Blog Added successfully!');
                res.redirect(302, '/allproject?success_msg=' + encodeURIComponent('Project added successfully!'));
            }
        } catch (error) {
            // res.redirect(302, '/service?error_msg=Failed to add blog');
            res.redirect(302, '/allproject?error_msg=' + encodeURIComponent('Failed to add Project'));
            console.error('Server Error:', error); // Log the actual error
            res.status(500).send('Server Error');
        }
    });
}

//Delete a project

export const deleteProject = async (req, res) => {

    try{
        await Project.findById(req.params.id);
      
            const project = await Project.findById(req.params.id);
            if (!project) {
                res.redirect(302, '/allproject?error_msg=' + encodeURIComponent('Project Not Found'));
                return res.redirect('/project');
            }
            await Project.findByIdAndDelete(req.params.id);
            res.redirect(302, '/allproject?success_msg=' + encodeURIComponent('Project deleted successfully!'));
    }catch(error){
        res.redirect(302, '/allproject?error_msg=' + encodeURIComponent('Failed to add project'));
        console.error('Server Error:', error); // Log the actual error
        res.status(500).send('Server Error');
    }
};


//View Project//

export const ProjectDetails = async(req, res) =>{

    try{
        await Project.findById(req.params.id);
      
            const project = await Project.findById(req.params.id);
            if (!project) {
                res.redirect(302, '/allproject?error_msg=' + encodeURIComponent('Project Not Found'));
                return res.redirect('/allproject');
            }
            res.render('admin/project', { project, projectdetails:true, savemode : false,isEditing:false });
            
    }catch(error){
        res.redirect(302, '/allproject?error_msg=' + encodeURIComponent('Something Went wrong'));
        console.error('Server Error:', error); // Log the actual error
        res.status(500).send('Server Error');
    }
};