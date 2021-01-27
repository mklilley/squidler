
'use strict';

exports.supportCreate = {
  name:                   'supportCreate',
  description:            'I send a support email to Squidler support team (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
      message:{
          required:true,
          validator: ['api.validator.string']
      },
      name:{
          required:true,
          validator:['api.validator.string']
      },
      email:{
          required:true,
          validator: ['api.validator.email'],
          formatter: ['api.formatter.removeWhiteSpace','api.formatter.lowercase']
      }
  },


  run: function(api, data, next) {

      // The design pattern is to go to a controller from here, but it feels a bit overkill when we just want to get a task going.
      api.tasks.enqueue("sendSupportEmail", {email: data.params.email, name: data.params.name, message: data.params.message}, 'default',(error,toRun)=>{
          if(error){
              next(new SqdError({message:"Problem sending your message",code:500}));
          }
          else{
              data.response.success = true;
              next();
          }
      });



  }
};
