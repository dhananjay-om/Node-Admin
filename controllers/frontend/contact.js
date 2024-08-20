
import Setting from "../../models/Setting.js";
import Newsletter from "../../models/Newsletter.js";

import nodemailer from 'nodemailer';
export const contactController =async (req,res)=>{
    const setting = await Setting.findOne();
    res.render('frontend/contact',{setting: setting});
}


//send a email for contact

export const sendEmail = async (req,res)=>{
    
    const { name, email, message } = req.body;

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services or custom SMTP
        auth: {
            user: 'tester2.om@gmail.com',
            pass: 'tppgpbdzocqhfyro', 
        },
    });

    // Setup email data
    const mailOptions = {
        from: email,
        to: 'kumar.dhananjay@orangemantra.in', // Replace with your email address
        subject: `Contact Us Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send email');
        }
        console.log('Email sent:', info.response);
        //res.send('Email sent successfully');
        // Redirect with success message
        res.redirect('/contact?success_msg=' + encodeURIComponent('Email sent successfully!'));
    });
};

// //send a email for subscribe

export const newletterSubscribe = async (req, res) => {
    const email = req.body.email;

    console.log('Subscribe: ' + email);

    try {
        // Check if email is already subscribed
        const existingEmail = await Newsletter.findOne({ email });
        if (existingEmail) {
            return res.redirect('/contact?error_msg=' + encodeURIComponent('Already subscribed'));
        }

        // If email is not subscribed, create a new subscription
        const newNewsletter = new Newsletter({
            email
        });

        await newNewsletter.save();

        // Send subscription confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services or custom SMTP
            auth: {
                user: 'tester2.om@gmail.com',
                pass: 'tppgpbdzocqhfyro',
            },
        });

        const mailOptions = {
            from: 'tester2.om@gmail.com', // Your email address
            to: email, // Recipient email address
            subject: `Newsletter Subscription`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Subscription Success</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #4CAF50;
                        padding: 20px;
                        text-align: center;
                        color: #ffffff;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        text-align: center;
                    }
                    .content h2 {
                        font-size: 22px;
                        margin-bottom: 10px;
                    }
                    .content p {
                        font-size: 16px;
                        margin-bottom: 20px;
                        line-height: 1.5;
                    }
                    .content a {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                    }
                    .footer {
                        background-color: #f4f4f4;
                        padding: 10px;
                        text-align: center;
                        font-size: 14px;
                        color: #888;
                    }
                    .footer a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Our Newsletter!</h1>
                    </div>
                    <div class="content">
                        <h2>Subscription Successful!</h2>
                        <p>Thank you for subscribing to our newsletter. We're excited to have you on board. You'll now receive the latest updates, news, and exclusive content directly in your inbox.</p>
                        <a href="#">Visit Our Website</a>
                    </div>
                    <div class="footer">
                        <p>If you have any questions, feel free to <a href="#">contact us</a> at any time.</p>
                        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Failed to send email');
            }
            console.log('Email sent:', info.response);
            // Redirect with success message
            res.redirect('/contact?success_msg=' + encodeURIComponent('Newsletter Subscribe successfully!'));
        });

    } catch (error) {
        console.error('Server Error:', error); // Log the actual error
        res.redirect(302, '/contact?error_msg=' + encodeURIComponent('Failed to subscribe to the newsletter.'));
    }
};
