import express from 'express';
import { indexController } from '../controllers/frontend/index.js'; 
import { aboutController } from '../controllers/frontend/about.js';
import { serviceController } from '../controllers/frontend/service.js';
import { portfolioController } from '../controllers/frontend/portfolio.js';
import { blogController } from '../controllers/frontend/blog.js';
import { contactController, newletterSubscribe, sendEmail } from '../controllers/frontend/contact.js';
const router = express.Router();


router.get('/',indexController);
router.get('/about',aboutController);
router.get('/services',serviceController);
router.get('/portfolio',portfolioController);
router.get('/blog',blogController);
router.get('/contact',contactController);
router.post('/contact',sendEmail);
router.post('/newletter',newletterSubscribe);


export default router;