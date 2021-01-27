/**
 * @api {post} support/question Send support email
 * @apiName PostSupport
 * @apiGroup Support
 *
 * @apiParam (JSON data) {Object} email Wrapper object for the request data
 * @apiParam (JSON data) {String} email.name Name
 * @apiParam (JSON data) {String} email.email Email address
 * @apiParam (JSON data) {String} email.message Content of the email
 * 
 * @apiParamExample {json} Request-Example:
 * {
 *     email: {
 *         name: 'Jo',
 *         email: 'jo@blogs.com',
 *         message: 'I need help!'
 *     }
 * }
 *
 *
 * @apiSuccess {Boolean} success       Specifies that the request was successful.
 * @apiSuccess {Object} email           Wrapper object for the response data
 *     @apiSuccess {String}  email.message      Text response from the server
 *
 * @apiSuccessExample {json} Response-Example:
 * {
 *   sucess: true,
 *   email: {
 *         message: 'The support team will be back to you ASAP.'
 *    }
 * }
 */