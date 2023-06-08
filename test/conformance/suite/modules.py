# enum Status {
# 	NOT_YET_CREATED, // object just created, not yet setup
# 	CREATED, // test has been instantiated
# 	CONFIGURED, // configuration files have been sent and set up
# 	RUNNING, // test is executing
# 	WAITING, // test is waiting for external input
# 	INTERRUPTED, // test has been stopped before completion
# 	FINISHED, // test has completed
# }

# enum Result {
# 	PASSED, // test has passed successfully
# 	FAILED, // test has failed
# 	WARNING, // test has warnings
# 	REVIEW, // test requires manual review
# 	SKIPPED, // test can not be completed
# 	UNKNOWN // test results not yet known, probably still running (see status)
# }

# modules = {
#    "oidcc-client-test":{
#       "status":[
#          "FINISHED"
#       ],
#       "result":[
#          "PASSED" 
#       ]
#    },
#    "oidcc-client-test-nonce-invalid":{
#       "status":[
#          "FINISHED"
#       ],
#       "result":[
#          "PASSED"  
#       ]
#    },
#    "oidcc-client-test-client-secret-basic":{
#       "status":[
#          "FINISHED",
#          "INTERRUPTED"
#       ],
#       "result":[
#          "FAILED" 
#       ]
#    },
#    "oidcc-client-test-scope-userinfo-claims":{
#       "status":[
#          "FINISHED",
#          "INTERRUPTED"
#       ],
#       "result":[
#          "FAILED"  
#       ]
#    }
# }

modules = {
   "oidcc-client-test":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-nonce-invalid":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED"  
      ]
   },
   "oidcc-client-test-client-secret-basic":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED" 
      ]
   },
   "oidcc-client-test-scope-userinfo-claims":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED"  
      ]
   },
   "oidcc-client-test-kid-absent-single-jwks":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" # Works when ran first - otherwise fails
      ]
   },
   "oidcc-client-test-kid-absent-multiple-jwks":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-missing-iat":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-missing-aud":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-invalid-aud":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-idtoken-sig-none":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "SKIPPED"
      ]
   },
   "oidcc-client-test-idtoken-sig-rs256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-missing-sub":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-invalid-sig-rs256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-invalid-iss":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-userinfo-invalid-sub":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-userinfo-bearer-header":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-userinfo-bearer-body":{
      "status":[
         "WAITING"
      ],
      "result":[
         None
      ]
   },
   "oidcc-client-test-invalid-sig-hs256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-invalid-sig-es256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   # "oidcc-client-test-aggregated-claims":{
   #    "status":[
   #       "FINISHED"
   #    ],
   #    "result":[
   #       "PASSED" 
   #    ]
   # },
   # "oidcc-client-test-distributed-claims":{
   #    "status":[
   #       "WAITING"
   #    ],
   #    "result":[
   #       None
   #    ]
   # },
   "oidcc-client-test-discovery-openid-config":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },
   "oidcc-client-test-discovery-jwks-uri-keys":{
      "status":[
         "FINISHED","INTERRUPTED"
      ],
      "result":[
         "FAILED" 
      ]
   },
   "oidcc-client-test-discovery-issuer-mismatch":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED" 
      ]
   },
   "oidcc-client-test-signing-key-rotation-just-before-signing":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED" 
      ]
   },
   "oidcc-client-test-signing-key-rotation":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED" # Passes but supposed to fail
      ]
   },
   # "oidcc-client-test-discovery-webfinger-acct":{
   #    "status":[
   #       "WAITING",
   #    ],
   #    "result":[
   #        None
   #    ]
   # },
   # "oidcc-client-test-discovery-webfinger-url":{
   #    "status":[
   #       "WAITING",
   #    ],
   #    "result":[
   #        None
   #    ]
   # },
   "oidcc-client-test-userinfo-signed":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   }
}
