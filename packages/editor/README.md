# mdcode

**Strict, BBCode-enhanced Markdown**  
`mdcode` is a lightweight markup language that strictly combines the syntax of **Markdown** and **BBCode**, aiming to provide clarity, consistency, and extensibility without allowing raw HTML or ambiguous formatting. It’s ideal for structured documents in safe or controlled environments (e.g., documentation sites, forums, internal tools).

## Extensibility

Almost all features are provided by plugins.

### Core functionality

- Parsing Code Blocks and Tags into Document that consists of Nodes.
- Builder for applying plugins.

#### Code Blocks

````markdown
```js
function hello() {}
```
````

- Supports any number of opening backticks, at least three required.
- Count of opening backticks must be greater than length of longest preceding backticks in the code block.

`````markdown
````
``` triple-backticks in codeblock
````
`````

#### Tags

```bbcode
This is normal text
[callout=info]
  [deco font-color=red b]Red and bold[/deco]
[/callout]
```

### What plugins do

- Introduce new node type
- Transform nodes

## Constraints and Design Goals

- Output should be **deterministic and secure**.
- Parser must **not** interpret ambiguous or legacy Markdown syntax.
- Encourages clean formatting and no fallback to HTML.
- Escape sequence is treated as **escape only when necessary**.
    - `\[a` is escape because `[a` need to be escaped.
    - `\[ X` is not, because `[ X` doesn't need to be escaped.
- Almost all features are provided by plugins, such as:
    - `**bold**, _underlined_`
    - `# Headings`
