import { Token } from "@this-project/graphql-common-lexer";

export type Document = Definition[];

export type ExecutableDocument = ExecutableDefinition[];

export type TypeSystemDocument = TypeSystemDefinition[];

export type TypeSystemExtensionDocument = TypeSystemDefinitionOrExtension[];

export type Definition = ExecutableDefinition | TypeSystemDefinitionOrExtension;

export interface ExecutableDefinitionBase {
  type: "executable";
  directives?: Directives;
  selectionSet: SelectionSet;
}

export interface OperationDefinition extends ExecutableDefinitionBase {
  subType: "operation";
  operationType?: OperationType;
  name?: string;
  variableDefinitions?: VariableDefinitions;
}

export type OperationType = "query" | "mutation" | "subscription";

export type SelectionSet = Selection[];

export type Selection = Field | FragmentSpread | InlineFragment;

export interface Field {
  type: "field";
  alias?: string;
  name: string;
  arguments?: Arguments;
  directives?: Directives;
  selectionSet?: SelectionSet;
}

export type Arguments = Argument[];

export interface Argument {
  name: string;
  value: Value;
}

export interface FragmentSpread {
  type: "fragmentSpread";
  name: string;
  directives?: Directives;
}

export interface InlineFragment {
  type: "inlineFragment";
  typeCondition?: string;
  directives?: Directives;
  selectionSet: SelectionSet;
}

export interface FragmentDefinition extends ExecutableDefinitionBase {
  subType: "fragment";
  name: string;
  typeCondition: string;
}

export type Value =
  | Variable
  | IntValue
  | FloatValue
  | StringValue
  | BooleanValue
  | NullValue
  | EnumValue
  | ListValue
  | ObjectValue;

export interface Variable {
  type: "variable";
  name: string;
}

export interface IntValue {
  type: "int";
  value: number;
}

export interface FloatValue {
  type: "float";
  value: number;
}

export interface StringValue {
  type: "string";
  value: string;
}

export interface BooleanValue {
  type: "boolean";
  value: boolean;
}

export interface NullValue {
  type: "null";
}

export interface EnumValue {
  type: "enum";
  value: string;
}

export interface ListValue {
  type: "list";
  values: Value[];
}

export interface ObjectValue {
  type: "object";
  value: Partial<Record<string, Value>>;
}

export type VariableDefinitions = VariableDefinition[];

export interface VariableDefinition {
  variable: string;
  type: Type;
  defaultValue?: Value;
  directives?: Directives;
}

export type Type = NamedType | ListType | NonNullType;

export interface NamedType {
  type: "named";
  name: string;
}

export interface ListType {
  type: "list";
  element: Type;
}

export interface NonNullType {
  type: "nonNull";
  element: NamedType | ListType;
}

export type Directives = Directive[];

export interface Directive {
  name: string;
  arguments?: Arguments;
}

export type ExecutableDefinition = OperationDefinition | FragmentDefinition;

export interface TypeSystemDefinitionOrExtensionBase {
  type: "typeSystem";
}

export interface TypeSystemDefinitionBase
  extends TypeSystemDefinitionOrExtensionBase {
  subType: "definition";
  description?: string;
}

export interface SchemaDefinition extends TypeSystemDefinitionBase {
  definitionType: "schema";
  directives?: Directives;
  rootOperationTypeDefinitions: RootOperationTypeDefinition[];
}

export interface RootOperationTypeDefinition {
  operationType: OperationType;
  type: string;
}

export interface TypeDefinitionBase extends TypeSystemDefinitionBase {
  definitionType: "type";
  name: string;
  directives?: Directives;
}

export interface ScalarTypeDefinition extends TypeDefinitionBase {
  typeType: "scalar";
}

export interface ObjectTypeDefinition extends TypeDefinitionBase {
  typeType: "object";
  implementsInterfaces?: string[];
  fieldsDefinition?: FieldsDefinition;
}

export type FieldsDefinition = FieldDefinition[];

export interface FieldDefinition {
  description?: string;
  name: string;
  argumentsDefinition?: ArgumentsDefinition;
  type: Type;
  directives?: Directives;
}

export type ArgumentsDefinition = InputValueDefinition[];

export interface InputValueDefinition {
  description?: string;
  name: string;
  type: Type;
  defaultValue?: Value;
  directives?: Directives;
}

export interface InterfaceTypeDefinition extends TypeDefinitionBase {
  typeType: "interface";
  implementsInterfaces?: string[];
  fieldsDefinition?: FieldsDefinition;
}

export interface UnionTypeDefinition extends TypeDefinitionBase {
  typeType: "union";
  unionMemberTypes?: string[];
}

export interface EnumTypeDefinition extends TypeDefinitionBase {
  typeType: "enum";
  enumValuesDefinition?: EnumValuesDefinition;
}

export type EnumValuesDefinition = EnumValueDefinition[];

export interface EnumValueDefinition {
  description?: string;
  enumValue: string;
  directives?: Directives;
}

export interface InputObjectTypeDefinition extends TypeDefinitionBase {
  typeType: "inputObject";
  inputFieldsDefinition?: InputFieldsDefinition;
}

export type InputFieldsDefinition = InputValueDefinition[];

export type TypeDefinition =
  | ScalarTypeDefinition
  | ObjectTypeDefinition
  | InterfaceTypeDefinition
  | UnionTypeDefinition
  | EnumTypeDefinition
  | InputObjectTypeDefinition;

export interface DirectiveDefinition extends TypeSystemDefinitionBase {
  definitionType: "directive";
  name: string;
  argumentsDefinition?: ArgumentsDefinition;
  repeatable: boolean;
  directiveLocations: DirectiveLocation[];
}

export type DirectiveLocation =
  | ExecutableDirectiveLocation
  | TypeSystemDirectiveLocation;

export type ExecutableDirectiveLocation =
  | "QUERY"
  | "MUTATION"
  | "SUBSCRIPTION"
  | "FIELD"
  | "FRAGMENT_DEFINITION"
  | "FRAGMENT_SPREAD"
  | "INLINE_FRAGMENT"
  | "VARIABLE_DEFINITION";

export type TypeSystemDirectiveLocation =
  | "SCHEMA"
  | "SCALAR"
  | "OBJECT"
  | "FIELD_DEFINITION"
  | "ARGUMENT_DEFINITION"
  | "INTERFACE"
  | "UNION"
  | "ENUM"
  | "ENUM_VALUE"
  | "INPUT_OBJECT"
  | "INPUT_FIELD_DEFINITION";

export type TypeSystemDefinition =
  | SchemaDefinition
  | TypeDefinition
  | DirectiveDefinition;

export interface TypeSystemExtensionBase
  extends TypeSystemDefinitionOrExtensionBase {
  subType: "extension";
}

export interface SchemaExtension extends TypeSystemExtensionBase {
  extensionType: "schema";
  directives?: Directives;
  rootOperationTypeDefinitions?: RootOperationTypeDefinition[];
}

export interface TypeExtensionBase extends TypeSystemExtensionBase {
  extensionType: "type";
  name: string;
  directives?: Directives;
}

export interface ScalarTypeExtension extends TypeExtensionBase {
  typeType: "scalar";
}

export interface ObjectTypeExtension extends TypeExtensionBase {
  typeType: "object";
  implementsInterfaces?: string[];
  fieldsDefinition?: FieldsDefinition;
}

export interface InterfaceTypeExtension extends TypeExtensionBase {
  typeType: "interface";
  implementsInterfaces?: string[];
  fieldsDefinition?: FieldsDefinition;
}

export interface UnionTypeExtension extends TypeExtensionBase {
  typeType: "union";
  unionMemberTypes?: string[];
}

export interface EnumTypeExtension extends TypeExtensionBase {
  typeType: "enum";
  enumValuesDefinition?: EnumValuesDefinition;
}

export interface InputObjectTypeExtension extends TypeExtensionBase {
  typeType: "inputObject";
  inputFieldsDefinition?: InputFieldsDefinition;
}

export type TypeExtension =
  | ScalarTypeExtension
  | ObjectTypeExtension
  | InterfaceTypeExtension
  | UnionTypeExtension
  | EnumTypeExtension
  | InputObjectTypeExtension;

export type TypeSystemExtension = SchemaExtension | TypeExtension;

export type TypeSystemDefinitionOrExtension =
  | TypeSystemDefinition
  | TypeSystemExtension;

export interface Error {
  message: string;
  tokenNear: Token | undefined;
}

export function parse(input: Token[]): Document | Error {
  try {
    const [document, index] = unwrap(parseDocument(input, 0));
    if (index != input.length) {
      return {
        message: "Unterminated document",
        tokenNear: input[index],
      };
    }
    return document;
  } catch (e) {
    if (e instanceof ParseError) {
      return e.error;
    }
    throw e;
  }
}

class ParseError extends Error {
  public readonly error: Error;

  constructor(error: Error) {
    super();
    this.error = error;
  }
}

const operationTypes = ["query", "mutation", "subscription"] as const;

type ParseResult<T> = ParseSuccessResult<T> | Error;
type ParseSuccessResult<T> = [result: T, nextIndex: number];

function raise(error: Error, alternatives?: string): never {
  const message = alternatives ? `Expected ${alternatives}` : error.message;
  throw new ParseError({ ...error, message });
}

function unwrap<T>(
  result: ParseResult<T>,
  alternatives?: string
): ParseSuccessResult<T> {
  if (!Array.isArray(result)) {
    raise(result, alternatives);
  }
  return result;
}

function arrayIncludes<const T extends string>(
  array: readonly T[],
  string: string
): string is T {
  return (array as readonly string[]).indexOf(string) !== -1;
}

type TokenV2 = Token["type"] extends infer I
  ? I extends any
    ? Token & Record<"type", I>
    : never
  : never;

function expect<T extends Token["type"]>(
  token: Token | undefined,
  tokenType: T,
  alternatives?: string
): Extract<TokenV2, Record<"type", T>> {
  if (token?.type !== tokenType) {
    const message = alternatives
      ? `Expected ${alternatives}, or ${tokenType}`
      : `Expected ${tokenType}`;
    raise({ message, tokenNear: token });
  }
  return token as Extract<TokenV2, Record<"type", T>>;
}

function parseDocument(
  tokens: Token[],
  startIndex: number
): ParseResult<Document> {
  let index = startIndex;
  const result: Definition[] = [];
  let tmp: ParseResult<Definition>;
  while (Array.isArray((tmp = parseDefinition(tokens, index)))) {
    const [definition, lastIndex] = tmp;
    result.push(definition);
    index = lastIndex;
  }
  return [result, index];
}

function parseDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<Definition> {
  let tmp: ParseResult<Definition>;
  if (Array.isArray((tmp = parseExecutableDefinition(tokens, startIndex)))) {
    return tmp;
  } else if (
    Array.isArray(
      (tmp = parseTypeSystemDefinitionOrExtension(tokens, startIndex))
    )
  ) {
    return tmp;
  }
  return { message: "Unrecognized Definition", tokenNear: tokens[startIndex] };
}

function parseExecutableDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<ExecutableDefinition> {
  let tmp: ParseResult<ExecutableDefinition>;
  if (Array.isArray((tmp = parseOperationDefinition(tokens, startIndex)))) {
    return tmp;
  } else if (
    Array.isArray((tmp = parseFragmentDefinition(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized ExecutableDefinition",
    tokenNear: tokens[startIndex],
  };
}

function parseOperationDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<OperationDefinition> {
  let index = startIndex;
  const tmp = tokens[index++];
  if (tmp?.type !== "name" || !arrayIncludes(operationTypes, tmp.value)) {
    return { message: "Expected OperationType", tokenNear: tmp };
  }
  const operationType = tmp.value;
  const { value: name } = expect(tokens[index++], "name");
  let variableDefinitions: VariableDefinitions | undefined;
  [variableDefinitions, index] = parseOptionalVariableDefinitions(
    tokens,
    index
  );
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let selectionSet: SelectionSet;
  [selectionSet, index] = unwrap(parseSelectionSet(tokens, index));
  return [
    {
      type: "executable",
      subType: "operation",
      operationType,
      name,
      variableDefinitions,
      directives,
      selectionSet,
    },
    index,
  ];
}

function parseOptionalVariableDefinitions(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<VariableDefinitions | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "(") {
    return [undefined, startIndex];
  }
  const result: VariableDefinitions = [];
  let variableDefinition: VariableDefinition;
  [variableDefinition, index] = unwrap(
    parseVariableDefinition(tokens, index),
    "VariableDefinition"
  );
  result.push(variableDefinition);
  let tmp: ParseResult<VariableDefinition>;
  while (Array.isArray((tmp = parseVariableDefinition(tokens, index)))) {
    [variableDefinition, index] = tmp;
    result.push(variableDefinition);
  }
  expect(tokens[index++], ")", "VariableDefinition");
  return [result, index];
}

function parseVariableDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<VariableDefinition> {
  let index = startIndex;
  if (tokens[index++]?.type !== "$") {
    return { message: "Expected $", tokenNear: tokens[startIndex] };
  }
  const { value: variable } = expect(tokens[index++], "name");
  expect(tokens[index++], ":");
  let type: Type;
  [type, index] = unwrap(parseType(tokens, index));
  if (tokens[index]?.type !== "=") {
    return [{ type, variable }, index];
  }
  index++;
  let defaultValue: Value;
  [defaultValue, index] = unwrap(parseValue(tokens, index));
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  return [{ type, variable, defaultValue, directives }, index];
}

function parseType(tokens: Token[], startIndex: number): ParseResult<Type> {
  let index = startIndex;
  if (tokens[index]?.type === "[") {
    let innerType: Type;
    [innerType, index] = unwrap(parseType(tokens, index + 1));
    expect(tokens[index++], "]");
    let isNonNull = tokens[index]?.type === "!";
    if (isNonNull) {
      index++;
    }
    return [
      isNonNull
        ? { type: "nonNull", element: { type: "list", element: innerType } }
        : { type: "list", element: innerType },
      index,
    ];
  } else if (tokens[index]?.type === "name") {
    const name = tokens[index++];
    if (name?.type !== "name") {
      return { message: "Expected name", tokenNear: name };
    }
    let isNonNull = tokens[index]?.type === "!";
    if (isNonNull) {
      index++;
    }
    return [
      isNonNull
        ? { type: "nonNull", element: { type: "named", name: name.value } }
        : { type: "named", name: name.value },
      index,
    ];
  } else {
    return { message: "Unrecognized Type", tokenNear: tokens[startIndex] };
  }
}

function parseValue(tokens: Token[], startIndex: number): ParseResult<Value> {
  let tmp: ParseResult<Value>;
  if (
    Array.isArray((tmp = parseVariable(tokens, startIndex))) ||
    Array.isArray((tmp = parseIntValue(tokens, startIndex))) ||
    Array.isArray((tmp = parseFloatValue(tokens, startIndex))) ||
    Array.isArray((tmp = parseStringValue(tokens, startIndex))) ||
    Array.isArray((tmp = parseBooleanValue(tokens, startIndex))) ||
    Array.isArray((tmp = parseNullValue(tokens, startIndex))) ||
    Array.isArray((tmp = parseEnumValue(tokens, startIndex))) ||
    Array.isArray((tmp = parseListValue(tokens, startIndex))) ||
    Array.isArray((tmp = parseObjectValue(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized Value",
    tokenNear: tokens[startIndex],
  };
}

function parseObjectValue(
  tokens: Token[],
  startIndex: number
): ParseResult<ObjectValue> {
  let index = startIndex;
  if (tokens[index++]?.type !== "{") {
    return { message: "Expected {", tokenNear: tokens[startIndex] };
  }
  const result: Partial<Record<string, Value>> = {};
  let current = tokens[index];
  while (current?.type === "name") {
    // TODO: refactor
    index++;
    const key = current.value;
    expect(tokens[index++], ":");
    let value: Value;
    [value, index] = unwrap(parseValue(tokens, index));
    result[key] = value;
    current = tokens[index];
  }
  expect(tokens[index++], "}");
  return [{ type: "object", value: result }, index];
}

function parseListValue(
  tokens: Token[],
  startIndex: number
): ParseResult<ListValue> {
  let index = startIndex;
  if (tokens[index++]?.type !== "[") {
    return { message: "Expected [", tokenNear: tokens[startIndex] };
  }
  const result: Value[] = [];
  while (tokens[index]?.type !== "]") {
    let value;
    [value, index] = unwrap(parseValue(tokens, index));
    result.push(value);
  }
  expect(tokens[index++], "]");
  return [{ type: "list", values: result }, index];
}

function parseEnumValue(
  tokens: Token[],
  startIndex: number
): ParseResult<EnumValue> {
  let index = startIndex;
  const current = tokens[index++];
  if (current?.type !== "name") {
    return { message: "Expected EnumValue", tokenNear: current };
  }
  if (arrayIncludes(["true", "false", "null"], current.value)) {
    return {
      message: "EnumValue can't be one of true, false, or null",
      tokenNear: current,
    };
  }
  return [{ type: "enum", value: current.value }, index];
}

function parseNullValue(
  tokens: Token[],
  startIndex: number
): ParseResult<NullValue> {
  let index = startIndex;
  const current = tokens[index++];
  if (current?.type !== "name" || current.value !== "null") {
    return { message: "Expected null", tokenNear: current };
  }
  return [{ type: "null" }, index];
}

function parseBooleanValue(
  tokens: Token[],
  startIndex: number
): ParseResult<BooleanValue> {
  let index = startIndex;
  const current = tokens[index++];
  if (
    current?.type !== "name" ||
    (current.value !== "true" && current.value !== "false")
  ) {
    return { message: "Expected one of true, false", tokenNear: current };
  }
  return [{ type: "boolean", value: current.value === "true" }, index];
}

function parseStringValue(
  tokens: Token[],
  startIndex: number
): ParseResult<StringValue> {
  let index = startIndex;
  const current = tokens[index++];
  if (current?.type !== "string") {
    return { message: "Expected one of true, false", tokenNear: current };
  }
  return [{ type: "string", value: current.value }, index];
}

function parseFloatValue(
  tokens: Token[],
  startIndex: number
): ParseResult<FloatValue> {
  let index = startIndex;
  const current = tokens[index++];
  if (current?.type !== "float") {
    return { message: "Expected float", tokenNear: current };
  }
  return [{ type: "float", value: current.value }, index];
}

function parseIntValue(
  tokens: Token[],
  startIndex: number
): ParseResult<IntValue> {
  let index = startIndex;
  const current = tokens[index++];
  if (current?.type !== "int") {
    return { message: "Expected int", tokenNear: current };
  }
  return [{ type: "int", value: current.value }, index];
}

function parseVariable(
  tokens: Token[],
  startIndex: number
): ParseResult<Variable> {
  let index = startIndex;
  if (tokens[index++]?.type !== "$") {
    return { message: "Expected $", tokenNear: tokens[startIndex] };
  }
  const { value: name } = expect(tokens[index++], "name");
  return [{ type: "variable", name }, index];
}

function parseOptionalDirectives(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<Directives | undefined> {
  let index = startIndex;
  if (tokens[index]?.type !== "@") {
    return [undefined, startIndex];
  }
  const result: Directive[] = [];
  while (tokens[index]?.type === "@") {
    index++;
    const { value: name } = expect(tokens[index++], "name");
    let arguments_: Arguments | undefined;
    [arguments_, index] = parseOptionalArguments(tokens, index);
    result.push({ name, arguments: arguments_ });
  }
  return [result, index];
}

function parseOptionalArguments(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<Arguments | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "(") {
    return [undefined, startIndex];
  }
  let argument: Argument;
  [argument, index] = unwrap(parseArgument(tokens, index));
  const result = [argument];
  while (tokens[index]?.type !== ")") {
    [argument, index] = unwrap(parseArgument(tokens, index));
    result.push(argument);
  }
  expect(tokens[index++], ")");
  return [result, index];
}

function parseArgument(
  tokens: Token[],
  startIndex: number
): ParseResult<Argument> {
  let index = startIndex;
  const current = tokens[index++];
  if (current?.type !== "name") {
    return { message: "Expected name", tokenNear: current };
  }
  const name = current.value;
  expect(tokens[index++], ":");
  let value: Value;
  [value, index] = unwrap(parseValue(tokens, index));
  return [{ name, value }, index];
}

function parseSelectionSet(
  tokens: Token[],
  startIndex: number
): ParseResult<SelectionSet> {
  let index = startIndex;
  if (tokens[index++]?.type !== "{") {
    return { message: "Expected {", tokenNear: tokens[startIndex] };
  }
  let selection: Selection;
  [selection, index] = unwrap(parseSelection(tokens, index));
  const result = [selection];
  while (tokens[index]?.type !== "}") {
    [selection, index] = unwrap(parseSelection(tokens, index));
    result.push(selection);
  }
  expect(tokens[index++], "}");
  return [result, index];
}

function parseSelection(
  tokens: Token[],
  startIndex: number
): ParseResult<Selection> {
  let tmp: ParseResult<Selection>;
  if (
    Array.isArray((tmp = parseField(tokens, startIndex))) ||
    Array.isArray((tmp = parseFragmentSpread(tokens, startIndex))) ||
    Array.isArray((tmp = parseInlineFragment(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized Selection",
    tokenNear: tokens[startIndex],
  };
}

function parseInlineFragment(
  tokens: Token[],
  startIndex: number
): ParseResult<InlineFragment> {
  let index = startIndex;
  if (tokens[index++]?.type !== "...") {
    return { message: "Expected ...", tokenNear: tokens[startIndex] };
  }
  let typeCondition: string | undefined = undefined;
  {
    const maybeOn = tokens[index];
    if (maybeOn?.type === "name") {
      if (maybeOn.value === "on") {
        index++;
        typeCondition = maybeOn.value;
      } else {
        return { message: "Expected on or @ or {", tokenNear: maybeOn };
      }
    }
  }
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let selectionSet: SelectionSet;
  [selectionSet, index] = unwrap(parseSelectionSet(tokens, index));
  return [
    { type: "inlineFragment", typeCondition, directives, selectionSet },
    index,
  ];
}

function parseFragmentSpread(
  tokens: Token[],
  startIndex: number
): ParseResult<FragmentSpread> {
  let index = startIndex;
  if (tokens[index++]?.type !== "...") {
    return { message: "Expected ...", tokenNear: tokens[startIndex] };
  }
  const name = tokens[index++];
  if (name?.type !== "name") {
    return { message: "Expected name", tokenNear: name };
  }
  if (name.value === "on") {
    return { message: "Expected name other than on", tokenNear: name };
  }
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  return [{ type: "fragmentSpread", name: name.value, directives }, index];
}

function parseField(tokens: Token[], startIndex: number): ParseResult<Field> {
  let index = startIndex;
  const nameOrAlias = tokens[index++];
  if (nameOrAlias?.type !== "name") {
    return { message: "Expected name", tokenNear: nameOrAlias };
  }
  let name: string | undefined;
  if (tokens[index]?.type === ":") {
    index++;
    ({ value: name } = expect(tokens[index++], "name"));
  }
  let arguments_: Arguments | undefined;
  [arguments_, index] = parseOptionalArguments(tokens, index);
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let selectionSet: SelectionSet | undefined = undefined;
  const selectionSetResult = parseSelectionSet(tokens, index);
  if (Array.isArray(selectionSetResult)) {
    [selectionSet, index] = selectionSetResult;
  }
  const [realName, realAlias] =
    name === undefined ? [nameOrAlias.value] : [name, nameOrAlias.value];
  return [
    {
      type: "field",
      name: realName,
      alias: realAlias,
      arguments: arguments_,
      directives,
      selectionSet,
    },
    index,
  ];
}

function parseFragmentDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<FragmentDefinition> {
  let index = startIndex;
  const fragment = tokens[index++];
  if (fragment?.type !== "name" || fragment.value !== "fragment") {
    return { message: "Expected fragment", tokenNear: fragment };
  }
  const { value: name } = expect(tokens[index++], "name");
  const on = expect(tokens[index++], "name");
  if (on.value !== "on") {
    raise({ message: "Expected on", tokenNear: on });
  }
  const { value: typeCondition } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let selectionSet: SelectionSet;
  [selectionSet, index] = unwrap(parseSelectionSet(tokens, index));
  return [
    {
      type: "executable",
      subType: "fragment",
      name,
      typeCondition,
      directives,
      selectionSet,
    },
    index,
  ];
}

function parseTypeSystemDefinitionOrExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<TypeSystemDefinitionOrExtension> {
  let tmp: ParseResult<TypeSystemDefinitionOrExtension>;
  if (
    Array.isArray((tmp = parseTypeSystemDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseTypeSystemExtension(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized TypeSystemDefinitionOrExtension",
    tokenNear: tokens[startIndex],
  };
}

function parseTypeSystemExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<TypeSystemExtension> {
  let tmp: ParseResult<TypeSystemExtension>;
  if (
    Array.isArray((tmp = parseSchemaExtension(tokens, startIndex))) ||
    Array.isArray((tmp = parseTypeExtension(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized TypeSystemExtension",
    tokenNear: tokens[startIndex],
  };
}

function parseTypeExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<TypeExtension> {
  let tmp: ParseResult<TypeExtension>;
  if (
    Array.isArray((tmp = parseScalarTypeExtension(tokens, startIndex))) ||
    Array.isArray((tmp = parseObjectTypeExtension(tokens, startIndex))) ||
    Array.isArray((tmp = parseInterfaceTypeExtension(tokens, startIndex))) ||
    Array.isArray((tmp = parseUnionTypeExtension(tokens, startIndex))) ||
    Array.isArray((tmp = parseEnumTypeExtension(tokens, startIndex))) ||
    Array.isArray((tmp = parseInputObjectTypeExtension(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized TypeExtension",
    tokenNear: tokens[startIndex],
  };
}

function parseInputObjectTypeExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<InputObjectTypeExtension> {
  let index = startIndex;
  const extend = tokens[index++];
  if (extend?.type !== "name" || extend.value !== "extend") {
    return { message: "Expected extend", tokenNear: extend };
  }
  const input = tokens[index++];
  if (input?.type !== "name" || input.value !== "input") {
    return { message: "Expected input", tokenNear: input };
  }
  const { value: name } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let inputFieldsDefinition: InputFieldsDefinition | undefined;
  [inputFieldsDefinition, index] = parseOptionalInputFieldsDefinition(
    tokens,
    index
  );
  if (!directives && !inputFieldsDefinition) {
    raise({
      message: "Expected at least one of Directives, InputFieldsDefinition",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "extension",
      extensionType: "type",
      typeType: "inputObject",
      name,
      directives,
      inputFieldsDefinition,
    },
    index,
  ];
}

function parseOptionalInputFieldsDefinition(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<FieldsDefinition | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "{") {
    return [undefined, startIndex];
  }
  let inputValueDefinition: InputValueDefinition;
  [inputValueDefinition, index] = unwrap(
    parseInputValueDefinition(tokens, index)
  );
  const result = [inputValueDefinition];
  while (tokens[index]?.type !== "}") {
    [inputValueDefinition, index] = unwrap(
      parseInputValueDefinition(tokens, index)
    );
    result.push(inputValueDefinition);
  }
  expect(tokens[index++], "}");
  return [result, index];
}

function parseInputValueDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<InputValueDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  let tmp = tokens[index];
  if (tmp?.type === "string") {
    index++;
    description = tmp.value;
  }
  const { value: name } = expect(tokens[index++], "name");
  expect(tokens[index++], ":");
  let type: Type;
  [type, index] = unwrap(parseType(tokens, index));
  let defaultValue: Value | undefined;
  tmp = tokens[index];
  if (tmp?.type === "=") {
    index++;
    [defaultValue, index] = unwrap(parseValue(tokens, index));
  }
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  return [{ description, name, type, defaultValue, directives }, index];
}

function parseEnumTypeExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<EnumTypeExtension> {
  let index = startIndex;
  const extend = tokens[index++];
  if (extend?.type !== "name" || extend.value !== "extend") {
    return { message: "Expected extend", tokenNear: extend };
  }
  const enum_ = tokens[index++];
  if (enum_?.type !== "name" || enum_.value !== "enum") {
    return { message: "Expected enum", tokenNear: enum_ };
  }
  const { value: name } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let enumValuesDefinition: EnumValuesDefinition | undefined;
  [enumValuesDefinition, index] = parseOptionalEnumValuesDefinition(
    tokens,
    index
  );
  if (!directives && !enumValuesDefinition) {
    raise({
      message: "Expected at least one of Directives, EnumValuesDefinition",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "extension",
      extensionType: "type",
      typeType: "enum",
      name,
      directives,
      enumValuesDefinition,
    },
    index,
  ];
}

function parseOptionalEnumValuesDefinition(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<EnumValuesDefinition | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "{") {
    return [undefined, startIndex];
  }
  let enumValueDefinition: EnumValueDefinition;
  [enumValueDefinition, index] = unwrap(
    parseEnumValueDefinition(tokens, index)
  );
  const result = [enumValueDefinition];
  while (tokens[index]?.type !== "}") {
    [enumValueDefinition, index] = unwrap(
      parseEnumValueDefinition(tokens, index)
    );
    result.push(enumValueDefinition);
  }
  expect(tokens[index++], "}");
  return [result, index];
}

function parseEnumValueDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<EnumValueDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  let tmp = tokens[index];
  if (tmp?.type === "string") {
    index++;
    description = tmp.value;
  }
  const enumValue = expect(tokens[index++], "name");
  if (arrayIncludes(["true", "false", "null"], enumValue.value)) {
    return {
      message: "EnumValue can't be one of true, false, or null",
      tokenNear: enumValue,
    };
  }
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  return [{ description, enumValue: enumValue.value, directives }, index];
}

function parseUnionTypeExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<UnionTypeExtension> {
  let index = startIndex;
  const extend = tokens[index++];
  if (extend?.type !== "name" || extend.value !== "extend") {
    return { message: "Expected extend", tokenNear: extend };
  }
  const union = tokens[index++];
  if (union?.type !== "name" || union.value !== "union") {
    return { message: "Expected union", tokenNear: union };
  }
  const { value: name } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let unionMemberTypes: string[] | undefined;
  [unionMemberTypes, index] = parseOptionalUnionMemberTypes(tokens, index);
  if (!directives && !unionMemberTypes) {
    raise({
      message: "Expected at least one of Directives, UnionMemberTypes",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "extension",
      extensionType: "type",
      typeType: "union",
      name,
      directives,
      unionMemberTypes,
    },
    index,
  ];
}

function parseOptionalUnionMemberTypes(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<string[] | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "=") {
    return [undefined, startIndex];
  }
  if (tokens[index]?.type === "|") {
    index++;
  }
  let type: string | undefined;
  ({ value: type } = expect(tokens[index++], "name"));
  const result = [type];
  while (tokens[index]?.type === "|") {
    index++;
    ({ value: type } = expect(tokens[index++], "name"));
    result.push(type);
  }
  return [result, index];
}

function parseInterfaceTypeExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<InterfaceTypeExtension> {
  let index = startIndex;
  const extend = tokens[index++];
  if (extend?.type !== "name" || extend.value !== "extend") {
    return { message: "Expected extend", tokenNear: extend };
  }
  const interface_ = tokens[index++];
  if (interface_?.type !== "name" || interface_.value !== "interface") {
    return { message: "Expected interface", tokenNear: interface_ };
  }
  const { value: name } = expect(tokens[index++], "name");
  let implementsInterfaces: string[] | undefined;
  [implementsInterfaces, index] = parseOptionalImplementsInterfaces(
    tokens,
    index
  );
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let fieldsDefinition: FieldsDefinition | undefined;
  [fieldsDefinition, index] = parseOptionalFieldsDefinition(tokens, index);
  if (!implementsInterfaces && !directives && !fieldsDefinition) {
    raise({
      message:
        "Expected at least one of ImplementsInterfaces, Directives, fieldsDefinition",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "extension",
      extensionType: "type",
      typeType: "interface",
      name,
      implementsInterfaces,
      directives,
      fieldsDefinition,
    },
    index,
  ];
}

function parseOptionalFieldsDefinition(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<FieldsDefinition | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "{") {
    return [undefined, startIndex];
  }
  let fieldDefinition: FieldDefinition;
  [fieldDefinition, index] = unwrap(parseFieldDefinition(tokens, index));
  const result = [fieldDefinition];
  while (tokens[index]?.type !== "}") {
    [fieldDefinition, index] = unwrap(parseFieldDefinition(tokens, index));
    result.push(fieldDefinition);
  }
  expect(tokens[index++], "}");
  return [result, index];
}

function parseFieldDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<FieldDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  let tmp = tokens[index];
  if (tmp?.type === "string") {
    index++;
    description = tmp.value;
  }
  const { value: name } = expect(tokens[index++], "name");
  let argumentsDefinition: ArgumentsDefinition | undefined;
  [argumentsDefinition, index] = parseOptionalArgumentsDefinition(
    tokens,
    index
  );
  expect(tokens[index++], ":");
  let type: Type;
  [type, index] = unwrap(parseType(tokens, index));
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  return [{ description, name, argumentsDefinition, type, directives }, index];
}

function parseOptionalArgumentsDefinition(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<ArgumentsDefinition | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "(") {
    return [undefined, startIndex];
  }
  let inputValueDefinition: InputValueDefinition;
  [inputValueDefinition, index] = unwrap(
    parseInputValueDefinition(tokens, index)
  );
  const result = [inputValueDefinition];
  while (tokens[index]?.type !== ")") {
    [inputValueDefinition, index] = unwrap(
      parseInputValueDefinition(tokens, index)
    );
    result.push(inputValueDefinition);
  }
  expect(tokens[index++], ")");
  return [result, index];
}

function parseOptionalImplementsInterfaces(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<string[] | undefined> {
  let index = startIndex;
  const implements_ = tokens[index++];
  if (implements_?.type !== "name" || implements_.value !== "implements") {
    return [undefined, startIndex];
  }
  if (tokens[index]?.type === "&") {
    index++;
  }
  let type: string | undefined;
  ({ value: type } = expect(tokens[index++], "name"));
  const result = [type];
  while (tokens[index]?.type === "&") {
    index++;
    ({ value: type } = expect(tokens[index++], "name"));
    result.push(type);
  }
  return [result, index];
}

function parseObjectTypeExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<ObjectTypeExtension> {
  let index = startIndex;
  const extend = tokens[index++];
  if (extend?.type !== "name" || extend.value !== "extend") {
    return { message: "Expected extend", tokenNear: extend };
  }
  const type = tokens[index++];
  if (type?.type !== "name" || type.value !== "type") {
    return { message: "Expected type", tokenNear: type };
  }
  const { value: name } = expect(tokens[index++], "name");
  let implementsInterfaces: string[] | undefined;
  [implementsInterfaces, index] = parseOptionalImplementsInterfaces(
    tokens,
    index
  );
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let fieldsDefinition: FieldsDefinition | undefined;
  [fieldsDefinition, index] = parseOptionalFieldsDefinition(tokens, index);
  if (!implementsInterfaces && !directives && !fieldsDefinition) {
    raise({
      message:
        "Expected at least one of ImplementsInterfaces, Directives, fieldsDefinition",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "extension",
      extensionType: "type",
      typeType: "object",
      name,
      implementsInterfaces,
      directives,
      fieldsDefinition,
    },
    index,
  ];
}

function parseScalarTypeExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<ScalarTypeExtension> {
  let index = startIndex;
  const extend = tokens[index++];
  if (extend?.type !== "name" || extend.value !== "extend") {
    return { message: "Expected extend", tokenNear: extend };
  }
  const scalar = tokens[index++];
  if (scalar?.type !== "name" || scalar.value !== "scalar") {
    return { message: "Expected scalar", tokenNear: scalar };
  }
  const { value: name } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  if (directives) {
    raise({
      message: "Expected Directives",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "extension",
      extensionType: "type",
      typeType: "scalar",
      name,
      directives,
    },
    index,
  ];
}

function parseSchemaExtension(
  tokens: Token[],
  startIndex: number
): ParseResult<SchemaExtension> {
  let index = startIndex;
  const extend = tokens[index++];
  if (extend?.type !== "name" || extend.value !== "extend") {
    return { message: "Expected extend", tokenNear: extend };
  }
  const schema = tokens[index++];
  if (schema?.type !== "name" || schema.value !== "schema") {
    return { message: "Expected schema", tokenNear: schema };
  }
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let rootOperationTypeDefinitions: RootOperationTypeDefinition[] | undefined;
  [rootOperationTypeDefinitions, index] =
    parseOptionalRootOperationTypesDefinition(tokens, index);
  if (!directives && !rootOperationTypeDefinitions) {
    raise({
      message:
        "Expected at least one of Directives, { RootOperationTypeDefinition_list }",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "extension",
      extensionType: "schema",
      directives,
      rootOperationTypeDefinitions,
    },
    index,
  ];
}

function parseOptionalRootOperationTypesDefinition(
  tokens: Token[],
  startIndex: number
): ParseSuccessResult<RootOperationTypeDefinition[] | undefined> {
  let index = startIndex;
  if (tokens[index++]?.type !== "{") {
    return [undefined, startIndex];
  }
  let rootOperationTypeDefinition: RootOperationTypeDefinition;
  [rootOperationTypeDefinition, index] = unwrap(
    parseRootOperationTypeDefinition(tokens, index)
  );
  const result = [rootOperationTypeDefinition];
  while (tokens[index]?.type !== "}") {
    [rootOperationTypeDefinition, index] = unwrap(
      parseRootOperationTypeDefinition(tokens, index)
    );
    result.push(rootOperationTypeDefinition);
  }
  expect(tokens[index++], "}");
  return [result, index];
}

function parseRootOperationTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<RootOperationTypeDefinition> {
  let index = startIndex;
  const current = expect(tokens[index++], "name");
  const operationType = current.value;
  if (!arrayIncludes(operationTypes, operationType)) {
    raise({ message: "Expected OperationType", tokenNear: current });
  }
  expect(tokens[index++], ":");
  const { value: type } = expect(tokens[index++], "name");
  return [{ operationType, type }, index];
}

function parseTypeSystemDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<TypeSystemDefinition> {
  let tmp: ParseResult<TypeSystemDefinition>;
  if (
    Array.isArray((tmp = parseSchemaDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseTypeDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseDirectiveDefinition(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized TypeSystemDefinition",
    tokenNear: tokens[startIndex],
  };
}

function parseDirectiveDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<DirectiveDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    const directive = tokens[index++];
    if (directive?.type !== "name" || directive.value !== "directive") {
      return { message: "Expected directive", tokenNear: directive };
    }
  }
  expect(tokens[index++], "@");
  const { value: name } = expect(tokens[index++], "name");
  let argumentsDefinition: ArgumentsDefinition | undefined;
  [argumentsDefinition, index] = parseOptionalArgumentsDefinition(
    tokens,
    index
  );
  let repeatable = false;
  {
    const maybeRepeatable = tokens[index];
    if (
      maybeRepeatable?.type === "string" &&
      maybeRepeatable.value === "repeatable"
    ) {
      index++;
      repeatable = true;
    }
  }
  {
    const on = expect(tokens[index++], "name");
    if (on.value !== "on") {
      raise({ message: "Expected on", tokenNear: on });
    }
  }
  let directiveLocations: DirectiveLocation[];
  [directiveLocations, index] = unwrap(parseDirectiveLocations(tokens, index));
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "directive",
      description,
      name,
      argumentsDefinition,
      repeatable,
      directiveLocations,
    },
    index,
  ];
}

function parseDirectiveLocations(
  tokens: Token[],
  startIndex: number
): ParseResult<DirectiveLocation[]> {
  let index = startIndex;
  if (tokens[index]?.type === "|") {
    index++;
  }
  let directiveLocation: DirectiveLocation;
  [directiveLocation, index] = unwrap(parseDirectiveLocation(tokens, index));
  const result = [directiveLocation];
  while (tokens[index]?.type === "|") {
    index++;
    [directiveLocation, index] = unwrap(parseDirectiveLocation(tokens, index));
    result.push(directiveLocation);
  }
  return [result, index];
}

function parseDirectiveLocation(
  tokens: Token[],
  startIndex: number
): ParseResult<DirectiveLocation> {
  let index = startIndex;
  const current = tokens[index++];
  if (
    current?.type !== "string" ||
    !arrayIncludes(
      [
        "QUERY",
        "MUTATION",
        "SUBSCRIPTION",
        "FIELD",
        "FRAGMENT_DEFINITION",
        "FRAGMENT_SPREAD",
        "INLINE_FRAGMENT",
        "VARIABLE_DEFINITION",
        "SCHEMA",
        "SCALAR",
        "OBJECT",
        "FIELD_DEFINITION",
        "ARGUMENT_DEFINITION",
        "INTERFACE",
        "UNION",
        "ENUM",
        "ENUM_VALUE",
        "INPUT_OBJECT",
        "INPUT_FIELD_DEFINITION",
      ],
      current.value
    )
  ) {
    return { message: "Expected DirectiveLocation", tokenNear: current };
  }
  return [current.value, index];
}

function parseTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<TypeDefinition> {
  let tmp: ParseResult<TypeDefinition>;
  if (
    Array.isArray((tmp = parseScalarTypeDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseObjectTypeDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseInterfaceTypeDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseUnionTypeDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseEnumTypeDefinition(tokens, startIndex))) ||
    Array.isArray((tmp = parseInputObjectTypeDefinition(tokens, startIndex)))
  ) {
    return tmp;
  }
  return {
    message: "Unrecognized TypeDefinition",
    tokenNear: tokens[startIndex],
  };
}

function parseInputObjectTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<InputObjectTypeDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    let input = tokens[index++];
    if (input?.type !== "name" || input.value !== "input") {
      return { message: "Expected input", tokenNear: input };
    }
  }
  const { value: name } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let inputFieldsDefinition: InputFieldsDefinition | undefined;
  [inputFieldsDefinition, index] = parseOptionalInputFieldsDefinition(
    tokens,
    index
  );
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "type",
      typeType: "inputObject",
      description,
      name,
      directives,
      inputFieldsDefinition,
    },
    index,
  ];
}

function parseEnumTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<EnumTypeDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    let enum_ = tokens[index++];
    if (enum_?.type !== "name" || enum_.value !== "enum") {
      return { message: "Expected enum", tokenNear: enum_ };
    }
  }
  const { value: name } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let enumValuesDefinition: EnumValuesDefinition | undefined;
  [enumValuesDefinition, index] = parseOptionalEnumValuesDefinition(
    tokens,
    index
  );
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "type",
      typeType: "enum",
      description,
      name,
      directives,
      enumValuesDefinition,
    },
    index,
  ];
}

function parseUnionTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<UnionTypeDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    let union = tokens[index++];
    if (union?.type !== "name" || union.value !== "union") {
      return { message: "Expected union", tokenNear: union };
    }
  }
  const { value: name } = expect(tokens[index++], "name");
  let implementsInterfaces: string[] | undefined;
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let unionMemberTypes: string[] | undefined;
  [unionMemberTypes, index] = parseOptionalUnionMemberTypes(tokens, index);
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "type",
      typeType: "union",
      description,
      name,
      directives,
      unionMemberTypes,
    },
    index,
  ];
}

function parseInterfaceTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<InterfaceTypeDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    let interface_ = tokens[index++];
    if (interface_?.type !== "name" || interface_.value !== "interface") {
      return { message: "Expected interface", tokenNear: interface_ };
    }
  }
  const { value: name } = expect(tokens[index++], "name");
  let implementsInterfaces: string[] | undefined;
  [implementsInterfaces, index] = parseOptionalImplementsInterfaces(
    tokens,
    index
  );
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let fieldsDefinition: FieldsDefinition | undefined;
  [fieldsDefinition, index] = parseOptionalFieldsDefinition(tokens, index);
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "type",
      typeType: "interface",
      description,
      name,
      implementsInterfaces,
      directives,
      fieldsDefinition,
    },
    index,
  ];
}

function parseObjectTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<ObjectTypeDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    let type = tokens[index++];
    if (type?.type !== "name" || type.value !== "type") {
      return { message: "Expected type", tokenNear: type };
    }
  }
  const { value: name } = expect(tokens[index++], "name");
  let implementsInterfaces: string[] | undefined;
  [implementsInterfaces, index] = parseOptionalImplementsInterfaces(
    tokens,
    index
  );
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let fieldsDefinition: FieldsDefinition | undefined;
  [fieldsDefinition, index] = parseOptionalFieldsDefinition(tokens, index);
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "type",
      typeType: "object",
      description,
      name,
      implementsInterfaces,
      directives,
      fieldsDefinition,
    },
    index,
  ];
}

function parseScalarTypeDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<ScalarTypeDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    let scalar = tokens[index++];
    if (scalar?.type !== "name" || scalar.value !== "scalar") {
      return { message: "Expected scalar", tokenNear: scalar };
    }
  }
  const { value: name } = expect(tokens[index++], "name");
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "type",
      typeType: "scalar",
      description,
      name,
      directives,
    },
    index,
  ];
}

function parseSchemaDefinition(
  tokens: Token[],
  startIndex: number
): ParseResult<SchemaDefinition> {
  let index = startIndex;
  let description: string | undefined = undefined;
  {
    const maybeDescription = tokens[index];
    if (maybeDescription?.type === "string") {
      index++;
      description = maybeDescription.value;
    }
  }
  {
    const schema = tokens[index++];
    if (schema?.type !== "name" || schema.value !== "schema") {
      return { message: "Expected schema", tokenNear: schema };
    }
  }
  let directives: Directives | undefined;
  [directives, index] = parseOptionalDirectives(tokens, index);
  let rootOperationTypeDefinitions: RootOperationTypeDefinition[] | undefined;
  [rootOperationTypeDefinitions, index] =
    parseOptionalRootOperationTypesDefinition(tokens, index);
  if (!rootOperationTypeDefinitions) {
    raise({
      message: "Expected { RootOperationTypeDefinition_list }",
      tokenNear: tokens[index],
    });
  }
  return [
    {
      type: "typeSystem",
      subType: "definition",
      definitionType: "schema",
      description,
      directives,
      rootOperationTypeDefinitions,
    },
    index,
  ];
}
