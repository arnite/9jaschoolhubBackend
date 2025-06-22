import validator from 'validator';

export const validateUniversity = (reqBody = {}) => {
    const {
        image,
        universityName,
        location,
        type,
        website,
        email,
        phone,
        address,
        programmes,
        requirements,
        notes
    } = reqBody

    if (!universityName || validator.isEmpty(universityName)) {
        return { message: 'University name is required', statusCode: 400 };
    }

    if (!location || validator.isEmpty(location)) {
        return { message: 'Location is required', statusCode: 400 };
    }

    if (!type || validator.isEmpty(type)) {
        return { message: 'Type is required', statusCode: 400 };
    }

    if (!website || !validator.isURL(website)) {
        return { message: 'Website must be a valid url', statusCode: 400 };
    }

    if (email && !validator.isEmail(email)) {
        return { message: 'Invalid email', statusCode: 400 };
    }

    if (phone && !validator.isMobilePhone(String(phone), 'any')) {
        return { message: 'Invalid Phone number', statusCode: 400 };
    }

    if (programmes && !Array.isArray(programmes)) {
        return { message: 'Programmes must be an array', statusCode: 400 };
    }

    if (requirements && !Array.isArray(requirements)) {
        return { message: 'Requirements must be an array', statusCode: 400 };
    }

    // return null if there is no error
    return null;
};