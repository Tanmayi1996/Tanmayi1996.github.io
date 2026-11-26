# API Documentation Toolkit

The API Documentation Toolkit demonstrates an API-first documentation workflow for a fictional task-management service. It pairs an OpenAPI 3.1 contract with a reader-facing API guide and a lightweight validation script.

The API hostname and data are examples. The contract does not describe a live service.

## Explore the project

Open the [source repository](https://github.com/Tanmayi1996/tanmayi-portfolio/tree/main/api-documentation-toolkit).

The project contains:

| File | Purpose |
|---|---|
| <code>specs/openapi.yaml</code> | Describes endpoints, operations, schemas, parameters, examples, and responses. |
| <code>API_GUIDE.md</code> | Explains the API from a developer's point of view, with examples and error guidance. |
| <code>validate_spec.py</code> | Checks for a small set of required contract markers. |

## Review the API contract

The OpenAPI document declares the API title and version, base server URL, task operations for listing, creating, and retrieving tasks, query and path parameters, request and response schemas, example payloads, and common response codes.

The task schema uses a required title and optional description. A returned task includes an ID and status.

## Run the structural check

From the project directory, run:

~~~bash
python validate_spec.py
~~~

The script checks that the file contains the expected OpenAPI 3.1 declaration, <code>info</code>, <code>paths</code>, and <code>components</code> markers, the sample server URL, and at least one <code>operationId</code>.

A successful check confirms only those structural markers. It does not prove that the YAML parses, that every reference resolves, or that the contract conforms to the full OpenAPI 3.1 specification.

## Read the API guide

The reader-facing guide describes the base URL, authentication considerations, endpoint behavior, example requests, and error handling. It complements the machine-readable contract rather than duplicating every schema detail.

## Validation for a production workflow

For a production API documentation pipeline, add a dedicated OpenAPI 3.1 validator and run it in continuous integration. Also test example requests against a running test service and review the contract with the API owner.

## Implementation limits

The sample service is fictional and does not accept requests. The lightweight Python script is a starter check, not a full YAML or OpenAPI validator.