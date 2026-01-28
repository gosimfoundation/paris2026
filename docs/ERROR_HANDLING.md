# Error Handling and Validation System

This document describes the comprehensive error handling and validation system implemented for the bilingual schedule unification feature.

## Overview

The error handling system provides multiple layers of validation and graceful error recovery to ensure the bilingual schedule system remains functional even when data issues occur.

## Components

### 1. Data Validation (`src/utils/bilingual.ts`)

#### Core Validation Functions

- **`validateBilingualText()`** - Validates bilingual text objects
- **`validateBilingualSpeaker()`** - Validates speaker data structure
- **`validateBilingualSession()`** - Validates session data structure
- **`validateBilingualCategory()`** - Validates category data structure
- **`validateBilingualScheduleData()`** - Validates complete schedule data

#### Safe Processing Functions

- **`safeGetBilingualText()`** - Safely extracts text with error handling
- **`safeProcessBilingualSchedule()`** - Processes schedule data with error recovery

#### Error Reporting

- **`formatValidationErrors()`** - Formats validation errors for display
- **`logValidationResults()`** - Logs validation results to console

### 2. JSON Schema Validation (`src/json/bilingual-schedule-schema.json`)

Provides JSON Schema validation for:
- Data structure validation
- Required field checking
- Type validation
- Pattern matching for IDs

### 3. Build-Time Validation (`scripts/validate-schedule.js`)

- Validates schedule data during build process
- Provides detailed error reporting
- Generates statistics about the data
- Can be run standalone or as part of build process

### 4. Runtime Error Handling (`src/components/BilingualSchedule.astro`)

- Displays error messages to users when data issues occur
- Gracefully degrades functionality when translations are missing
- Provides fallback content for missing data

## Usage

### Running Validation

```bash
# Validate the bilingual schedule file
npm run validate-schedule:bilingual

# Run error handling tests
npm run test-error-handling

# Validate any JSON file
node scripts/validate-schedule.js path/to/file.json
```

### Build Integration

Validation runs automatically before builds:

```bash
npm run build  # Automatically runs validation first
```

### Development Usage

```typescript
import {
  validateBilingualScheduleData,
  safeGetBilingualText,
  safeProcessBilingualSchedule
} from '../utils/bilingual.js'

// Validate data
const validation = validateBilingualScheduleData(scheduleData)
if (!validation.isValid) {
  console.error('Validation failed:', validation.errors)
}

// Safe text extraction with error handling
const handleError = (error: string, context?: string) => {
  console.warn(`Error: ${error}`, context)
}

const text = safeGetBilingualText(
  bilingualTextObject,
  'en',
  'Fallback text',
  handleError
)
```

## Error Types

### Validation Errors (Critical)

These prevent the system from functioning properly:

- Missing required fields
- Invalid data types
- Malformed JSON structure
- Empty required arrays/objects

### Validation Warnings (Non-Critical)

These indicate potential issues but don't break functionality:

- Missing translations
- Placeholder images
- Orphaned data references
- Unusual time slot formats

### Runtime Errors

Handled gracefully with fallbacks:

- Network failures loading data
- Corrupted data during processing
- Missing image files
- Invalid URL generation

## Error Recovery Strategies

### 1. Graceful Degradation

When translations are missing:
- Fall back to available language
- Display fallback text
- Continue rendering other content

### 2. Safe Defaults

When data is malformed:
- Use safe default values
- Skip invalid entries
- Maintain overall functionality

### 3. User Feedback

When errors occur:
- Display helpful error messages
- Provide context about the issue
- Suggest potential solutions

## Configuration

### Error Display

Control error message display in components:

```astro
---
const showErrors = import.meta.env.DEV // Only show in development
---

{showErrors && errorMessages.length > 0 && (
  <div class="error-messages">
    <!-- Error display -->
  </div>
)}
```

### Validation Strictness

Configure validation behavior:

```typescript
// Strict mode - fail on warnings
const validation = validateBilingualScheduleData(data)
if (!validation.isValid || validation.warnings.length > 0) {
  throw new Error('Validation failed')
}

// Lenient mode - only fail on errors
if (!validation.isValid) {
  throw new Error('Validation failed')
}
```

## Testing

### Automated Tests

Run the test suite:

```bash
npm run test-error-handling
```

### Manual Testing

Test with malformed data:

```javascript
// Test with missing translations
const partialData = {
  title: { en: "English only", zh: "" }
}

// Test with invalid structure
const invalidData = {
  sessions: "not an object"
}
```

## Best Practices

### 1. Always Use Safe Functions

```typescript
// ❌ Direct access (can throw errors)
const text = textObj.en

// ✅ Safe access with fallback
const text = safeGetBilingualText(textObj, 'en', 'Fallback')
```

### 2. Validate Early

```typescript
// Validate data as soon as it's loaded
const validation = validateBilingualScheduleData(scheduleData)
if (!validation.isValid) {
  // Handle errors before processing
}
```

### 3. Provide Context

```typescript
// Include context in error messages
const handleError = (error: string, context?: string) => {
  console.error(`[${context || 'Unknown'}] ${error}`)
}
```

### 4. Log Warnings

```typescript
// Don't ignore warnings - they indicate potential issues
if (validation.warnings.length > 0) {
  logValidationResults(validation, 'Schedule Loading')
}
```

## Troubleshooting

### Common Issues

1. **Build fails with validation errors**
   - Check the validation output for specific errors
   - Fix data issues in the JSON files
   - Ensure all required fields are present

2. **Missing translations in UI**
   - Check for validation warnings about missing translations
   - Verify bilingual text objects have both `en` and `zh` properties
   - Use safe text extraction functions

3. **Runtime errors in components**
   - Check browser console for error messages
   - Verify error handling is properly implemented
   - Ensure fallback values are provided

### Debug Mode

Enable detailed error logging:

```typescript
const DEBUG = true
const handleError = (error: string, context?: string) => {
  if (DEBUG) {
    console.error(`[DEBUG] ${context || 'Unknown'}: ${error}`)
  }
}
```

## Future Improvements

- Add more granular validation rules
- Implement automatic data repair for common issues
- Add performance monitoring for validation
- Create visual validation reports
- Add integration with CI/CD pipelines

## Related Files

- `src/utils/bilingual.ts` - Core validation and error handling
- `src/json/bilingual-schedule-schema.json` - JSON schema definition
- `scripts/validate-schedule.js` - Build-time validation script
- `scripts/test-error-handling.js` - Test suite
- `src/components/BilingualSchedule.astro` - Runtime error handling