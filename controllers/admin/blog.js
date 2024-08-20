import Blog from '../../models/Blog.js';
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

// blog Controllers //
export const blogController = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit; // Number of documents to skip
    try {
        const totalBlogs = await Blog.countDocuments();
        const blog = await Blog.find()
        .sort({ date: -1 })
        .sort({ date: -1 }) // Sort by date descending
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit to 5 documents
        const totalPages = Math.ceil(totalBlogs / limit); // Calculate total pages
        res.render('admin/allblog', {blog, currentPage: page,
            totalPages});

    }catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).send('Server Error'); 
    }
 };


 // blog Form Render
 export const createblogController = async (req, res) => {
   
    const { id } = req.params;
    if (id) {
        // Edit mode
        try {
            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            res.render('admin/blog', { blog, savemode : true, isEditing: true, blogdetails:false  });
        } catch (error) {
            console.error('Server Error:', error);
            res.status(500).send('Server Error');
        }
    } else {
        // Add mode
        res.render('admin/blog', { blog: {}, savemode : true, isEditing: false, blogdetails:false });
    }


    //res.render('admin/service');
 };

 //Save Blog Controller 
 export const addblogController = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            // return res.status(500).send(err.message);
            return res.redirect(302, '/allblog?error_msg=' + encodeURIComponent(err.message));
        }

        const { id,title,description,shortdescription,author,tag, category} = req.body; // Ensure author is also included
        const image = req.file ? req.file.filename : null; // Access the uploaded image filename
        try {

            if (id) {
                // Edit existing blog
                const blog = await Blog.findById(id);
                if (!blog) {
                    res.redirect(302, '/allblog?error_msg=' + encodeURIComponent('Blog Not Found'));
                    return res.redirect('/allblog');
                }

                blog.title = title;
                blog.description = description;
                blog.image = image || blog.image; // Keep the old image if no new one is uploaded
                blog.tag = tag,
                blog.shortdescription = shortdescription,
                blog.author = author,
                blog.category = category,
                await blog.save();
                res.redirect(302, '/allblog?success_msg=' + encodeURIComponent('Blog updated successfully!'));
            } else {
                const newBlog = new Blog({
                    title,
                    tag,
                    description,
                    shortdescription,
                    image,
                    author,
                    category
                });

                await newBlog.save();
                //res.redirect(302, '/service?success_msg=Blog Added successfully!');
                res.redirect(302, '/allblog?success_msg=' + encodeURIComponent('Blog added successfully!'));
            }
        } catch (error) {
            // res.redirect(302, '/service?error_msg=Failed to add blog');
            res.redirect(302, '/allblog?error_msg=' + encodeURIComponent('Failed to add blog'));
            console.error('Server Error:', error); // Log the actual error
            res.status(500).send('Server Error');
        }
    });
}

//Delete a Blog

export const deleteBlog = async (req, res) => {

    try{
        await Blog.findById(req.params.id);
      
            const blog = await Blog.findById(req.params.id);
            if (!blog) {
                res.redirect(302, '/allblog?error_msg=' + encodeURIComponent('Blog Not Found'));
                return res.redirect('/blog');
            }
            await Blog.findByIdAndDelete(req.params.id);
            res.redirect(302, '/allblog?success_msg=' + encodeURIComponent('Blog deleted successfully!'));
    }catch(error){
        res.redirect(302, '/allblog?error_msg=' + encodeURIComponent('Failed to add Blog'));
        console.error('Server Error:', error); // Log the actual error
        res.status(500).send('Server Error');
    }
};


//View Blog//

export const BlogDetails = async(req, res) =>{

    try{
        await Blog.findById(req.params.id);
      
            const blog = await Blog.findById(req.params.id);
            if (!blog) {
                res.redirect(302, '/allblog?error_msg=' + encodeURIComponent('Blog Not Found'));
                return res.redirect('/allblog');
            }
            res.render('admin/blog', { blog, blogdetails:true, savemode : false,isEditing:false });
            
    }catch(error){
        res.redirect(302, '/allblog?error_msg=' + encodeURIComponent('Something Went wrong'));
        console.error('Server Error:', error); // Log the actual error
        res.status(500).send('Server Error');
    }
};