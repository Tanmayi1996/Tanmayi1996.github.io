# Build a Markdown table

Use the Markdown table builder to turn pipe-separated rows into a table that you can paste into a Markdown file.

## Open the table builder

1. Open the [portfolio website](https://tanmayi1996.github.io/).
2. Go to **Mini projects**.
3. Select **Build a table**.
4. The Markdown table builder opens in the playground.

## Enter table data

Enter one row per line in the input field. Separate columns with a vertical bar (<code>|</code>).

The first non-empty line becomes the header. Each remaining non-empty line becomes a data row.

Example input:

~~~text
Parameter | Required | Description
limit | No | Maximum number of results
status | No | Filter by project status
page | No | Page number for pagination
~~~

## Generate the table

1. Enter the header row and data rows.
2. Select **Build table**.
3. Review the generated Markdown in the output area.

Example output:

~~~markdown
| Parameter | Required | Description |
| --- | --- | --- |
| limit | No | Maximum number of results |
| status | No | Filter by project status |
| page | No | Page number for pagination |
~~~

If a row has fewer cells than the header, the builder adds empty cells so that the table has a consistent number of columns.

## Copy the table

Select **Copy Markdown**. Paste the output into your Markdown editor or repository.

If clipboard access is unavailable, select the output text and copy it manually.

## Prepare clean input

- Use the same number of columns in each row.
- Keep the header short and descriptive.
- Avoid using a vertical bar inside a cell.
- Do not include a separator row in the input; the builder creates one.

## Understand the limitations

The builder performs basic text splitting. It does not parse quoted values, escape pipe characters inside cells reliably, align columns by content, or validate Markdown syntax. Review the output in your target renderer before publishing.