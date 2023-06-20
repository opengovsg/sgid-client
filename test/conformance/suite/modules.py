modules = {
#    Test Module Name:
#    - oidcc-client-test
#    -----
#    Test Module Description:
#    - The client is expected to make an authentication request (also a token request and a userinfo request where applicable)using the selected response_type and other configuration options.
#    -----
#    Expected Results:  
#    - Pass

   "oidcc-client-test":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-nonce-invalid
#    -----
#    Test Module Description:
#    - The client must identify that the 'nonce' value in the ID Token is invalid and must reject the ID Token. Corresponds to rp-nonce-invalid test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-nonce-invalid":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED"  
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-client-secret-basic
#    -----
#    Test Module Description:
#    - The client MUST use client_secret_basic authentication method regardless of selected client authentication type in test configuration.Corresponds to rp-token_endpoint-client_secret_basic in the old suite.
#    -----
#    Expected Results:  
#    - Fail
#    - Because we do not support client_secret_basic
   "oidcc-client-test-client-secret-basic":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-scope-userinfo-claims
#    -----
#    Test Module Description:
#    - The client is expected to request claims using one of more of the following scope values: profile, email, phone, address. If no access token is issued (when using Implicit Flow with response_type='id_token') the ID Token contains the requested claims. Corresponds to rp-scope-userinfo-claims in the old suite.
#    -----
#    Expected Results:  
#    - Fail
#    - Because we utilize custom scope values
   "oidcc-client-test-scope-userinfo-claims":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED"  
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-kid-absent-single-jwks
#    -----
#    Test Module Description:
#    - Use the single matching key out of the Issuer's published set to verify the ID Tokens signature and accept the ID Token after doing ID Token validation. Corresponds to rp-id_token-kid-absent-single-jwks test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-kid-absent-single-jwks":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-kid-absent-multiple-jwks
#    -----
#    Test Module Description:
#    - This test always uses RS256 signing algorithm. Identify that the 'kid' value is missing from the JOSE header and that the Issuer publishes multiple keys in its JWK Set document (referenced by 'jwks_uri'). The RP can do one of two things; reject the ID Token since it can not by using the kid determined which key to use to verify the signature. Or it can just test all possible keys and hit upon one that works, which it will in this case. Corresponds to rp-id_token-kid-absent-multiple-jwks test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-kid-absent-multiple-jwks":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },


#    Test Module Name:
#    - oidcc-client-test-missing-iat
#    -----
#    Test Module Description:
#    - The client must identify the missing 'iat' value and reject the ID Token after doing ID Token validation. Corresponds to rp-id_token-iat test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-missing-iat":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-missing-aud
#    -----
#    Test Module Description:
#    - The client must identify that the 'aud' value is missing and reject the ID Token after doing ID Token validation. Corresponds to rp-id_token-aud test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-missing-aud":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-invalid-aud
#    -----
#    Test Module Description:
#    - The client must identify that the 'aud' value is incorrect and reject the ID Token after doing ID Token validation. Corresponds to rp-id_token-aud test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-invalid-aud":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-idtoken-sig-none
#    -----
#    Test Module Description:
#    - The client can either accept the unsigned id_token obtained using code flow and send a userinfo request to complete the test or reject the unsigned id_token and stop without sending a userinfo request. If a userinfo request is not received then the test will transition into 'skipped'' state after a timeout. Corresponds to rp-id_token-sig-none test in the old test suite.
#    -----
#    Expected Results:  
#    - Skip
#    - The test is skipped because we do not support unsigned id_tokens and thus no userinfo request is made
   "oidcc-client-test-idtoken-sig-none":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "SKIPPED"
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-idtoken-sig-rs256
#    -----
#    Test Module Description:
#    - The client is expected to accept an id_token signed using RS256. Corresponds to rp-id_token-sig-rs256 test in the old test suite.
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-idtoken-sig-rs256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-missing-sub
#    -----
#    Test Module Description:
#    - The client must identify the missing 'sub' claim and must reject the ID Token. Corresponds to rp-id_token-sub test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-missing-sub":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-invalid-sig-rs256
#    -----
#    Test Module Description:
#    - The client must identify the invalid signature and reject the ID Token after doing ID Token validation. The client may skip this validation if the id token was received from the token endpoint as per https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation. Corresponds to rp-id_token-bad-sig-rs256 test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-invalid-sig-rs256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-invalid-iss
#    -----
#    Test Module Description:
#    - The client must identify that the 'iss' value is incorrect and reject the ID Token after doing ID Token validation. Corresponds to rp-id_token-issuer-mismatch test in the old test suite
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-invalid-iss":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



#    Test Module Name:
#    - oidcc-client-test-userinfo-invalid-sub
#    -----
#    Test Module Description:
#    - The client is expected to make a userinfo request and verify the 'sub' value of the UserInfo Response by comparing it with the ID Token's 'sub' value. The client must identify the invalid 'sub' value and reject the UserInfo Response. Corresponds to rp-userinfo-bad-sub-claim test in the old suite.
#    -----
#    Expected Results:  
#    - Pass
#    - This test is weird because we are not sure how the server recognizes that we reject the userinfo response
   "oidcc-client-test-userinfo-invalid-sub":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },




#    Test Module Name:
#    - oidcc-client-test-userinfo-bearer-header
#    -----
#    Test Module Description:
#    - The client is expected to Pass the access token using the 'Bearer' authentication scheme while doing the UserInfo Request. Corresponds to rp-userinfo-bearer-header test in the old suite.
#    -----
#    Expected Results:  
#    - Pass
   "oidcc-client-test-userinfo-bearer-header":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



   # Test Module Name:
   # - oidcc-client-test-userinfo-bearer-body
   # -----
   # Test Module Description:
   # - The client is expected to pass the access token as form-encoded body parameter while doing the UserInfo Request. Corresponds to rp-userinfo-bearer-body test in the old suite.
   # -----
   # Expected Results:  
   # - Fail
   # - Because we only use authorization header to pass access token
   "oidcc-client-test-userinfo-bearer-body":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED"  
      ]
   },



   # Test Module Name:
   # - oidcc-client-test-invalid-sig-hs256
   # -----
   # Test Module Description:
   # - The client must identify the invalid signature and reject the ID Token after doing ID Token validation. The client may skip this validation if the id token was received from the token endpoint as per https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation. Corresponds to rp-id_token-bad-sig-hs256 test in the old test suite
   # -----
   # Expected Results:  
   # - Pass
   "oidcc-client-test-invalid-sig-hs256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



   # Test Module Name:
   # - oidcc-client-test-invalid-sig-es256
   # -----
   # Test Module Description:
   # - The client must identify the invalid signature and reject the ID Token after doing ID Token validation. The client may skip this validation if the id token was received from the token endpoint as per https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation. Corresponds to rp-id_token-bad-sig-es256 test in the old test suite
   # -----
   # Expected Results:  
   # - Pass
   "oidcc-client-test-invalid-sig-es256":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },

   # NOTE: Commented out as we do not use aggregated nor distributed claims
   # Test Module Name:
   # - oidcc-client-test-aggregated-claims
   # -----
   # Test Module Description:
   # - The client is expected to make an authentication request (also a token request where applicable) and a userinfo request using the selected response_type and other configuration options and process a userinfo response or id_token with aggregated claims.(This test supports only address and phone_number claims, and always returns them regardless of requested scopes)
   # -----
   # Expected Results:  
   # - Pass
   # "oidcc-client-test-aggregated-claims":{
   #    "status":[
   #       "FINISHED"
   #    ],
   #    "result":[
   #       "PASSED" 
   #    ]
   # },



   # NOTE: Commented out as we do not use aggregated nor distributed claims
   # Test Module Name:
   # - oidcc-client-test-distributed-claims
   # -----
   # Test Module Description:
   # - The client is expected to make an authentication request (also a token request where applicable) and a userinfo request using the selected response_type and other configuration options and process a userinfo response with distributed claims and send a request to the claims_endpoint to retrieve the claims. (This test supports a 'credit_score' distributed claim and always returns the same response regardless of requested scopes)
   # -----
   # Expected Results:  
   # - Fail
   # "oidcc-client-test-distributed-claims":{
   #    "status":[
   #       "WAITING"
   #    ],
   #    "result":[
   #       None
   #    ]
   # },



   # NOTE: Commented out as we do not retrieve openid-config from discovery endpoints
   # Test Module Name:
   # - oidcc-client-test-discovery-openid-config
   # -----
   # Test Module Description:
   # - The client is expected to retrieve and use the OpenID Provider Configuration Information.Corresponds to rp-discovery-openid-configuration test in the old test suite.
   # -----
   # Expected Results:  
   # - Pass
   # - Weird that it passes as we do not retrieve the openid-config from discovery endpoints
   # "oidcc-client-test-discovery-openid-config":{
   #    "status":[
   #       "FINISHED"
   #    ],
   #    "result":[
   #       "PASSED" 
   #    ]
   # },



   # Test Module Name:
   # - oidcc-client-test-discovery-jwks-uri-keys
   # -----
   # Test Module Description:
   # - The client is expected to retrieve OpenID Provider Configuration Information and send a request to jwks_uri obtained from OP configuration.The jwks_uri endpoint changes every execution and retrieving the configuration is a requirement.Corresponds to rp-discovery-jwks_uri-keys test in the old test suite.
   # -----
   # Expected Results:  
   # - Fail
   # - Expected as the SDK hardcodes the JWKs URI
   "oidcc-client-test-discovery-jwks-uri-keys":{
      "status":[
         "FINISHED","INTERRUPTED"
      ],
      "result":[
         "FAILED" 
      ]
   },



   # Test Module Name:
   # - oidcc-client-test-discovery-issuer-mismatch
   # -----
   # Test Module Description:
   # - The client is expected to retrieve OpenID Provider Configuration Information from the .well-known/openid-configuration endpoint and detect that the issuer in the provider configuration does not match the one returned by WebFinger.Corresponds to rp-discovery-issuer-not-matching-config test in the old test suite.
   # -----
   # Expected Results:  
   # - Fail
   # - Expected as we do not use Webfinger
   "oidcc-client-test-discovery-issuer-mismatch":{
      "status":[
         "FINISHED",
         "INTERRUPTED"
      ],
      "result":[
         "FAILED" 
      ]
   },




   # Test Module Name:
   # - oidcc-client-test-signing-key-rotation-just-before-signing
   # -----
   # Test Module Description:
   # - The client is expected to request an ID token and verify its signature by fetching keys from the jwks endpoint. Keys will be rotated right before signing the id_token so the client needs to refetch the jwks to validate the signature.Corresponds to rp-key-rotation-op-sign-key-native test in the old test suite.
   # -----
   # Expected Results:  
   # - Pass
   "oidcc-client-test-signing-key-rotation-just-before-signing":{
       "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   },



   # NOTE: Commented out as this test is not supported with the way the script is currently run (needs to be run twice)
   # Test Module Name:
   # - oidcc-client-test-signing-key-rotation
   # -----
   # Test Module Description:
   # - The client is expected to request an ID token and verify its signature by fetching keys from the jwks endpoint. Then make a new authentication request and retrieve another ID Token and verify its signature. Keys will be rotated after the first ID token is issued so the client needs to refetch the jwks to validate the second ID token.Corresponds to rp-key-rotation-op-sign-key test in the old test suite.
   # -----
   # Expected Results:  
   # - Fail
   # "oidcc-client-test-signing-key-rotation":{
   #    "status":[
   #       "FINISHED"
   #    ],
   #    "result":[
   #       "PASSED" 
   #    ]
   # },

   # NOTE: Commented out as we do not use webfinger
   # Test Module Name:
   # - oidcc-client-test-discovery-webfinger-acct
   # -----
   # Test Module Description:
   # - The client is expected to use WebFinger (RFC7033) and OpenID Provider Issuer Discovery to determine the location of the OpenID Provider configuration and send a request to the .well-known/openid-configuration endpoint. The discovery should be done using acct URI syntax as user input identifier. Note that the acct value must adhere to the pattern 'acct:YOUR_TEST_ALIAS.oidcc-client-test-discovery-webfinger-acct@HOST' (HOST should be the hostname:port for the suite but it's not validated by the suite).Corresponds to rp-discovery-webfinger-acct test in the old test suite.
   # -----
   # Expected Results:  
   # - Fail
   # "oidcc-client-test-discovery-webfinger-acct":{
   #    "status":[
   #       "WAITING",
   #    ],
   #    "result":[
   #        None
   #    ]
   # },



   # NOTE: Commented out as we do not use webfinger
   # Test Module Name:
   # - oidcc-client-test-discovery-webfinger-url
   # -----
   # Test Module Description:
   # - The client is expected to use WebFinger (RFC7033) and OpenID Provider Issuer Discovery to determine the location of the OpenID Provider configuration and send a request to the .well-known/openid-configuration endpoint. The discovery should be done using URL syntax as user input identifier. The resource URI MUST have the following value: 'https://HOST/YOUR_TEST_ALIAS/oidcc-client-test-discovery-webfinger-url' (HOST should be the hostname:port for the suite).Corresponds to rp-discovery-webfinger-url test in the old test suite.
   # -----
   # Expected Results:  
   # - Fail
   # "oidcc-client-test-discovery-webfinger-url":{
   #    "status":[
   #       "WAITING",
   #    ],
   #    "result":[
   #        None
   #    ]
   # },



   # Test Module Name:
   # - oidcc-client-test-userinfo-signed
   # -----
   # Test Module Description:
   # - The client is expected to make an authentication request (also a token request where applicable) and a userinfo request using the selected response_type and other configuration options and userinfo_signed_response_alg RS256.
   # -----
   # Expected Results:  
   # - Pass
   "oidcc-client-test-userinfo-signed":{
      "status":[
         "FINISHED"
      ],
      "result":[
         "PASSED" 
      ]
   }
}

