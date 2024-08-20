
//packag import
import express from 'express';
import dotenv from 'dotenv';
import colors from "colors";
import morgan from 'morgan';

const app = express();

import bodyParser from 'body-parser';
const port=process.env.PORT || 4000;
//Dot Env configuration
dotenv.config();

//connect to db server
// file imports
import connectDB from './config/db.js';
//connect to db
connectDB();

//Routes
import web from './routes/web.js';
import admin from './routes/admin.js';

app.use(bodyParser.urlencoded({ extended: true }));
import session from 'express-session';

app.use(session({
    secret: 'NJIKOYTR2',    
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
import { attachUserToLocals } from './middelwares/userData.js';
app.use(attachUserToLocals);
app.use('/',web);
app.use('/',admin);   


// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`.white.bold);
});
