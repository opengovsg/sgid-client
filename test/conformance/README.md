# Conformance Tests

## Running the tests

To run the tests

1. Run `npm run build` in the root directory to build the SDK
1. cd into the `test/conformance/demo-rp` directory, install the dependencies with `npm i`, and run it with `npm run dev`
1. In a new terminal, cd into the `test/conformance/suite` directory, setup a Python virtual env with

```
python3 -m venv .venv
source .venv/bin/activate
```

Set up the environment variables with

```
cat .env.example > .env
```

and replace the `CONFORMANCE_TOKEN` with your permanent token generated from https://www.certification.openid.net/tokens.html

Install the requirements with `pip install -r requirements.txt`

Run the test suite with `python test.py`

1. Observe the results in the terminal
