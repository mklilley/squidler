/**
 * @api {post} users Create user
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam (JSON data) {Object} user Wrapper object for the request data
 * @apiParam (JSON data) {String} user.username Username
 * @apiParam (JSON data) {String} user.email Email address
 * @apiParam (JSON data) {String} user.password Password
 * 
 * @apiParamExample {json} Request-Example:
 * {
 *     user: {
 *         username: 'joblogs',
 *         email: 'jo@blogs.com',
 *         password: 'secret'
 *     }
 * }
 *
 *
 * @apiSuccess {Boolean} success       Specifies that the request was successful.
 * @apiSuccess {Object} user           Wrapper object for the response data
 *     @apiSuccess {String}  user.username      Username
 *     @apiSuccess {String}  user.email      jo@blogs.com
 *
 * @apiSuccessExample {json} Response-Example:
 * {
 *   sucess: true,
 *   user: {
 *         username: 'joblogs',
 *         email: 'jo@blogs.com'
 *    }
 * }
 */


/**
 * @api {get} users/:username Read user account info
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} username Username
 *
 * @apiSuccess {Boolean} success       Specifies that the user account info was successfully read
 * @apiSuccess {Object} user Wrapper object for the response data
 * @apiSuccess {String} user.username Username
  * @apiSuccess {String} user.email Email address of the user 
  * @apiSuccess {Integer} user.verified IS the user verified (=1) or not (=0)
  *
 * @apiSuccessExample {json} Response-Example:
* {
*    success: true,
*    user: {
*        username: 'joblogs' 
*        email: 'jo@blogs.com',
*        verified: 1
*    }
* }
 *
 */




/**
 * @api {post} users/:username?_method=put Update user account info
 * @apiName PutUser
 * @apiGroup User
 *
 * @apiParam {String} username Username
 *
* @apiParam (JSON data) {Object} user Wrapper object for the request data
 * @apiParam (JSON data) {String} user.email Email address
 * 
 * @apiParamExample {json} Request-Example:
 * {
 *     user: {
 *         email: 'jo@blogs.com',
 *     }
 * }
 *
 *
 * @apiSuccess {Boolean} success       Specifies that the request was successful.
 * @apiSuccess {Object} user           Wrapper object for the response data
 *     @apiSuccess {String}  user.username      Username
 *     @apiSuccess {String}  user.email      jo@blogs.com
 *
 * @apiSuccessExample {json} Response-Example:
 * {
 *   sucess: true,
 *   user: {
 *         username: 'joblogs',
 *         email: 'jo@blogs.com'
 *    }
 * }
 */