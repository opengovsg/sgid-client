#!/usr/bin/env python3

import asyncio
import json
import os

from conformance import Conformance
from dotenv import load_dotenv
from modules import modules

load_dotenv()

CONFORMANCE_SERVER = "https://www.certification.openid.net/"
CONFORMANCE_TOKEN = os.environ["CONFORMANCE_TOKEN"]

# This is the name of the the test plan:
test_plan_name = "oidcc-client-test-plan"

# This is the variant configuration of the test:
test_variant_config = {
    "client_auth_type": 'client_secret_post',
    "request_type": 'plain_http_request',
    "response_type": 'code',
    "client_registration": 'static_client',
    "response_mode": 'default'
}

# This is the required configuration for the test run:
test_plan_config = {
    "consent": {},
    "alias": 'sgid-sdk-test',
    "description": 'OIDC Conformance Testing for sgID SDKs',
    "client": {
        "client_id": 'sgid-conformance-test',
        "client_secret": 'sgid-conformance-test-secret-that-should-be-at-least-256-bits-long',
        "redirect_uri": 'http://localhost:3000/api/callback',
    },
}

# Create a Conformance instance...
print("Starting the Conformance tests...\n")
conformance = Conformance(CONFORMANCE_SERVER, CONFORMANCE_TOKEN, verify_ssl=True)

# Create a test plan instance and print the id of it
test_plan = asyncio.run(conformance.create_test_plan(test_plan_name, json.dumps(test_plan_config), test_variant_config))
plan_id = test_plan['id']
print('Plan URL: {}plan-detail.html?plan={}\n'.format(CONFORMANCE_SERVER, plan_id))

passed_modules = []
failed_modules = []

for module_name in modules.keys():

    # Finding the test module index based on the name of the module_name
    module_idx = list(map(lambda test: test['testModule'], test_plan['modules'])).index(module_name)

    # Executing test modules
    test = test_plan['modules'][module_idx]   # Get the test module,
    variant = test["variant"]        # and the variant/configuration

    # Conformance.create_test_from_plan_with_variant is an async function,
    # but in this script we're running the tests synchronously so
    # we perform the test execution in an asyncio sync wrapper
    module_instance = asyncio.run(conformance.create_test_from_plan_with_variant(plan_id, module_name, variant))
    module_id = module_instance['id']
    print('[id: {}] Starting test module: {} (Test URL: {}log-detail.html?log={})'.format(module_id, module_name, CONFORMANCE_SERVER, module_id))

    # Run the test and wait for it to finish
    try:
        state, result = asyncio.run(conformance.wait_for_state(module_id, modules[module_name]['status']))
    except Exception as e:
        failed_modules.append(module_name)
        print('[id: {}] Test module {} failed with message {} and did not complete\n'.format(module_id, module_name, e))

    if result not in modules[module_name]['result']:
        failed_modules.append(module_name)
        print('[id: {}] Test module {} complete with non-matching results! (State: {}; Result: {}; Expected results: {})\n'.format(module_id, module_name, state, result, modules[module_name]['result']))
    else:
        passed_modules.append(module_name)
        print('[id: {}] Test module {} complete with matching results! (State: {}; Result: {}; Expected results: {})\n'.format(module_id, module_name, state, result, modules[module_name]['result']))

print('Conformance suite has been completed successfully!\n')
print('Passed modules: {} / {}  \n{}'.format(len(passed_modules), len(modules.keys()), passed_modules))
print('Failed modules: {} / {}  \n{}'.format(len(failed_modules), len(modules.keys()), failed_modules))