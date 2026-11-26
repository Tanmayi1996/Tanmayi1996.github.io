# Explore an example API request and response

The API response explorer displays a sample HTTP request and response for a selected endpoint. Use it to explain request structure, authentication headers, response codes, and JSON payloads.

The explorer is a static learning tool. It does not connect to a server or send a request.

## Open the API explorer

1. Open the [portfolio website](https://tanmayi1996.github.io/).
2. Go to **Mini projects**.
3. Select **Explore API** or choose **Try mini demo** on the API Documentation Toolkit card.
4. Select the endpoint you want to inspect.

## Choose an endpoint

The explorer provides four sample operations.

| Selection | Method and path | Example response |
|---|---|---|
| List projects | <code>GET /v1/projects</code> | <code>200 OK</code> with an <code>items</code> array and <code>count</code> |
| Create project | <code>POST /v1/projects</code> | <code>201 Created</code> with the new project |
| Get project | <code>GET /v1/projects/{projectId}</code> | <code>200 OK</code> with one project |
| Delete project | <code>DELETE /v1/projects/{projectId}</code> | <code>204 No Content</code> |

The examples use fictional project identifiers and data.

## Display a request and response

1. Select an endpoint from **Endpoint**.
2. Optionally enter text in **Demo bearer token**.
3. Select **Show example request**.
4. Read the request and response in the output panel.

The optional token field changes the text displayed in the example Authorization header. The value is not transmitted or validated.

## Read the request

A request contains the HTTP method, resource path, and headers. Some operations also include a request body.

~~~http
POST /v1/projects
Authorization: Bearer [demo-token]
Content-Type: application/json

{
  "name": "API guide refresh",
  "description": "Update endpoint examples"
}
~~~

- <code>POST</code> asks the service to create a resource.
- <code>/v1/projects</code> identifies the collection.
- <code>Authorization</code> contains the bearer credential in a real request.
- <code>Content-Type</code> identifies the request body format.
- The JSON body contains the project properties.

## Read the response

A response starts with the HTTP status line. A response body follows when the operation returns one.

~~~http
HTTP/1.1 201 Created
{
  "id": "prj_205",
  "name": "API guide refresh",
  "status": "active"
}
~~~

The <code>201 Created</code> status indicates that the server created a resource. The returned <code>id</code> identifies the new project.

A <code>204 No Content</code> response has no body. Do not write documentation that expects JSON after a successful operation that returns <code>204</code>.

## Understand the limitations

The explorer uses fixed examples in the website's JavaScript. It does not validate the token, execute a request, authenticate a user, or return live data. The hostname and identifiers are examples, not production values.

For a full fictional API contract and endpoint guide, see the [API Documentation Toolkit project guide](../portfolio-projects/api-documentation-toolkit.md).