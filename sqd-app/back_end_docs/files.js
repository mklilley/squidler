/**
 * @api {post} files Upload an image
 * @apiName PostFile
 * @apiGroup Files
 *
 * @apiParam (Form data) {Blob} file Blob representation of a jpeg image
*
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       'Content-Type': undefined
 *     }
 *
 * @apiSuccess {Boolean} success       Specifies that the request was successful.
 * @apiSuccess {Object} file           Wrapper object for the response data
 *     @apiSuccess {String}  file.url      Location of uploaded image on the squidler server
 *
 * @apiSuccessExample {json} Response-Example:
 * {
 *   sucess: true,
 *   file: {
 *         url: 'http://squidler.com/api/v1/files/jrE9PktiPS0f3JoDcWoiXc.jpeg'
 *    }
 * }
 */
