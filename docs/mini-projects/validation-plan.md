# Mini-project validation plan

Use this plan when you change the browser-based mini tools or their documentation. The checks focus on behavior a portfolio visitor can observe.

## Release note composer

| Test | Steps | Expected result |
|---|---|---|
| Default values | Open the playground. | Sample product, version, change type, title, and description appear. |
| Generate feature draft | Enter a title and description; select New feature; select **Generate draft**. | Output includes product/version heading, New feature heading, and supplied title and description. |
| Change type | Select Improvement, Bug fix, and Security update in separate runs. | Output heading reflects the selected type. |
| Empty fields | Clear the product, version, title, and description. | Documented fallback values appear. |
| Copy output | Select **Copy Markdown** in a browser that permits clipboard access. | Current output is copied. |

## API response explorer

| Test | Steps | Expected result |
|---|---|---|
| List projects | Select GET /v1/projects and select **Show example request**. | Shows a GET request and 200 OK example. |
| Create project | Select POST /v1/projects. | Shows a JSON request body and 201 Created response. |
| Get project | Select GET /v1/projects/{projectId}. | Shows an example for one project. |
| Delete project | Select DELETE /v1/projects/{projectId}. | Shows 204 No Content with no response body. |
| Token placeholder | Enter text in the demo token field. | Text appears in the example Authorization header; no network request occurs. |

## Documentation health analyzer

| Test | Steps | Expected result |
|---|---|---|
| Word count | Enter a short known sentence. | Word count matches the demo's token-counting rule. |
| Sentence count | Enter two sentences separated by a period. | Sentence count is two. |
| Placeholder | Include TODO, TBD, FIXME, or Lorem ipsum. | A placeholder suggestion appears. |
| Long sentence | Enter a sentence with more than 24 words. | The analyzer flags the sentence. |
| Clear | Select **Clear**. | Text is removed and metrics reset. |
| Empty input | Clear the input and analyze. | Counts are zero and an instruction to add content appears. |

## Markdown table builder

| Test | Steps | Expected result |
|---|---|---|
| Standard table | Enter a header and two rows. | Output includes a header, separator, and data rows. |
| Empty lines | Add blank lines between rows. | Blank lines are ignored. |
| Uneven row | Enter a row with fewer cells than the header. | The builder pads the row with empty cells. |
| Empty input | Remove all input and select **Build table**. | The output asks for a header and at least one data row. |
| Copy output | Select **Copy Markdown**. | Current table text is copied when clipboard access is available. |

## Cross-tool checks

- Open each tool from its mini-project card.
- Open each tool from the **Mini projects** section.
- Switch between all tabs using pointer and keyboard input.
- Check that the selected panel and tab state stay synchronized.
- Check the layout at narrow and wide viewport widths.
- Confirm that text output remains selectable.
- Confirm that the tool does not send input text to a server.
- Check browser console errors after each workflow.

## Accessibility checks

- Navigate to each control using the keyboard.
- Confirm that each input has a visible label.
- Confirm that buttons have meaningful accessible names.
- Confirm that the active tab is exposed through its selected state.
- Confirm that status messages are announced by the live region.
- Check focus visibility and text contrast in both color themes.
- Use a screen reader to verify the order of headings and controls.

## Release criteria

A change is ready to publish when all applicable checks pass, the documentation matches the behavior, links work, and no sample credentials or personal information have been added to the page.