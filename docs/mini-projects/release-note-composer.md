# Use the release note composer

The release note composer turns one product change into a Markdown draft. Use it when you have a confirmed change and need a starting point for customer-facing release notes.

The composer does not discover product changes or decide whether a change is ready to publish. You provide the facts; the tool formats them.

## Open the composer

1. Open the [portfolio website](https://tanmayi1996.github.io/).
2. Go to **Mini projects**.
3. Select **Open composer** or choose **Try mini demo** on the AI Release Notes Generator card.
4. The documentation playground opens with the release note composer selected.

## Enter the change details

Complete the fields in the composer.

| Field | Required | Description |
|---|---:|---|
| Product name | No | Product name used in the Markdown heading. Defaults to <code>Product</code> when empty. |
| Version | No | Release version used in the heading. Defaults to <code>Unversioned</code> when empty. |
| Change type | Yes | Select New feature, Improvement, Bug fix, or Security update. |
| Change title | No | Short name for the change. Defaults to <code>Change summary</code> when empty. |
| What changed and why it matters | No | Description shown after the title. Defaults to a reminder to add a verified description when empty. |

## Generate a draft

1. Enter the product name and version.
2. Select a change type.
3. Enter a title that describes the customer-visible change.
4. Describe what changed and why the reader should care.
5. Select **Generate draft**.

The output appears in the Markdown output area. The generated content includes a product and version heading, a change-type heading, and one bullet with the title and description.

Example output:

~~~markdown
# Atlas Workspace 2.4.0

## New feature
- **Export workspace activity** — Workspace administrators can export activity logs as CSV for audits and internal reporting.

---
*Draft for review. Validate behavior, audience, and availability before publishing.*
~~~

## Copy the Markdown

Select **Copy Markdown** to copy the current output. Paste it into your release-note source or editor, then make any required changes.

If clipboard access is unavailable in your browser, select the output text and copy it manually.

## Review the draft before publication

Check the draft with the product manager or engineering owner.

- Confirm the feature is available in the release being documented.
- Describe the change from the customer's point of view.
- Include prerequisites, permissions, or rollout limits when they affect the reader.
- Use the product's approved terminology.
- Remove internal implementation details that customers do not need.
- Confirm links, version numbers, and dates.

Do not publish the generated text without review. The composer formats information that you provide; it does not verify product behavior.

## Understand the limitations

The browser demo generates one change at a time. It does not connect to an issue tracker, compare code changes, generate release notes from pull requests, or use a language model. It does not save drafts after you leave the page.

For the Python project that creates grouped release notes from structured JSON records, see the [AI Release Notes Generator project guide](../portfolio-projects/ai-release-notes-generator.md).