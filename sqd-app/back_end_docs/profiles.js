/**
 * @api {get} profiles/:username Read profile
 * @apiName GetProfile
 * @apiGroup Profile
 *
 * @apiParam {String} username Username
 *
 * @apiSuccess {Boolean} success       Specifies that the profile was successfully read
 * @apiSuccess {Object} profile Wrapper object for the response data
 * @apiSuccess {String} profile.avatar Url of the users avatar
  * @apiSuccess {String} profile.bio Biography of the user
  * @apiSuccess {String} profile.github_username Github username
  * @apiSuccess {String} profile.google_plus_username Google+ username
  * @apiSuccess {String} profile.twitter_username Twitter username
  * @apiSuccess {String} profile.first_name First name
  * @apiSuccess {String} profile.last_name Last name
  * @apiSuccess {String} profile.location User location
  *
 * @apiSuccessExample {json} Response-Example:
* {
*    success: true,
*    profile: {
*        avatar: "http://squidler.com/api/v1/files/0kSEiGRHCOfzg1PAc0TEZX.jpeg",
*        bio: "I'm not your typical squid.",
*        github_username: jb,
*        google_plus_username: jbplus,
*        twitter_username: @jo_blogs,
*        first_name: Jo,
*        last_name: Blogs,
*        location: "under the sea"
*    }
* }
 *
 */




/**
 * @api {post} squidles/:username?_method=put Update profile
 * @apiName PutProfile
 * @apiGroup Profile
 *
 * @apiParam {String} username Username
 *

 * @apiParam (JSON data) {Object} profile Wrapper object for the request data
 * @apiParam (JSON data) {String} profile.avatar Url of the users avatar
  * @apiParam (JSON data) {String} profile.bio Biography of the user
  * @apiParam (JSON data) {String} profile.github_username Github username
  * @apiParam (JSON data) {String} profile.google_plus_username Google+ username
  * @apiParam (JSON data) {String} profile.twitter_username Twitter username
  * @apiParam (JSON data) {String} profile.first_name First name
  * @apiParam (JSON data) {String} profile.last_name Last name
  * @apiParam (JSON data) {String} profile.location User location
   * @apiParamExample {json} Request-Example:
* {
*    profile: {
*        avatar: "http://squidler.com/api/v1/files/MLxXEWHjFErf17feoM78HE.jpeg",
*        bio: "This is the brand new me!",
*    }
* }
  *
 *
 * @apiSuccess {Boolean} success       Specifies that the profile was successfully read
 * @apiSuccess {Object} profile Wrapper object for the response data
 * @apiSuccess {String} profile.avatar Url of the users avatar
  * @apiSuccess {String} profile.bio Biography of the user
  * @apiSuccess {String} profile.github_username Github username
  * @apiSuccess {String} profile.google_plus_username Google+ username
  * @apiSuccess {String} profile.twitter_username Twitter username
  * @apiSuccess {String} profile.first_name First name
  * @apiSuccess {String} profile.last_name Last name
  * @apiSuccess {String} profile.location User location
  *
 * @apiSuccessExample {json} Response-Example:
* {
*    success: true,
*    profile: {
*        avatar: "http://squidler.com/api/v1/files/MLxXEWHjFErf17feoM78HE.jpeg",
*        bio: "This is the brand new me!",
*        github_username: jb,
*        google_plus_username: jbplus,
*        twitter_username: @jo_blogs,
*        first_name: Jo,
*        last_name: Blogs,
*        location: "under the sea"
*    }
* }
 * @apiDescription Update part of all of the users profile by sending some JSON data with keys of the items to be updated.  The full profile is echoed back upon successful update
 */

