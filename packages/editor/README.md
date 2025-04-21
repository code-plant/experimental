# mdcode

**Strict, BBCode-enhanced Markdown**  
`mdcode` is a lightweight markup language that strictly combines the syntax of **Markdown** and **BBCode**, aiming to provide clarity, consistency, and extensibility without allowing raw HTML or ambiguous formatting. It’s ideal for structured documents in safe or controlled environments (e.g., documentation sites, forums, internal tools).

## ✨ Features at a Glance

- Markdown + BBCode hybrid syntax
- Strict formatting rules for predictable output
- No raw HTML or HTML entity escapes
- Unlimited heading depth with ID support
- Both BBCode and Markdown-style tables, lists, quotes, and links
- Extended formatting: footnotes, checkboxes, callouts
- Custom text highlighting and color tags

## 🚧 Strict Syntax Rules

1. **No HTML Support**
    - No inline HTML allowed (`<b>`, `&#42;`, etc.).
    - No escaping required for `<`, `>`, `&`.
2. **Whitespace Rules**
    - No leading/trailing spaces inside formatting (except nested lists).
    - Two trailing spaces (line break in Markdown) replaced by a single `\`.
3. **Escaping**
    - Only `[`, `#` can be escaped using `\`.
    - In quoted BBCode argument, `\` can be escaped using `\\` as well.

## Markdown Style Syntax

### Headings (section)

```
# h1
## h2
### h3 {#optional-custom-id}
...
######## h8
```

- No Setext-style headings (`===`, `---`)
- Heading levels can increase by **at most 1**.
- Section may be explicitly terminated by heading without text.
- Section cannot be nested by other components.

```
# Primary section

This is in Primary section

## Secondary section

This is in secondary section

### tertiary section

This is in tertiary section

##

This is in Primary section because the Secondary section was terminated by `##`.
```

### Code Blocks

````markdown
```js
function hello() {}
```
````

- Indented code blocks **not** supported
- Must have explicit closing backticks
- Supports any number of opening backticks, at least three required.
- Count of opening backticks must be greater than length of longest preceding backticks in the code block.

`````markdown
````
``` triple-backticks in codeblock
````
`````

## BBCode Style Syntax

### Horizontal Rule

```
[hr/]
[hr=color/]
```

### Tables

```
[table]
  [tr][th colspan=2]Header[/th][/tr]
  [tr][td align=left]Name[/td][td]Bob[/td][/tr]
[/table]
```

### Lists

```
[list=a]
[*] First
[*] Second
[/list]
```

- Support for ordered lists with any alphabet/number: `[list=42]`, `[list=d]`, ...

### Links

```
[url]https://example.com[/url]
[url=https://example.com]Example[/url]
[url=mailto:user@example.com]Email[/url]
```

- Also supports internal links to headings

### Image

```
[img alt="alt text"]https://example.com/image.png[/img]
```

### Quotes

```
[quote]Quoted text[/quote]
[quote]
Quoted text
[/quote]
```

### Callouts

```
[callout=info]
This is an informational block.
[/callout]
```

Types may include: `info`, `warning`, `error`, `tip`, etc.

### Formatting Tags

| Tag              | BBCode                 |
|------------------|------------------------|
| Bold             | `[b]text[/b]`          |
| Italic           | `[i]text[/i]`          |
| Strikethrough    | `[s]text[/s]`          |
| Underline        | `[u]text[/u]`          |
| Font color       | `[fc=#f00]text[/fc]`   |
| Background color | `[bc=yellow]text[/bc]` |

### Toggle Blocks

```
[toggle=Summary]
Hidden content goes here.
[/toggle]
```

### Math

Supports KaTeX

```
[math]x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}[/math]
[math-block]
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
[/math-block]
```

## 📌 Notes

- Non-escape `\` is considered as escaped `\`
- No comment supported intentionally

## Future plans

- [ ] checkbox
- `[kbd]Ctrl+C[/kbd]` for keyboard inputs
- `[abbr=HyperText Markup Language]HTML[/abbr]` for accessibility

## 🛠 Constraints & Design Goals

- Output should be **deterministic and secure**.
- Parser must **not** interpret ambiguous or legacy Markdown syntax.
- Encourages clean formatting with strict level rules and no HTML fallback.
