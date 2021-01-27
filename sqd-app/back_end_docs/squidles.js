/**
 * @api {post} squidles Create squidle
 * @apiName PostSquidle
 * @apiGroup Squidles
 *
 * @apiParam (JSON data) {Object} squidle Wrapper object for the request data
 *     @apiParam (JSON data) {Object} squidle.challenge Challenge data
 *         @apiParam (JSON data) {Object} squidle.challenge.text Text part of the challenge data
 *             @apiParam (JSON data) {String} squidle.challenge.text.value Value of the text data
 *         @apiParam (JSON data) {Object} squidle.challenge.photo Photo part of the challenge data
 *             @apiParam (JSON data) {String} squidle.challenge.photo.value Url of the photo
 *             @apiParam (JSON data) {Boolean} squidle.challenge.photo.uploaded Shows whether the photo is located on the Squidler servers
 *         @apiParam (JSON data) {Object} squidle.challenge.video Video part of the challenge data (CANNOT HAVE BOTH VIDEO AND PHOTO)
 *             @apiParam (JSON data) {String} squidle.challenge.video.value Url of the photo
 *
 *     @apiParam (JSON data) {Object} squidle.prize Prize data
 *         @apiParam (JSON data) {Object} squidle.prize.text Text part of the prize data
 *             @apiParam (JSON data) {String} squidle.prize.text.value Value of the text data
 *         @apiParam (JSON data) {Object} squidle.prize.photo Photo part of the prize data
 *             @apiParam (JSON data) {String} squidle.prize.photo.value Url of the photo
 *             @apiParam (JSON data) {Boolean} squidle.prize.photo.uploaded Shows whether the photo is located on the Squidler servers
*         @apiParam (JSON data) {Object} squidle.prize.video Video part of the prize data (CANNOT HAVE BOTH VIDEO AND PHOTO)
 *             @apiParam (JSON data) {String} squidle.prize.video.value Url of the photo
 *
 *     @apiParam (JSON data) {Object} squidle.answer Answer data
 *         @apiParam (JSON data) {Object} squidle.answer.text Text part of the answer data
 *             @apiParam (JSON data) {String} squidle.answer.text.value Value of the text data
 *             @apiParam (JSON data) {String} squidle.answer.text.hint Placeholders to give hints for the answer
 *
 * 
 * @apiParamExample {json} Request-Example:
 * {
 *    squidle: {
 *        challenge: {
 *            text: {
 *                value: 'What is my favourite colour'
 *            },
 *            photo: {
 *                value: 'http://www.ccwater.org.uk/wp-content/uploads/2014/09/blue_wave_of_water.jpg',
 *                uploaded: false
 *            }
 *        },
 *        prize: {
 *            text: {
 *                value: 'When everyone in the office has a cough'
 *            },
 *            video: {
 *                value: 'https://youtu.be/IVFHyZSXKMw'
 *            }
 *        },
 *        answer: {
 *            text: {
 *                value: 'blue',
 *                hint: '••••'
 *            }
 *        }
 *    }
 * }
 *
 * @apiSuccess {Boolean} success       Specifies that the Squidle was successfully created
 * @apiSuccess {Object} squidle        Wrapper object for the response data
 *     @apiSuccess {Object}  squidle.challenge      Echo back the challenge data that was sent in the request
 *     @apiSuccess {Object}  squidle.prize          Echo back the prize data that was sent in the request
 *     @apiSuccess {Object}  squidle.answer         Echo back the answer data that was sent in the request
 *     @apiSuccess {String}  squidle.short          Id that uniquely identifies the Squidle
 *     @apiSuccess {String}  squidle.op             Username of the account that created the Squidle
 *     @apiSuccess {Object}  squidle.expires_at     Date and time that the Squidle will expire
 *         @apiSuccess {String}  squidle.expires_at.date     Date and time
 *         @apiSuccess {String}  squidle.expires_at.timezone     Time zone where the squidle was created
 *         @apiSuccess {Integer}  squidle.expires_at.timezone_type     NOT SURE WHAT THIS IS
 *
 * @apiSuccessExample {json} Response-Example:
 * {
 *    success: true,
 *    squidle: {
 *        challenge: {...
 *        },
 *        prize: {...
 *        },
 *        answer: {...
 *        }
 *        short: 'Nj0VE8f',
 *        op: 'jimmy',
 *        expires_at : {
 *            date: '2015-10-04 18:19:18',
 *            timezone: 'UTC',
 *            timezone_type: 3
 *        }
 *    }
 * }
 */

/**
 * @api {get} squidles/:id Read squidle
 * @apiName GetSquidle
 * @apiGroup Squidles
 *
 * @apiParam {String} id Unique ID of the Squidle.
 * @apiParam (Query parameter (optional)) {String}  answer Guess the answer to the Squidle
 *
 * @apiSuccess {Boolean} success       Specifies that the Squidle was successfully read
 * @apiSuccess {Object} squidle Wrapper object for the response data
 *     @apiSuccess {Object} squidle.challenge Challenge data
 *         @apiSuccess {Object} squidle.challenge.text Text part of the challenge data
 *             @apiSuccess {String} squidle.challenge.text.value Value of the text data
 *         @apiSuccess  {Object} squidle.challenge.photo Photo part of the challenge data
 *             @apiSuccess {String} squidle.challenge.photo.value Url of the photo
 *             @apiSuccess {Boolean} squidle.challenge.photo.uploaded Shows whether the photo is located on the Squidler servers
 *         @apiSuccess {Object} squidle.challenge.video Video part of the challenge data (CANNOT HAVE BOTH VIDEO AND PHOTO)
 *             @apiSuccess {String} squidle.challenge.video.value Url of the photo
 *
 *     @apiSuccess {Object} squidle.prize Prize data (ONLY RETURNED IF ANSWER PARMATER IS SENT AND CORRECT)
 *         @apiSuccess  {Object} squidle.prize.text Text part of the prize data
 *             @apiSuccess  {String} squidle.prize.text.value Value of the text data
 *         @apiSuccess  {Object} squidle.prize.photo Photo part of the prize data
 *             @apiSuccess  {String} squidle.prize.photo.value Url of the photo
 *             @apiSuccess  {Boolean} squidle.prize.photo.uploaded Shows whether the photo is located on the Squidler servers
*         @apiSuccess {Object} squidle.prize.video Video part of the challenge data (CANNOT HAVE BOTH VIDEO AND PHOTO)
 *             @apiSuccess  {String} squidle.prize.video.value Url of the photo
 *
 *     @apiSuccess  {Object} squidle.answer Answer data
 *         @apiSuccess  {Object} squidle.answer.text Text part of the answer data
 *             @apiSuccess {String} squidle.answer.text.hint Placeholders to give hints for the answer
*     @apiSuccess {String}  squidle.short          Id that uniquely identifies the Squidle
 *     @apiSuccess {String}  squidle.op             Username of the account that created the Squidle
 *     @apiSuccess {Object}  squidle.expires_at     Date and time that the Squidle will expire
 *         @apiSuccess {String}  squidle.expires_at.date     Date and time
 *         @apiSuccess {String}  squidle.expires_at.timezone     Time zone where the squidle was created
 *         @apiSuccess {Integer}  squidle.expires_at.timezone_type     NOT SURE WHAT THIS IS
 * @apiSuccessExample {json} Response-Example (no answer):
 * {
 *    success: true,
 *    squidle: {
 *        challenge: {
 *            text: {
 *                value: 'What is my favourite colour'
 *            },
 *            photo: {
 *                value: 'http://www.ccwater.org.uk/wp-content/uploads/2014/09/blue_wave_of_water.jpg',
 *                uploaded: false
 *            }
 *        },
 *        answer: {
 *            text: {
 *                hint: '••••'
 *            }
 *        },
 *        short: 'Nj0VE8f',
 *        op: 'jimmy',
 *        expires_at : {
 *            date: '2015-10-04 18:19:18',
 *            timezone: 'UTC',
 *            timezone_type: 3
 *        }
 *    }
 * }
 *
 *
 *
  * @apiSuccessExample {json} Response-Example (correct answer sent):
 * {
 *    success: true,
 *    squidle: {
 *        prize: {
 *            text: {
 *                value: 'When everyone in the office has a cough'
 *            },
 *            video: {
 *                value: 'https://youtu.be/IVFHyZSXKMw'
 *            }
 *        },
 *        short: 'Nj0VE8f'
 *    }
 * }
 */















/**
 * @api {post} squidles/:id?_method=put Update squidle
 * @apiName PutSquidle
 * @apiGroup Squidles
 *
 *@apiParam {String} id Unique ID of the Squidle.
 *

 *     @apiParam (JSON data) {Object} squidle Wrapper object for the request data
 *     @apiParam (JSON data) {Object} squidle.answer Answer data
 *         @apiParam (JSON data) {Object} squidle.answer.text Text part of the answer data
 *             @apiParam (JSON data) {String} squidle.answer.text.value Value of the text data
 *             @apiParam (JSON data) {String} squidle.answer.text.hint Placeholders to give hints for the answer
 *             @apiParam (JSON data) {String} squidle.expires_at ISOString date string
 *
 * 
 * @apiParamExample {json} Request-Example (Removing hints):
 * {
 *    squidle: {

 *        answer: {
 *            text: {
 *                value: 'blue',
 *                hint: ''
 *            }
 *        }
 *    }
 * }
 *
  * @apiParamExample {json} Request-Example (Changing expiry):
 * {
 *    squidle: {

 *        expires_at: '2015-10-11T17:37:14.121Z'
 *    }
 * }
  * @apiSuccess {Boolean} success       Specifies that the Squidle was successfully update
  * @apiSuccess {Boolean} success       Specifies that the Squidle was successfully updated
 * @apiSuccess {Object} squidle        Wrapper object for the response data
 *     @apiSuccess {Object}  squidle.challenge      Echo back the challenge data 
 *     @apiSuccess {Object}  squidle.prize          Echo back the prize data 
 *     @apiSuccess {Object}  squidle.answer         Echo back the answer data 
 *     @apiSuccess {String}  squidle.short          Echo back the answer short 
 *     @apiSuccess {String}  squidle.op             Echo back the op
 *     @apiSuccess {Object}  squidle.expires_at     Echo back the expiry
*
 *
 *
  * @apiSuccessExample {json} Response-Example:
 * {
 *    success: true,
 *    squidle: {
 *        challenge: {...
 *        },
 *        prize: {...
 *        },
 *        answer: {...
 *        }
 *        short: 'Nj0VE8f',
 *        op: 'jimmy',
 *        expires_at : {
 *            date: '2015-10-04 18:19:18',
 *            timezone: 'UTC',
 *            timezone_type: 3
 *        }
 *    }
 * }
*/