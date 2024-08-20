import Newsletter from '../../models/Newsletter.js';

export const newsletterController = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit; // Number of documents to skip
    try {
        const totalNewslatter = await Newsletter.countDocuments();
        const subscriber = await Newsletter.find()
        .sort({ date: -1 })
        .sort({ date: -1 }) // Sort by date descending
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit to 5 documents
        const totalSubscriber = Math.ceil(totalNewslatter / limit); // Calculate total pages
        res.render('admin/newsletter', {subscriber, currentPage: page,
            totalSubscriber});

    }catch (error) {
        console.error('Error fetching Project:', error);
        res.status(500).send('Server Error'); 
    }
 };

 export const deleteNewsletter = async (req, res) => {
    const { id } = req.params;
    try {
        const subscriber = await Newsletter.findByIdAndDelete(id);
        if (!subscriber) {
            res.redirect(302, '/newslettersubscriber?error_msg=' + encodeURIComponent('No subscriber found'));
        }
        res.redirect(302, '/newslettersubscriber?success_msg=' + encodeURIComponent('Subscriber deleted successfully!'));
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        res.status(500).send('Server Error');
    }
 };
