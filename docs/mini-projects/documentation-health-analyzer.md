# Review a draft with the documentation health analyzer

The documentation health analyzer provides a quick set of editorial signals for a paragraph or article excerpt. It counts words and sentences and flags a few patterns that might deserve a closer look.

Use it before peer review, not as a final measure of writing quality.

## Open the analyzer

1. Open the [portfolio website](https://tanmayi1996.github.io/).
2. Go to **Mini projects**.
3. Select **Analyze a draft** or choose **Try mini demo** on the Documentation Quality Checker card.
4. The documentation health analyzer opens in the playground.

## Analyze a draft

1. Paste a paragraph or article excerpt into **Paste a paragraph or help article excerpt**.
2. Select **Analyze draft**.
3. Review the word count, sentence count, average sentence length, and review suggestions.

Select **Clear** to remove the text and reset the results.

## Understand the metrics

| Metric | How the demo calculates it | How to use it |
|---|---|---|
| Words | Counts letter-, number-, apostrophe-, and hyphen-based word tokens. | Check the approximate size of the selected text. |
| Sentences | Splits the text at periods, question marks, and exclamation points, then ignores empty segments. | Compare the number of sentence-like segments with the word count. |
| Words / sentence | Divides the word count by the sentence count. | Identify long passages that might benefit from editing. |

The counts are simple browser-side estimates. Abbreviations, decimals, headings, and code can affect the results.

## Review the suggestions

The analyzer checks for a small set of patterns:

- Placeholder terms such as <code>TODO</code>, <code>TBD</code>, <code>FIXME</code>, and <code>Lorem ipsum</code>.
- Sentences with more than 24 words.
- A possible passive-voice pattern based on a limited word pattern.
- Very short samples with fewer than 30 words.

A finding is a prompt for review, not proof of an error. Passive voice can be appropriate when the actor is unknown or unimportant. A 25-word sentence can be clear when it expresses one focused idea.

## Use the results in an editorial review

1. Read the flagged sentence in context.
2. Confirm whether the issue affects comprehension.
3. Edit only when the change makes the instruction or explanation clearer.
4. Check technical meaning, terminology, and accuracy after editing.
5. Ask a reviewer to assess the complete page, not only the excerpt.

## Understand the limitations

The analyzer does not parse Markdown, check link destinations, evaluate accessibility, identify all passive voice, score content against a style guide, or determine whether a statement is technically correct. It does not use an AI model. The input is processed in the browser and is not submitted to a server.

For the Python Markdown checker that scans files for local links, placeholder text, headings, and long prose lines, see the [Documentation Quality Checker project guide](../portfolio-projects/documentation-quality-checker.md).