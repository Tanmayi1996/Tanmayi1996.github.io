# AI Release Notes Generator

The AI Release Notes Generator is a Python command-line tool that turns structured product change records into grouped Markdown release notes. It demonstrates how a writer can establish a repeatable input format and reduce manual formatting work.

The current portfolio implementation is deterministic. It does not call an AI service or create product facts. A writer supplies the change records and reviews the result.

## Run the generator

You need Python 3.10 or later. The project uses only the Python standard library.

1. Clone the [source repository](https://github.com/Tanmayi1996/tanmayi-portfolio).
2. Open the <code>ai-release-notes-generator</code> directory.
3. Run:

~~~bash
python generate.py changes.json --output RELEASE_NOTES.md
~~~

4. Open <code>RELEASE_NOTES.md</code> and review the draft.

## Prepare the input file

The input file is JSON. It contains product metadata and a <code>changes</code> array.

Each change requires:

| Field | Type | Description |
|---|---|---|
| <code>type</code> | string | Change category: <code>feature</code>, <code>improvement</code>, <code>fix</code>, <code>security</code>, or <code>deprecated</code>. |
| <code>title</code> | string | Short customer-facing change title. |
| <code>description</code> | string | Description of what changed. |

Optional fields:

| Field | Type | Description |
|---|---|---|
| <code>audience</code> | string | Intended audience. Defaults to <code>all</code> in the output. |
| <code>area</code> | string | Product area included in the output metadata. |

The top-level <code>product</code>, <code>version</code>, and <code>release_date</code> fields identify the release.

## Understand the output

The generator groups changes in a fixed order: new features, improvements, bug fixes, security, and deprecations. Empty categories are omitted. Each change becomes a bullet with its title, description, and optional audience and product-area metadata.

## Validate the input

The generator stops with an error when the <code>changes</code> property is not an array, a required change field is empty, or the change type is not supported.

Run the unit tests:

~~~bash
python -m unittest -v
~~~

## Editorial review

The generated Markdown is a draft. Before publishing, confirm that each change is customer-visible, available in the stated release, and described with approved terminology. Add prerequisites or rollout details when they affect the reader.

## Implementation limits

The tool does not read issue trackers, source-control commits, or product roadmaps. It does not summarize pull requests, infer customer impact, or validate release status. Its value in this sample is the structured input model and repeatable Markdown output.