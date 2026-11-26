# Documentation Quality Checker

The Documentation Quality Checker is a Python command-line utility that scans Markdown files for common mechanical issues. It helps contributors catch a few problems before peer review.

It is a starter linter, not a replacement for editorial judgment or a full Markdown parser.

## Run the checker

You need Python 3.10 or later. The checker uses only the Python standard library.

1. Clone the [source repository](https://github.com/Tanmayi1996/tanmayi-portfolio).
2. Open the <code>documentation-quality-checker</code> directory.
3. Run:

~~~bash
python check_docs.py samples
~~~

4. Review the file names, line numbers, and messages in the output.

## Checks performed

| Check | What the tool looks for |
|---|---|
| Heading | At least one Markdown heading in each file. |
| Placeholder text | <code>TODO</code>, <code>TBD</code>, <code>FIXME</code>, and <code>Lorem ipsum</code>. |
| Relative links | Local Markdown links whose target file does not exist. |
| Long prose lines | Non-heading prose lines with more words than the configured threshold. |

The default long-line threshold is 30 words.

## Change the word threshold

Use <code>--max-words</code> to set a different limit.

~~~bash
python check_docs.py samples --max-words 25
~~~

## Check one file

Pass a Markdown file path instead of a directory.

~~~bash
python check_docs.py samples/quickstart.md
~~~

## Interpret the exit code

The checker exits with code <code>0</code> when it finds no issues and code <code>1</code> when it reports one or more issues. This lets a CI workflow use the result as a simple quality gate.

## Run the tests

~~~bash
python -m unittest -v
~~~

The unit tests cover detection of placeholders and broken local links, along with a clean-file case.

## Known limitations

The checker does not parse the full Markdown syntax tree. It does not check external URLs, validate code samples, evaluate accessibility, detect every style violation, or judge technical accuracy. A long sentence is not always unclear, and a short sentence is not always useful. Review each finding in context before you edit the source.