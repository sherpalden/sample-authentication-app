class UserFacingError extends Error {

}

class BadRequestError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 400;
    }
}

class NotAuthorizedError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 401;
    }
}

class NotFoundError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 404
    }
}

class ForbiddenError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 403
    }
}

module.exports = {
    UserFacingError,
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    ForbiddenError,
}
