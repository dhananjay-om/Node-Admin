import Visitor from '../models/Visitor.js';

export const trackVisitor = async (req, res, next) => {
    console.log('tracking  vistor');
    try {
        let visitor = await Visitor.findOne();

        if (!visitor) {
            // If no visitor record exists, create one
            visitor = new Visitor({ count: 1 });
        } else {
            // Increment the count
            visitor.count += 1;
        }

        await visitor.save();
        req.visitorCount = visitor.count; // Pass the count to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error tracking visitor:', error);
        next();
    }
};
