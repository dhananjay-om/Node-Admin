import Setting from "../../models/Setting.js";
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

// Render the Setting page
export const getsetting = async (req, res) => {
  try {
    const setting = await Setting.findOne(); // Assuming you have only one setting setting
    res.render("admin/setting", { setting: setting || {}, errorMsg: null });
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).send("Error fetching setting.");
  }
};

// Update setting
export const updatesetting = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err);
      // return res.status(500).send(err.message);
      return res.redirect(
        302,
        "/allblog?error_msg=" + encodeURIComponent(err.message)
      );
    }
    const { title, copyright, address,email,phone, facebook, twitter, instagram } =
      req.body;
    const image = req.file ? req.file.filename : null; // Assuming you handle file uploads with Multer

    // console.log(
    //   "Updating setting" + name,
    //   description,
    //   postion,
    //   facebook,
    //   twitter,
    //   instagram
    // );
    // console.log("Image:", image);
    try {
      let setting = await Setting.findOne();

      if (setting) {
        // Update existing setting
        setting.title = title;
        setting.copyright = copyright;
        setting.address = address;
        setting.email = email;
        setting.phone = phone;

        if (image) {
            setting.image = image;
        }

        setting.socialLinks = {
          facebook,
          twitter,
          instagram,
        };

        await setting.save();
        res.redirect("/site-setting?success_msg=setting updated successfully");
      } else {
        // Create new setting if not found
        setting = new Setting({
            title,
          image,
          copyright,
          address,
          email,
          phone,
          socialLinks: {
            facebook,
            twitter,
            instagram,
          },
        });

        await setting.save();
        res.redirect("/site-setting?success_msg=setting created successfully");
      }
    } catch (error) {
      console.error("Error updating setting:", error);
      res.redirect("/site-setting?error_msg=Failed to update setting");
    }
  });
};
