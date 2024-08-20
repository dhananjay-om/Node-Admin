import Account from "../../models/Accounts.js";
import multer from "multer";
import path from "path";
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});
const upload = multer({ storage: storage }).single("image");

// Render the account page
export const getaccount = async (req, res) => {
  try {
    const account = await Account.findOne(); // Assuming you have only one account document
    res.render("admin/account", { account: account || {}, errorMsg: null });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).send("Error fetching account.");
  }
};

// Update account
export const updateaccount = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err);
      // return res.status(500).send(err.message);
      return res.redirect(
        302,
        "/allblog?error_msg=" + encodeURIComponent(err.message)
      );
    }
    const { name, description, postion, facebook, twitter, instagram } =
      req.body;
    const image = req.file ? req.file.filename : null; // Assuming you handle file uploads with Multer

    console.log(
      "Updating account" + name,
      description,
      postion,
      facebook,
      twitter,
      instagram
    );
    console.log("Image:", image);
    try {
      let account = await Account.findOne();

      if (account) {
        // Update existing account
        account.name = name;
        account.description = description;
        account.postion = postion;
        if (image) {
          account.image = image;
        }

        account.socialLinks = {
          facebook,
          twitter,
          instagram,
        };

        await account.save();
        res.redirect("/myaccount?success_msg=Account updated successfully");
      } else {
        // Create new account if not found
        account = new Account({
          name,
          image,
          description,
          socialLinks: {
            facebook,
            twitter,
            instagram,
          },
        });

        await account.save();
        res.redirect("/myaccount?success_msg=Account created successfully");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      res.redirect("/myaccount?error_msg=Failed to update account");
    }
  });
};
