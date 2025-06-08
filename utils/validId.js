import mongoose from 'mongoose';

export const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};