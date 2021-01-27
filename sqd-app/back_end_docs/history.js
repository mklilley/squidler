/**
 * @api {get} history/:username Read squidles history
 * @apiName GetHistory
 * @apiGroup History
 *
 * @apiParam {String} username Username
 *
 * @apiSuccess {Boolean} success       Specifies that the history was successfully read
 * @apiSuccess {Object} history Wrapper object for the response data
 * @apiSuccess {Array} history.shorts Array of shortlinks/ids for the squidles in the history
  * @apiSuccess {Array} history.actions Array showing whether the user sent the corresponding squidle, or received it

 * @apiSuccessExample {json} Response-Example:
 * {
 *    success: true,
 *    history: {
 *        shorts: ['TEUjKoo', 'Pfz8Fd4'],
 *        actions: ['sent', 'received']
 *    }
 * }
 *
 *
 */
