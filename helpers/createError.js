function createError(statusCode, message) {
    var err = new Error(message)
    err.status = statusCode
    return err
}

module.exports = createError;