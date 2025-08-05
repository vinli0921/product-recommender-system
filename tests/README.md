
# Integration Tests

This directory contains integration tests for the Product Recommender application.

## Quick Start

### 1. Start the Recommender Manually

First, start the recommender. Follow the [README](../README.md) installation instructions.
Make sure that the routes are exposed and working:
```bash
$ oc get routes
...
feast-feast-rec-sys-ui                feast-feast-rec-sys-ui-<namespace>.apps.ai-dev02.kni.syseng.devcluster.openshift.com                       feast-feast-rec-sys-ui               8443           reencrypt/Redirect   None
product-recommender-system-frontend   product-recommender-system-frontend-<namespace>.apps.ai-dev02.kni.syseng.devcluster.openshift.com          product-recommender-system-backend   http           edge/Redirect        None
```

### 2. Run Tests

Once the application is running:

```bash
cd tests/integration

# Run all integration tests
./run_integration_tests.sh

# Run a specific test file
./run_integration_tests.sh tests/integration/test_endpoints.tavern.yaml
```


## How to Add an Integration Test

1. Create a new `.tavern.yaml` file in the `tests/integration/` directory. You can copy an existing test file as a template.
2. Define your test cases using the Tavern YAML format. Specify the HTTP requests, expected responses, and any variables needed.
3. Save the file with a descriptive name, e.g., `test_new_feature.tavern.yaml`.
4. Run your new test using:
   ```bash
   ./run_integration_tests.sh tests/integration/test_new_feature.tavern.yaml
   ```
5. Review the output to ensure your test passes.

## How to Use a Python Script for Integration Tests

You can also write integration tests as Python scripts using `pytest`.

1. Create a new function in [test_helpers.py](integration/tests_helpers.py).
2. Write your test functions using the standard `pytest` format:
   ```python
   import requests

   def your_fucntion(response, extra_args):
       assert ...
   ```
3. At the `.tavern/yaml` add
    ```yaml
    verify_response_with:
        function: tests_helpers:validate_product_list
        extra_kwargs:
    ```
