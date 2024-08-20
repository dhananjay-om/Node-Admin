import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
export const loginController = async (req, res) => {
   res.render('admin/login', { successMsg: null, errorMsg: null });
};



   //Register  Controller//

   export const registerController = async (req, res) => {
      res.render('admin/register', { success_msg : null, errorMsg : null }); 
   };

   //Register User Controller//
 export const registerUserController = async (req, res) => {

    //res.render('admin/register');
    const {name, username, email, password  } = req.body;
    console.log(name, username, email, password);
    // Validate user input
    if (!name || !username || !email || !password ) {
      console.log('Please enter all required fields');
        return res.render('admin/register', { successMsg: null, errorMsg: 'Please fill in all fields.' });
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('admin/register', { successMsg: null, errorMsg: 'Email already registered.' });
        }

        // Create a new user
        const newUser = new User({ name, username, email, password });
        await newUser.save();

        res.redirect('login?success_msg=' + encodeURIComponent('You are now registered and can log in.'));

        // res.render('login', { success_msg: 'You are now registered and can log in.', error_msg: null });
    } catch (error) {
        console.error('Error during registration:', error);
        res.render('admin/register', { successMsg: null, errorMsg: error });
    }
 };

//Login User Controller

 export const loginuser = async (req, res) => {
   const { email, password } = req.body;

   // Check if email and password are provided
   if (!email || !password) {
       return res.render('admin/login', { successMsg: null, errorMsg: 'Please fill in all fields.' });
   }

   try {
       // Find the user by email
       const user = await User.findOne({ email });
       //console.log('user email' + user.email);

       if (!user) {
           return res.render('admin/login', { successMsg: null, errorMsg: 'Email is not registered.' });
       }

       // Compare passwords
       const isMatch = await bcrypt.compare(password, user.password);

       if (!isMatch) {
           return res.render('admin/login', { successMsg: null, errorMsg: 'Invalid password.' });
       }

       // Set user in session
       req.session.user = user;  
       res.redirect('/admin');
      
   } catch (error) {
       console.error('Login Error:', error);
       return res.render('admin/login', { successMsg: null, errorMsg: 'Server error, please try again later.' });
   }
};

//logout user from

export const logout = (req, res) => {
   req.session.destroy((err) => {
       if (err) {
           return res.redirect('/admin');
       }
       res.redirect('/login');
   });
};
//forgot password
export const forgotPassword = (req, res) => {
   res.render('admin/forgot-password',{errorMsg: null, successMsg: null}); 
};

//forgo password email send
export const forgotPasswordController = async (req, res) => {
   const { email } = req.body;

   try {
         if(!email){
            return res.render('admin/forgot-password', { errorMsg: 'Please Enter email address',successMsg: null });
         }
       const user = await User.findOne({ email });
       if (!user) {
           return res.render('admin/forgot-password', { errorMsg: 'No account with that email address exists.' });
       }

       const token = crypto.randomBytes(20).toString('hex');
       user.resetPasswordToken = token;
       user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

       await user.save();

       const transporter = nodemailer.createTransport({
           service: 'Gmail',
           auth: {
               user: 'tester2.om@gmail.com',
               pass: 'tppgpbdzocqhfyro',
           },
       });

       const mailOptions = {
           to: user.email,
           from: 'passwordreset@yourapp.com',
           subject: 'Password Reset',
           text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           http://${req.headers.host}/reset-password/${token}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`
       };

       await transporter.sendMail(mailOptions);
       res.render('admin/forgot-password', { errorMsg: null, successMsg: 'An e-mail has been sent with further instructions.' });
   } catch (error) {
       console.error('Error sending reset email:', error);
       //res.status(500).send('Error sending reset email.');
       return res.render('admin/forgot-password', { successMsg : null, errorMsg: 'Error sending reset email.' });
   }
};



export const resetPasswordFormController = async (req, res) => {
   try {
      const user = await User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
          return res.render('admin/reset-password', {successMsg : null, errorMsg: 'Password reset token is invalid or has expired.' });
      }

      res.render('admin/reset-password', { token: req.params.token, successMsg : null, errorMsg: null });
  } catch (error) {
      console.error('Error fetching user for reset:', error);
      //res.status(500).send('Error fetching user for reset.');
      return res.render('admin/reset-password', {successMsg : null, errorMsg: 'Error fetching user for reset.' });
  }
};

export const resetPasswordController = async (req, res) => {
   const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('admin/reset-password', {successMsg : null, errorMsg: 'Passwords do not match.', token: req.params.token });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.render('admin/reset-password', { successMsg: null, errorMsg: 'Password reset token is invalid or has expired.' });
        }

         // Hash the new password before saving
        // Hash the new password before saving
        const testPassword = 'newpassword123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testPassword, salt);
        console.log('Manual Hash:', hashedPassword);

         user.password = hashedPassword;
         user.resetPasswordToken = undefined;
         user.resetPasswordExpires = undefined;
         await user.save();

        res.render('admin/login', {errorMsg: null, successMsg: 'Your password has been updated!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password.'); 
    }
}