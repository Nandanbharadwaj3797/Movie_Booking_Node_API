const USER_STATUS = {
    approved: "APPROVED",
    pending: "PENDING",
    rejected: "REJECTED"
};

const USER_ROLE = {
    customer: "CUSTOMER",
    admin: "ADMIN",
    client: "CLIENT"
}

const STATUS_CODES = {
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201,
    UNAUTHORISED: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    DUPLICATE_KEY_ERROR: 11000,
    CONFLICT: 409,
    FORBIDDEN: 403,
    CREATED: 201,
    UNPROCESSABLE_ENTITY: 422

}

module.exports = {
    USER_ROLE,
    USER_STATUS,
    STATUS: STATUS_CODES
}