/**
 * A restify plugin for formatting image/png mime types
 *
 * @param res
 * @param req
 * @param body
 * @returns {*}
 */
module.exports = function imageFormatter(res, req, body){
    if (body instanceof Error)
        res.statusCode = body.statusCode || 500;

    if (!Buffer.isBuffer(body))
        body = new Buffer(body.toString(), 'base64');

    res.setHeader('Content-Length', body.length);
    return (body);
};