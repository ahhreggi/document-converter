# Document Converter API

## 📚 Introduction

An API for converting documents between different formats.

Built using TypeScript, Node, Express. Uses Zod for validation, and `fast-xml-parser` for JSON/XML parsing.

### 💡 How it works

1. **Detect**: The format type of the input data is detected.
2. **Validate**: The input data is validated against a basic schema.
3. **Parse**: The data is parsed into a generic JSON object.
4. **Standardize**: The parsed data is validated again to ensure it conforms to a standardized `DocumentData` type.
5. **Format**: The validated `DocumentData` object is converted to the desired format.

### ✔️ Validating the Parsed Data

1.  `DocumentData` objects must be a non-empty object containing key-value pairs.
2.  All keys must be non-empty strings.
3.  Top-level values must be non-empty arrays containing at least one element.
4.  Elements of the arrays must be non-empty objects containing key-value pairs.
5.  Values in the objects must be strings (the strings may be empty).

    ```js
    // Invalid
    { "A": [], { "B": [], "": ["123"] }, "C": "" }
    // Valid
    { "A": [{ "B": "", "C": "D" }] }
    ```

## 🛠 Installation

**Prerequisites:** Node v18+

1. Clone this repository
   ```
   git clone https://github.com/ahhreggi/document-converter
   ```
2. Navigate to the project directory and install dependencies

   ```
   cd document-converter
   npm install
   ```

3. Run the server
   ```
   npm run dev
   ```

## 🌐 POST `/document/convert`

Converts a document from one format to another.

### Request Body

| Field                | Type               | Required or Optional                                                                    | Description                                                                                              |
| -------------------- | ------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `data`               | `string`, `object` | Required                                                                                | The document data                                                                                        |
| `toFormat`           | `string`           | Required                                                                                | The target format (`json`, `xml`, `string`)                                                              |
| `lineDelimiter`      | `string`           | Required if input data is in string format, optional if `toFormat` is `string`          | Delimiter used to separate lines in the string format (works for both input and output)                  |
| `elementDelimiter`   | `string`           | Required if input data is in string format, optional if `toFormat` is `string`          | Delimiter used to separate elements within a line in the string format (works for both input and output) |
| `minify`             | `boolean`          | Optional, applies only when `toFormat` is `string` or `xml`                             | Whether or not to keep output compact (default: `false`)                                                 |
| `preserveWhitespace` | `boolean`          | Optional, applies only when input data is in string format or converting JSON -> string | Whether or not to preserve element whitespace (default: `false`)                                         |

### Example #1: JSON -> String

```
curl -X POST "localhost:3000/document/convert" \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "ProductID": [
      { "ProductID1": "  4  " },
      { "ProductID1": "a", "ProductID2": "b" }
    ],
    "AddressID": [{ "AddressID1": "42" }],
    "ContactID": [{ "ContactID1": "" }]
  },
  "toFormat": "string",
  "lineDelimiter": "~",
  "elementDelimiter": "*",
  "preserveWhitespace": false,
  "minify": true
}' && echo
```

🟢 Response:

```
ProductID*4~ProductID*a*b~AddressID*42~ContactID*~
```

### Example #2: String -> XML

```
curl -X POST "localhost:3000/document/convert" \
-H "Content-Type: application/json" \
-d '{
  "data": "ProductID*4~ProductID*a*b~AddressID*42~ContactID*~",
  "toFormat": "xml",
  "lineDelimiter": "~",
  "elementDelimiter": "*",
  "minify": true
}' && echo
```

🟢 Response:

```xml
<?xml version="1.0" encoding="UTF-8" ?><root><ProductID><ProductID1>4</ProductID1></ProductID><ProductID><ProductID1>a</ProductID1><ProductID2>b</ProductID2></ProductID><AddressID><AddressID1>42</AddressID1></AddressID><ContactID><ContactID1></ContactID1></ContactID></root>
```

### Example #3: XML -> JSON

```
curl -X POST "localhost:3000/document/convert" \
-H "Content-Type: application/json" \
-d '{
  "data": "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><root><ProductID><ProductID1>4</ProductID1></ProductID><ProductID><ProductID1>a</ProductID1><ProductID2>b</ProductID2></ProductID><AddressID><AddressID1>42</AddressID1></AddressID><ContactID><ContactID1></ContactID1></ContactID></root>",
  "toFormat": "json"
}' && echo
```

🟢 Response:

```json
{
  "ProductID": [
    { "ProductID1": "4" },
    { "ProductID1": "a", "ProductID2": "b" }
  ],
  "AddressID": [{ "AddressID1": "42" }],
  "ContactID": [{ "ContactID1": "" }]
}
```

### Example #4: String (minified) -> String (prettified)

```
curl -X POST "localhost:3000/document/convert" \
-H "Content-Type: application/json" \
-d '{
  "data": "ProductID*4~ProductID*a*b~AddressID*42~ContactID*~",
  "toFormat": "string",
  "lineDelimiter": "~",
  "elementDelimiter": "*",
  "minify": false
}' && echo
```

🟢 Response:

```
ProductID*4~
ProductID*a*b~
AddressID*42~
ContactID*~
```

## ❌ Error Handling

The endpoint will respond with a `Validation Error` and some additional context if the request or input data is invalid.

### Example #1: Invalid XML

The input `data` is missing closing bracket on `</root>`.

```
curl -X POST "localhost:3000/document/convert" \
-H "Content-Type: application/json" \
-d '{
  "data": "<root><A><A1>1</A1></A></root",
  "toFormat": "json"
}' && echo
```

🔴 Response:

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": ["data"],
      "message": "Invalid XML document",
      "detectedInputFormat": "xml"
    }
  ]
}
```

### Example #2: Invalid DocumentData Structure

The input `data` passes initial input validation since it's valid XML, but fails validation after parsing due to not conforming to the `DocumentData` type. In this case, Segment "B" doesn't have at least one element.

```
curl -X POST "localhost:3000/document/convert" \
-H "Content-Type: application/json" \
-d '{
  "data": "<root><A><A1>1</A1></A><B></B></root>",
  "toFormat": "string"
}' && echo
```

🔴 Response:

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": ["B"],
      "message": "Segment must contain at least one element",
      "detectedInputFormat": "xml"
    }
  ]
}
```

### Example #3: Failed to Detect Input Format Type

The input `data` doesn't contain enough information to be detected as any of the available format types.

```
curl -X POST "localhost:3000/document/convert" \
-H "Content-Type: application/json" \
-d '{
  "data": "",
  "toFormat": "string"
}' && echo
```

🔴 Response:

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": ["data"],
      "message": "Failed to detect a valid input format type",
      "detectedInputFormat": "unknown"
    }
  ]
}
```
