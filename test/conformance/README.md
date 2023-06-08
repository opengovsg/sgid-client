# Conformance tests for sgID SDK

## What is the conformance test suite

OpenID Foundation provides an open-sourced [suite of conformance tests](https://www.certification.openid.net) for relying parties (RPs) and identity providers (IDPs) to verify that their implementation conforms to the standards laid out in the OIDC RFC.

To ensure that our SDKs conform to the OIDC standards, we will use a demo app that utilizes our SDK to act as an RP against the conformance tests.

## How it works

The `demo-rp` directory contains the demo app that will be interacting with the conformance tests.

- This app is based off the Next.js CSR example app under `examples/nextjs-csr`.
- Additionally, this demo app overrides the endpoints to point to the conformance tests instead of the sgID transaction server (the overriding can be found under `test/conformance/demo-rp/src/lib/sgidClient.ts`).

The `suite` directory contains the scripts that interact with the conformance test server to start the test plan and test modules, and interact with the demo app through API calls.

- `test.py` is the main test runner that defines the config of the conformance test plan and runs each test module
- `conformance.py` (modified based off this [tutorial](https://gitlab.com/openid/conformance-suite-automated-testing-tutorial)) is a wrapper over the [API calls](https://www.certification.openid.net/api-document.html) to the conformance test server and also includes the logic to interact with the locally hosted demo app
- `modules.py` specifies the test modules (in the `oidcc-client-test-plan` test plan) to run and their expected final statuses and results

## Setting up the environment for the tests

Before you can run the tests, you will need to:

1. Build the sgID SDK
   - Run `npm run build` in the root directory (i.e. `/sgid-client`)
1. Run the demo app locally
   - Run `cd test/conformance/demo-rp` to move to the `demo-rp` directory
   - Run `npm i` to install the dependencies
1. Run the test runner script
   - Create a new terminal instance
   - Run `cd test/conformance/suite` to move to the `suite` directory
   - Run
     ```
     python3 -m venv .venv
     ```
     to setup a Python virtual env
   - Run `cat .env.example > .env` and repalce the `CONFORMANCE_TOKEN` with your [conformance testing permanent token](https://www.certification.openid.net/tokens.html) to setup your environment variables
   - Run `pip install -r requirements.txt` to install the requirements

## Running the tests

1. In the `test/conformance/demo-rp` directory, run `npm run dev`
1. In a new terminal in the `test/conformance/suite` directory
   - If you have not activate your Python venv, run `source .venv/bin/activate`
   - Run `python test.py`
1. Observe the results in the terminal

## Important points

- Please ensure that the value of `test_plan_config.alias` in `test/conformance/suite/test.py` is the same as the last path parameter in `hostname` in `test/conformance/demo-rp/src/lib/sgidClient.ts` (e.g. `sgid-sdk-test-rayner-2`)

## Understanding the conformance test statuses and results

- These values are taken from the enum values in the [conformance suite repo](https://gitlab.com/openid/conformance-suite)

```
enum Status {
    NOT_YET_CREATED, // object just created, not yet setup
    CREATED, // test has been instantiated
    CONFIGURED, // configuration files have been sent and set up
    RUNNING, // test is executing
    WAITING, // test is waiting for external input
    INTERRUPTED, // test has been stopped before completion
    FINISHED, // test has completed
}

enum Result  {
    PASSED, // test has passed successfully
    FAILED, // test has failed
    WARNING, // test has warnings
    REVIEW, // test requires manual review
    SKIPPED, // test can not be completed
    UNKNOWN // test results not yet known, probably still running (see status)
}
```
