function sendJsonResponse(res, status, content) {
    res.status(status).json(content);
}

module.exports = sendJsonResponse;