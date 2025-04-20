export type Document = Definition[];

export type ExecutableDocument = ExecutableDefinition[];

export type TypeSystemDocument = TypeSystemDefinition[];

export type TypeSystemExtensionDocument = TypeSystemDefinitionOrExtension[];

export type Definition = ExecutableDefinition | TypeSystemDefinitionOrExtension;

export interface ExecutableDefinitionBase {
  type: "executable";
  directives: Directives;
  selectionSet: SelectionSet;
}

export interface OperationDefinition extends ExecutableDefinitionBase {
  subType: "operation";
  operationType: OperationType | undefined;
  name: string | undefined;
  variableDefinitions: VariableDefinitions;
}

export type OperationType = "query" | "mutation" | "subscription";

export type SelectionSet = Selection[];

export type Selection = Field | FragmentSpread | InlineFragment;

export interface Field {
  type: "field";
  alias: string | undefined;
  name: string;
  arguments: Arguments;
  directives: Directives;
  selectionSet: SelectionSet | undefined;
}

export type Arguments = Argument[];

export interface Argument {
  name: string;
  value: Value;
}

export interface FragmentSpread {
  type: "fragmentSpread";
  name: string;
  directives: Directives;
}

export interface InlineFragment {
  type: "inlineFragment";
  typeCondition: string | undefined;
  directives: Directives;
  selectionSet: SelectionSet;
}

export interface FragmentDefinition extends ExecutableDefinitionBase {
  subType: "fragment";
  name: string;
  typeCondition: string;
}

export type Value =
  | Variable
  | NumberValue
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

export interface NumberValue {
  type: "number";
  value: string;
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
  value: Argument[];
}

export type VariableDefinitions = VariableDefinition[];

export interface VariableDefinition {
  name: string;
  type: Type;
  defaultValue: Value | undefined;
  directives: Directives;
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
  arguments: Arguments;
}

export type ExecutableDefinition = OperationDefinition | FragmentDefinition;

export interface TypeSystemDefinitionOrExtensionBase {
  type: "typeSystem";
}

export interface TypeSystemDefinitionBase
  extends TypeSystemDefinitionOrExtensionBase {
  subType: "definition";
  description: string | undefined;
}

export interface SchemaDefinition extends TypeSystemDefinitionBase {
  definitionType: "schema";
  description: string | undefined;
  directives: Directives;
  rootOperationTypeDefinitions: RootOperationTypeDefinition[];
}

export interface RootOperationTypeDefinition {
  operationType: OperationType;
  type: string;
}

export interface TypeDefinitionBase extends TypeSystemDefinitionBase {
  definitionType: "type";
  name: string;
  directives: Directives;
}

export interface ScalarTypeDefinition extends TypeDefinitionBase {
  typeType: "scalar";
}

export interface ObjectTypeDefinition extends TypeDefinitionBase {
  typeType: "object";
  implementsInterfaces: string[];
  fieldsDefinition: FieldsDefinition;
}

export type FieldsDefinition = FieldDefinition[];

export interface FieldDefinition {
  description: string | undefined;
  name: string;
  argumentsDefinition: ArgumentsDefinition;
  type: Type;
  directives: Directives;
}

export type ArgumentsDefinition = InputValueDefinition[];

export interface InputValueDefinition {
  description: string | undefined;
  name: string;
  type: Type;
  defaultValue: Value | undefined;
  directives: Directives;
}

export interface InterfaceTypeDefinition extends TypeDefinitionBase {
  typeType: "interface";
  implementsInterfaces: string[];
  fieldsDefinition: FieldsDefinition;
}

export interface UnionTypeDefinition extends TypeDefinitionBase {
  typeType: "union";
  unionMemberTypes: string[];
}

export interface EnumTypeDefinition extends TypeDefinitionBase {
  typeType: "enum";
  enumValuesDefinition: EnumValuesDefinition;
}

export type EnumValuesDefinition = EnumValueDefinition[];

export interface EnumValueDefinition {
  description: string | undefined;
  enumValue: string;
  directives: Directives;
}

export interface InputObjectTypeDefinition extends TypeDefinitionBase {
  typeType: "inputObject";
  inputFieldsDefinition: InputFieldsDefinition;
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
  argumentsDefinition: ArgumentsDefinition;
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
  directives: Directives;
  rootOperationTypeDefinitions: RootOperationTypeDefinition[];
}

export interface TypeExtensionBase extends TypeSystemExtensionBase {
  extensionType: "type";
  name: string;
  directives: Directives;
}

export interface ScalarTypeExtension extends TypeExtensionBase {
  typeType: "scalar";
}

export interface ObjectTypeExtension extends TypeExtensionBase {
  typeType: "object";
  implementsInterfaces: string[];
  fieldsDefinition: FieldsDefinition;
}

export interface InterfaceTypeExtension extends TypeExtensionBase {
  typeType: "interface";
  implementsInterfaces: string[];
  fieldsDefinition: FieldsDefinition;
}

export interface UnionTypeExtension extends TypeExtensionBase {
  typeType: "union";
  unionMemberTypes: string[];
}

export interface EnumTypeExtension extends TypeExtensionBase {
  typeType: "enum";
  enumValuesDefinition: EnumValuesDefinition;
}

export interface InputObjectTypeExtension extends TypeExtensionBase {
  typeType: "inputObject";
  inputFieldsDefinition: InputFieldsDefinition;
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
