# Browser-based mini projects

The portfolio website includes four small tools that demonstrate how a technical writer can make documentation tasks easier to understand and repeat.

Open the [mini-project playground](https://tanmayi1996.github.io/#mini-projects) to try them.

| Tool | Input | Result | Best used for |
|---|---|---|---|
| Release note composer | Product, version, change type, title, description | Markdown release-note draft | Formatting a confirmed product change |
| API response explorer | Sample endpoint and optional demo token text | Example HTTP request and response | Explaining API request and response structure |
| Documentation health analyzer | Paragraph or article excerpt | Counts and review suggestions | Quick editorial checks |
| Markdown table builder | Pipe-separated rows | Markdown table syntax | Preparing tables for Markdown documentation |

## Choose a tool

- Use the [release note composer](release-note-composer.md) when you have a confirmed change to communicate.
- Use the [API response explorer](api-response-explorer.md) to explain an HTTP exchange.
- Use the [documentation health analyzer](documentation-health-analyzer.md) to find patterns worth reviewing.
- Use the [Markdown table builder](markdown-table-builder.md) to convert notes into Markdown table syntax.

## How the mini projects work

All four tools execute in the visitor's browser. They do not send entered text to a server. The API response explorer uses predefined examples; it does not send HTTP requests. The tools are demonstrations, not replacements for a production release-management system, API client, editorial review, or Markdown parser.

See [implementation notes](implementation-notes.md) for technical details and [validation plan](validation-plan.md) for test scenarios.