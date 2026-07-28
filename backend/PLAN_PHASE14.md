# Phase 14 – Validation & Request Sanitization Plan

## Information Gathered

- **Current State**: All 13 modules have individual validators using `express-validator`. Some routes have a local `checkValidation` middleware (contact, partners, newsletter, uploads), others rely on the global `sanitizeAndValidate` middleware in `app.js`.
- **Global Middleware**: `src/middleware/security/sanitizeAndValidate.js` uses `express-mongo-sanitize` and `validationResult` but does NOT format errors in the standardized format.
- **Error Format**: Current validation errors return `{ success: false, message, details: [...] }` via `BadRequestError`. Target format: `{ success: false, message: "Validation Failed", errors: [{ field, message }] }`.
- **Duplicate Logic**: `checkValidation` function is duplicated across 4 route files (contact, partners, newsletter, uploads).
- **No Shared Schemas**: Each module defines its own validator patterns (email, pagination, etc.) leading to code duplication.
- **No Input Sanitization Pipeline**: No centralized HTML escaping, script removal, whitespace normalization, etc.

## Plan

### NEW FILES TO CREATE

1. **`src/utils/validationHelpers.js`** – Reusable validation helper functions
   - `isValidEmail(value)`, `isValidPhone(value)`, `isValidPassword(value)`
   - `isValidSlug(value)`, `isValidUUID(value)`, `isValidObjectId(value)`
   - `isValidURL(value)`, `isValidStatus(value, enums)`
   - `isValidDateRange(from, to)`
   - Sanitization functions: `trimFields`, `escapeHtml`, `stripScriptTags`, `normalizeEmail`, `normalizeURL`, `normalizePhone`, `removeDuplicateSpaces`, `emptyStringToNull`
   - `formatValidationError(error)` – formats express-validator errors to `{ field, message }`
   - `formatValidationErrors(errors)` – batch format

2. **`src/utils/validationSchemas.js`** – Shared validation rule presets
   - `emailRule(field = 'email', required = true)`, `passwordRule(min = 8)`
   - `phoneRule(required = false)`, `slugRule(field = 'slug', required = false)`
   - `nameRule(field, required, min, max)`, `urlRule(required = false)`
   - `idParamRule()`, `uuidParamRule()`, `slugParamRule()`
   - `paginationRules()` – page, limit
   - `sortingRules(allowedFields)` – sortBy, sortOrder
   - `filteringRules()` – q, status, active
   - `dateRangeRules()` – dateFrom, dateTo
   - `seoRules()` – seo object validation
   - `booleanRule(field)`, `numericRule(field)`, `arrayRule(field)`, `objectRule(field)`
   - `enumRule(field, enums)`, `statusRule(field, enums)`

3. **`src/modules/validation/validators.js`** – Module-specific composite validators built from shared schemas
   - Re-exports all validators from each module, wrapping them with standardized error formatting
   - Provides `validate(schema)` helper that combines rules + sanitization + error formatting

4. **`src/modules/validation/validationService.js`** – Business logic for validation processing
   - `validateRequest(rules, data)` – runs rules against data
   - `sanitizeObject(obj, schema)` – recursively sanitizes object fields
   - `checkAllowedProperties(obj, allowed)` – strips unexpected properties
   - `validatePayloadSize(payload, maxBytes)`

5. **`src/modules/validation/validationController.js`** – (Optional) Validation health/test endpoint

6. **`src/modules/validation/index.js`** – Module exports

7. **`src/middleware/validation/validateRequest.js`** – Central validation middleware
   - Accepts array of validation rules
   - Runs validation, sanitizes input, formats errors in standardized format
   - Returns 422 with `{ success: false, message: "Validation Failed", errors: [...] }`

8. **`src/middleware/validation/sanitizeInput.js`** – Input sanitization middleware
   - Trims whitespace on all string fields
   - Escapes HTML entities
   - Removes `<script>` tags
   - Normalizes line breaks
   - Removes duplicate spaces
   - Converts empty strings to null where appropriate
   - Strips unexpected properties based on schema

9. **`src/middleware/validation/normalizeInput.js`** – Input normalization middleware
   - Normalizes emails (lowercase, trim)
   - Normalizes URLs
   - Normalizes phone numbers
   - Converts types (string booleans to actual booleans, string numbers to numbers)

### FILES TO UPDATE

10. **`src/app.js`** – Update to use new centralized validation middleware, keep legacy middleware for backward compatibility

11. **`src/middleware/security/sanitizeAndValidate.js`** – Update/Enhance to delegate to new validation system

12. **`src/middleware/error/errorHandler.js`** – Update to handle standardized validation error format (422)

13. **All Route Files** – Replace local `checkValidation` with centralized `validateRequest` middleware
    - `src/routes/v1/auth.routes.js`
    - `src/routes/v1/users.routes.js`
    - `src/routes/v1/cms.routes.js`
    - `src/routes/v1/markets.routes.js`
    - `src/routes/v1/platforms.routes.js`
    - `src/routes/v1/blog.routes.js`
    - `src/routes/v1/contact.routes.js`
    - `src/routes/v1/newsletter.routes.js`
    - `src/routes/v1/careers.routes.js`
    - `src/routes/v1/partners.routes.js`
    - `src/routes/v1/uploads.routes.js`
    - `src/routes/v1/dashboard.routes.js`
    - `src/routes/v1/search.routes.js`

14. **All Module Validators** – Refactor to use shared schemas from `validationSchemas.js`
    - Keep module-specific validators but reuse shared rules

15. **`src/middleware/error/customErrors.js`** – Add `ValidationError` class (422)

16. **Swagger docs** – Update to include standardized error response schemas

### KEY DESIGN DECISIONS

- **Backward Compatibility**: Existing validators continue to work. New system wraps/enhances them.
- **Centralized Error Formatting**: All validation errors go through `formatValidationErrors()` for consistent output.
- **Middleware Chain**: sanitizeInput → normalizeInput → validateRequest
- **No Breaking Changes**: Existing validators remain in place; we add the centralized layer on top.
- **Unified `checkValidation`**: Replace 4 duplicate `checkValidation` functions with single `validateRequest` middleware.
- **Module `validators.js` files stay**: They keep their module-specific rules but may import shared rules from `validationSchemas.js`.

### DEPENDENT FILES TO EDIT SUMMARY

| File | Change |
|------|--------|
| `src/app.js` | Add centralized validation middleware |
| `src/middleware/security/sanitizeAndValidate.js` | Enhance to delegate to new system |
| `src/middleware/error/errorHandler.js` | Handle 422 ValidationError |
| `src/middleware/error/customErrors.js` | Add ValidationError class |
| `src/routes/v1/auth.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/users.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/cms.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/markets.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/platforms.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/blog.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/contact.routes.js` | Replace local checkValidation with validateRequest |
| `src/routes/v1/newsletter.routes.js` | Replace local checkValidation with validateRequest |
| `src/routes/v1/careers.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/partners.routes.js` | Replace local checkValidation with validateRequest |
| `src/routes/v1/uploads.routes.js` | Replace local checkValidation with validateRequest |
| `src/routes/v1/dashboard.routes.js` | Replace inline checks with validateRequest |
| `src/routes/v1/search.routes.js` | Replace inline checks with validateRequest |

### FOLLOW-UP STEPS

1. Verify app starts successfully before changes
2. Create all new files
3. Update all existing files
4. Verify app starts successfully after changes
5. Run manual verification of validation endpoints

