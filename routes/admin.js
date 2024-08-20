import express from 'express';
import { indexController } from '../controllers/admin/index.js';
import { forgotPassword, forgotPasswordController, loginController, loginuser, logout, registerController, registerUserController, resetPasswordController, resetPasswordFormController } from '../controllers/admin/loginlogout.js';
import { addserviceController, createserviceController, deleteService, serviceController, ServiceDetails } from '../controllers/admin/service.js';
import { addprojectController, createprojectController, deleteProject, projectController, ProjectDetails } from '../controllers/admin/project.js';
import{ensureAuthenticated} from '../middelwares/authMiddleware.js';
import { addtestimonialController, deleteTestimonial, testimonialsController } from '../controllers/admin/testimonials.js';
import { addblogController, blogController, BlogDetails, createblogController, deleteBlog } from '../controllers/admin/blog.js';
import { getaccount, updateaccount } from '../controllers/admin/account.js';
import { getsetting, updatesetting } from '../controllers/admin/setting.js';
import { deleteNewsletter, newsletterController } from '../controllers/admin/newsletter.js';
const router = express.Router();
router.get('/admin',ensureAuthenticated,indexController);

//Login and Regsiter controllers//
router.get('/login',loginController);
router.get('/register',registerController);
router.post('/register',registerUserController);
router.post('/login',loginuser);
router.get('/logout',logout);

//Reset password
router.get('/forgot-password',forgotPassword);
router.post('/forgot-password', forgotPasswordController);
router.get('/reset-password/:token', resetPasswordFormController);
router.post('/reset-password/:token', resetPasswordController);

// Route for adding a new service (GET and POST)
router.get('/allservice',ensureAuthenticated,serviceController);
router.get('/service',ensureAuthenticated, createserviceController);
router.post('/service',ensureAuthenticated, addserviceController);
router.get('/service/:id', ensureAuthenticated,createserviceController);
router.post('/service/:id',ensureAuthenticated, serviceController);
router.post('/delete-service/:id',ensureAuthenticated,deleteService); 
router.get('/sevice-details/:id',ensureAuthenticated,ServiceDetails);

// Route for Project Management || GET||POST //

router.get('/allproject',ensureAuthenticated,projectController);
router.get('/project',ensureAuthenticated,createprojectController);
router.post('/project',ensureAuthenticated, addprojectController);
router.get('/project/:id',ensureAuthenticated,createprojectController)
router.post('/delete-project/:id',ensureAuthenticated,deleteProject);
router.get('/project-details/:id',ensureAuthenticated,ProjectDetails);


//Route for Testimonial || GET || POST //

router.get('/testimonial',ensureAuthenticated,testimonialsController);
router.post('/testimonial',ensureAuthenticated, addtestimonialController);
router.post('/delete-testimonial/:id',ensureAuthenticated, deleteTestimonial);

//Route for Blog || GET || POST //

router.get('/allblog',ensureAuthenticated,blogController);
router.get('/manageblog',ensureAuthenticated,createblogController);
router.post('/manageblog',ensureAuthenticated, addblogController);
router.get('/manageblog/:id',ensureAuthenticated,createblogController);
router.post('/delete-blog/:id',ensureAuthenticated,deleteBlog);
router.get('/blog-details/:id',ensureAuthenticated, BlogDetails);

//Rotes for Myaccount || GET || POST 

router.get('/myaccount',ensureAuthenticated, getaccount);
router.post('/myaccount', ensureAuthenticated, updateaccount);

//Routers for Site Setting || GET || POST

router.get('/site-setting',ensureAuthenticated,getsetting);
router.post('/site-setting',ensureAuthenticated,updatesetting);

//router for newsletter || GET || POST ||
router.get('/newslettersubscriber',ensureAuthenticated,newsletterController);
router.post('/newslettersubscriber/:id',ensureAuthenticated,deleteNewsletter);
export default router;