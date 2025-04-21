import { Builder } from "@this-project/editor-core-builder";
import { parse } from "@this-project/editor-core-parser";
import { SectionPlugin } from "@this-project/editor-plugins-section";

const source = `
depth = 0

\\# This is escaped non-heading

[section]
# Non-top-level heading is invalid, no need to escape.
[/section]

# Hello

depth = 1

# World

depth = 1

## Bye

depth = 2

#

depth = 0

# 1

depth = 1

## 2

depth = 2

### 3

depth = 3

###

depth = 2

#

depth = 0
`;

const result = new Builder(parse(source)).apply(SectionPlugin).build();
console.log(JSON.stringify(result, null, 2));
