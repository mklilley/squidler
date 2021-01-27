define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p> "
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/docs/main.js",
    "group": "C__Users_Matthew_Documents_lvl8_sqd_app_dev_BACKEND_DOCS_docs_main_js",
    "groupTitle": "C__Users_Matthew_Documents_lvl8_sqd_app_dev_BACKEND_DOCS_docs_main_js",
    "name": ""
  },
  {
    "type": "post",
    "url": "files",
    "title": "Upload an image",
    "name": "PostFile",
    "group": "Files",
    "parameter": {
      "fields": {
        "Form data": [
          {
            "group": "Form data",
            "type": "<p>Blob</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>Blob representation of a jpeg image</p> "
          }
        ]
      }
    },
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  'Content-Type': undefined\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the request was successful.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "file.url",
            "description": "<p>Location of uploaded image on the squidler server</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n  sucess: true,\n  file: {\n        url: 'http://squidler.com/api/v1/files/jrE9PktiPS0f3JoDcWoiXc.jpeg'\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/files.js",
    "groupTitle": "Files"
  },
  {
    "type": "get",
    "url": "history/:username",
    "title": "Read squidles history",
    "name": "GetHistory",
    "group": "History",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the history was successfully read</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "history",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "history.shorts",
            "description": "<p>Array of shortlinks/ids for the squidles in the history</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "history.actions",
            "description": "<p>Array showing whether the user sent the corresponding squidle, or received it</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n   success: true,\n   history: {\n       shorts: ['TEUjKoo', 'Pfz8Fd4'],\n       actions: ['sent', 'received']\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/history.js",
    "groupTitle": "History"
  },
  {
    "type": "get",
    "url": "profiles/:username",
    "title": "Read profile",
    "name": "GetProfile",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the profile was successfully read</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "profile",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.avatar",
            "description": "<p>Url of the users avatar</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.bio",
            "description": "<p>Biography of the user</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.github_username",
            "description": "<p>Github username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.google_plus_username",
            "description": "<p>Google+ username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.twitter_username",
            "description": "<p>Twitter username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.first_name",
            "description": "<p>First name</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.last_name",
            "description": "<p>Last name</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.location",
            "description": "<p>User location</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n   success: true,\n   profile: {\n       avatar: \"http://squidler.com/api/v1/files/0kSEiGRHCOfzg1PAc0TEZX.jpeg\",\n       bio: \"I'm not your typical squid.\",\n       github_username: jb,\n       google_plus_username: jbplus,\n       twitter_username: @jo_blogs,\n       first_name: Jo,\n       last_name: Blogs,\n       location: \"under the sea\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/profiles.js",
    "groupTitle": "Profile"
  },
  {
    "type": "post",
    "url": "squidles/:username?_method=put",
    "title": "Update profile",
    "name": "PutProfile",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p> "
          }
        ],
        "JSON data": [
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "profile",
            "description": "<p>Wrapper object for the request data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.avatar",
            "description": "<p>Url of the users avatar</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.bio",
            "description": "<p>Biography of the user</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.github_username",
            "description": "<p>Github username</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.google_plus_username",
            "description": "<p>Google+ username</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.twitter_username",
            "description": "<p>Twitter username</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.first_name",
            "description": "<p>First name</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.last_name",
            "description": "<p>Last name</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.location",
            "description": "<p>User location</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   profile: {\n       avatar: \"http://squidler.com/api/v1/files/MLxXEWHjFErf17feoM78HE.jpeg\",\n       bio: \"This is the brand new me!\",\n   }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the profile was successfully read</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "profile",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.avatar",
            "description": "<p>Url of the users avatar</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.bio",
            "description": "<p>Biography of the user</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.github_username",
            "description": "<p>Github username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.google_plus_username",
            "description": "<p>Google+ username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.twitter_username",
            "description": "<p>Twitter username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.first_name",
            "description": "<p>First name</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.last_name",
            "description": "<p>Last name</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "profile.location",
            "description": "<p>User location</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n   success: true,\n   profile: {\n       avatar: \"http://squidler.com/api/v1/files/MLxXEWHjFErf17feoM78HE.jpeg\",\n       bio: \"This is the brand new me!\",\n       github_username: jb,\n       google_plus_username: jbplus,\n       twitter_username: @jo_blogs,\n       first_name: Jo,\n       last_name: Blogs,\n       location: \"under the sea\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "description": "<p>Update part of all of the users profile by sending some JSON data with keys of the items to be updated.  The full profile is echoed back upon successful update</p> ",
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/profiles.js",
    "groupTitle": "Profile"
  },
  {
    "type": "get",
    "url": "squidles/:id",
    "title": "Read squidle",
    "name": "GetSquidle",
    "group": "Squidles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Unique ID of the Squidle.</p> "
          }
        ],
        "Query parameter (optional)": [
          {
            "group": "Query parameter (optional)",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "answer",
            "description": "<p>Guess the answer to the Squidle</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the Squidle was successfully read</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge",
            "description": "<p>Challenge data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge.text",
            "description": "<p>Text part of the challenge data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.challenge.text.value",
            "description": "<p>Value of the text data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge.photo",
            "description": "<p>Photo part of the challenge data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.challenge.photo.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "squidle.challenge.photo.uploaded",
            "description": "<p>Shows whether the photo is located on the Squidler servers</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge.video",
            "description": "<p>Video part of the challenge data (CANNOT HAVE BOTH VIDEO AND PHOTO)</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.challenge.video.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize",
            "description": "<p>Prize data (ONLY RETURNED IF ANSWER PARMATER IS SENT AND CORRECT)</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize.text",
            "description": "<p>Text part of the prize data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.prize.text.value",
            "description": "<p>Value of the text data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize.photo",
            "description": "<p>Photo part of the prize data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.prize.photo.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "squidle.prize.photo.uploaded",
            "description": "<p>Shows whether the photo is located on the Squidler servers</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize.video",
            "description": "<p>Video part of the challenge data (CANNOT HAVE BOTH VIDEO AND PHOTO)</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.prize.video.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer",
            "description": "<p>Answer data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer.text",
            "description": "<p>Text part of the answer data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.answer.text.hint",
            "description": "<p>Placeholders to give hints for the answer</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.short",
            "description": "<p>Id that uniquely identifies the Squidle</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.op",
            "description": "<p>Username of the account that created the Squidle</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.expires_at",
            "description": "<p>Date and time that the Squidle will expire</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.expires_at.date",
            "description": "<p>Date and time</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.expires_at.timezone",
            "description": "<p>Time zone where the squidle was created</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Integer</p> ",
            "optional": false,
            "field": "squidle.expires_at.timezone_type",
            "description": "<p>NOT SURE WHAT THIS IS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example (no answer):",
          "content": "{\n   success: true,\n   squidle: {\n       challenge: {\n           text: {\n               value: 'What is my favourite colour'\n           },\n           photo: {\n               value: 'http://www.ccwater.org.uk/wp-content/uploads/2014/09/blue_wave_of_water.jpg',\n               uploaded: false\n           }\n       },\n       answer: {\n           text: {\n               hint: '••••'\n           }\n       },\n       short: 'Nj0VE8f',\n       op: 'jimmy',\n       expires_at : {\n           date: '2015-10-04 18:19:18',\n           timezone: 'UTC',\n           timezone_type: 3\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Response-Example (correct answer sent):",
          "content": "{\n   success: true,\n   squidle: {\n       prize: {\n           text: {\n               value: 'When everyone in the office has a cough'\n           },\n           video: {\n               value: 'https://youtu.be/IVFHyZSXKMw'\n           }\n       },\n       short: 'Nj0VE8f'\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/squidles.js",
    "groupTitle": "Squidles"
  },
  {
    "type": "post",
    "url": "squidles",
    "title": "Create squidle",
    "name": "PostSquidle",
    "group": "Squidles",
    "parameter": {
      "fields": {
        "JSON data": [
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle",
            "description": "<p>Wrapper object for the request data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge",
            "description": "<p>Challenge data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge.text",
            "description": "<p>Text part of the challenge data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.challenge.text.value",
            "description": "<p>Value of the text data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge.photo",
            "description": "<p>Photo part of the challenge data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.challenge.photo.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "squidle.challenge.photo.uploaded",
            "description": "<p>Shows whether the photo is located on the Squidler servers</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge.video",
            "description": "<p>Video part of the challenge data (CANNOT HAVE BOTH VIDEO AND PHOTO)</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.challenge.video.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize",
            "description": "<p>Prize data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize.text",
            "description": "<p>Text part of the prize data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.prize.text.value",
            "description": "<p>Value of the text data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize.photo",
            "description": "<p>Photo part of the prize data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.prize.photo.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "squidle.prize.photo.uploaded",
            "description": "<p>Shows whether the photo is located on the Squidler servers</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize.video",
            "description": "<p>Video part of the prize data (CANNOT HAVE BOTH VIDEO AND PHOTO)</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.prize.video.value",
            "description": "<p>Url of the photo</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer",
            "description": "<p>Answer data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer.text",
            "description": "<p>Text part of the answer data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.answer.text.value",
            "description": "<p>Value of the text data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.answer.text.hint",
            "description": "<p>Placeholders to give hints for the answer</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   squidle: {\n       challenge: {\n           text: {\n               value: 'What is my favourite colour'\n           },\n           photo: {\n               value: 'http://www.ccwater.org.uk/wp-content/uploads/2014/09/blue_wave_of_water.jpg',\n               uploaded: false\n           }\n       },\n       prize: {\n           text: {\n               value: 'When everyone in the office has a cough'\n           },\n           video: {\n               value: 'https://youtu.be/IVFHyZSXKMw'\n           }\n       },\n       answer: {\n           text: {\n               value: 'blue',\n               hint: '••••'\n           }\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the Squidle was successfully created</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge",
            "description": "<p>Echo back the challenge data that was sent in the request</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize",
            "description": "<p>Echo back the prize data that was sent in the request</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer",
            "description": "<p>Echo back the answer data that was sent in the request</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.short",
            "description": "<p>Id that uniquely identifies the Squidle</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.op",
            "description": "<p>Username of the account that created the Squidle</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.expires_at",
            "description": "<p>Date and time that the Squidle will expire</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.expires_at.date",
            "description": "<p>Date and time</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.expires_at.timezone",
            "description": "<p>Time zone where the squidle was created</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Integer</p> ",
            "optional": false,
            "field": "squidle.expires_at.timezone_type",
            "description": "<p>NOT SURE WHAT THIS IS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n   success: true,\n   squidle: {\n       challenge: {...\n       },\n       prize: {...\n       },\n       answer: {...\n       }\n       short: 'Nj0VE8f',\n       op: 'jimmy',\n       expires_at : {\n           date: '2015-10-04 18:19:18',\n           timezone: 'UTC',\n           timezone_type: 3\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/squidles.js",
    "groupTitle": "Squidles"
  },
  {
    "type": "post",
    "url": "squidles/:id?_method=put",
    "title": "Update squidle",
    "name": "PutSquidle",
    "group": "Squidles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Unique ID of the Squidle.</p> "
          }
        ],
        "JSON data": [
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle",
            "description": "<p>Wrapper object for the request data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer",
            "description": "<p>Answer data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer.text",
            "description": "<p>Text part of the answer data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.answer.text.value",
            "description": "<p>Value of the text data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.answer.text.hint",
            "description": "<p>Placeholders to give hints for the answer</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.expires_at",
            "description": "<p>ISOString date string</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example (Removing hints):",
          "content": "{\n   squidle: {\n       answer: {\n           text: {\n               value: 'blue',\n               hint: ''\n           }\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Request-Example (Changing expiry):",
          "content": "{\n   squidle: {\n       expires_at: '2015-10-11T17:37:14.121Z'\n   }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the Squidle was successfully update</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.challenge",
            "description": "<p>Echo back the challenge data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.prize",
            "description": "<p>Echo back the prize data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.answer",
            "description": "<p>Echo back the answer data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.short",
            "description": "<p>Echo back the answer short</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "squidle.op",
            "description": "<p>Echo back the op</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "squidle.expires_at",
            "description": "<p>Echo back the expiry</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n   success: true,\n   squidle: {\n       challenge: {...\n       },\n       prize: {...\n       },\n       answer: {...\n       }\n       short: 'Nj0VE8f',\n       op: 'jimmy',\n       expires_at : {\n           date: '2015-10-04 18:19:18',\n           timezone: 'UTC',\n           timezone_type: 3\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/squidles.js",
    "groupTitle": "Squidles"
  },
  {
    "type": "post",
    "url": "support/question",
    "title": "Send support email",
    "name": "PostSupport",
    "group": "Support",
    "parameter": {
      "fields": {
        "JSON data": [
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Wrapper object for the request data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email.name",
            "description": "<p>Name</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email.email",
            "description": "<p>Email address</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email.message",
            "description": "<p>Content of the email</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    email: {\n        name: 'Jo',\n        email: 'jo@blogs.com',\n        message: 'I need help!'\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the request was successful.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email.message",
            "description": "<p>Text response from the server</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n  sucess: true,\n  email: {\n        message: 'The support team will be back to you ASAP.'\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/support.js",
    "groupTitle": "Support"
  },
  {
    "type": "get",
    "url": "users/:username",
    "title": "Read user account info",
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the user account info was successfully read</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.username",
            "description": "<p>Username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.email",
            "description": "<p>Email address of the user</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Integer</p> ",
            "optional": false,
            "field": "user.verified",
            "description": "<p>IS the user verified (=1) or not (=0)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n   success: true,\n   user: {\n       username: 'joblogs' \n       email: 'jo@blogs.com',\n       verified: 1\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "users",
    "title": "Create user",
    "name": "PostUser",
    "group": "User",
    "parameter": {
      "fields": {
        "JSON data": [
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>Wrapper object for the request data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.username",
            "description": "<p>Username</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.email",
            "description": "<p>Email address</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.password",
            "description": "<p>Password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    user: {\n        username: 'joblogs',\n        email: 'jo@blogs.com',\n        password: 'secret'\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the request was successful.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.username",
            "description": "<p>Username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.email",
            "description": "<p>jo@blogs.com</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n  sucess: true,\n  user: {\n        username: 'joblogs',\n        email: 'jo@blogs.com'\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "users/:username?_method=put",
    "title": "Update user account info",
    "name": "PutUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p> "
          }
        ],
        "JSON data": [
          {
            "group": "JSON data",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>Wrapper object for the request data</p> "
          },
          {
            "group": "JSON data",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.email",
            "description": "<p>Email address</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    user: {\n        email: 'jo@blogs.com',\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Specifies that the request was successful.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>Wrapper object for the response data</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.username",
            "description": "<p>Username</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user.email",
            "description": "<p>jo@blogs.com</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example:",
          "content": "{\n  sucess: true,\n  user: {\n        username: 'joblogs',\n        email: 'jo@blogs.com'\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "BACKEND_DOCS/users.js",
    "groupTitle": "User"
  }
] });