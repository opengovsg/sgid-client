# Conformance tests for sgID TypeScript SDK

OpenID Foundation provides an open-sourced [suite of conformance tests](https://www.certification.openid.net) for relying parties (RPs) and identity providers (IDPs) to verify that their implementation conforms to the standards laid out in the OIDC RFC.

To ensure that our SDKs conform to the OIDC standards, we will use a demo app that utilizes our SDK to act as an RP against the conformance tests.

## Instructions to run the tests

### Setting up the environment for the tests

Before you can run the tests, you will need to:

1. Build the sgID SDK
   - Run `npm run build` in the root directory (i.e. `/sgid-client`)
2. Install the demo app's dependencies
   - Run `cd test/conformance/demo-rp` to move to the `demo-rp` directory
   - Run `npm i` to install the dependencies
3. Clone the conformance test suite
   - Run `cd ..` to return to the `conformance` directory
   - Run `git clone https://github.com/opengovsg/sgid-client-conformance-suite.git` to clone the conformance suite
4. Setup the conformance suite environment
   - Run `cd sgid-client-conformance-suite` to move to the `sgid-client-conformance-suite` directory
   - Run
     ```
     python3 -m venv .venv
     ```
     to setup a Python virtual env
   - Run `source .venv/bin/activate` to activate your Python venv
   - Run `pip install -r requirements.txt` to install the requirements
   - Run `cat .env.example > .env` and replace the `CONFORMANCE_TOKEN` with your [conformance testing permanent token](https://www.certification.openid.net/tokens.html) to setup your environment variables
5. Additional notes
   - Please ensure that the value of `test_plan_config.alias` in `test/conformance/suite/test.py` is the same as the last path parameter in `hostname` in `test/conformance/demo-rp/src/lib/sgidClient.ts` (e.g. `sgid-sdk-conformance-test`)

### Running the tests

1. In the `test/conformance/demo-rp` directory, run `npm run dev`
2. In a new terminal in the `test/conformance/sgid-client-conformance-suite` directory
   - If you have not activate your Python venv, run `source .venv/bin/activate`
   - Run `python test.py`
3. Observe the results in the terminal
