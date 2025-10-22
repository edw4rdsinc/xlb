# XLB Codebase Refactoring Recommendations

**Generated:** October 22, 2025
**Codebase:** XL Benefits Next.js Application
**Current State:** 115 TypeScript/TSX files, 34 pages, 50+ components

## Executive Summary

The codebase is a well-structured Next.js application with good security practices for core calculators. However, significant refactoring opportunities exist to improve maintainability, reduce code duplication, and enhance type safety. The highest priority issues involve removing duplicate component implementations and extracting common patterns into reusable hooks.

## Critical Priority Refactoring (Security & Stability)

### 1. Complete Security Implementation
- **Enable CAPTCHA** on all calculator endpoints (currently disabled with TODO)
- **Implement audit logging** to Supabase (currently commented out)
- **Add rate limiting** to fantasy football submission endpoint
- **Validate environment variables** on application startup using Zod

### 2. Standardize Error Handling
Create a consistent error response format across all API endpoints:
```typescript
// lib/api/errors.ts
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}
```

## High Priority Refactoring (Maintainability)

### 1. Remove Duplicate Calculator Components

**Action:** Delete client-side calculator versions and keep only secure versions:
- Delete: `/components/tools/FIECalculator.tsx`
- Delete: `/components/tools/DeductibleAnalyzer.tsx`
- Keep: `/components/tools/FIECalculatorSecure.tsx`
- Keep: `/components/tools/DeductibleAnalyzerSecure.tsx`

### 2. Extract Wizard Logic into Reusable Hooks

Create a set of composable hooks for wizard functionality:

```typescript
// lib/hooks/useWizard.ts
export function useWizard<T>(config: WizardConfig<T>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useSessionStorage<T>(config.storageKey, config.initialData);
  const validation = useWizardValidation(config.schema, data);
  const navigation = useWizardNavigation(config.totalSteps);

  return {
    currentStep,
    data,
    updateData,
    validation,
    navigation,
    isLastStep: currentStep === config.totalSteps
  };
}
```

### 3. Create Session Storage Utility Hook

Replace repeated session storage patterns with a reusable hook:

```typescript
// lib/hooks/useSessionStorage.ts
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const remove = () => {
    sessionStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, remove] as const;
}
```

### 4. Consolidate Form Components

Create a component library for consistent form inputs:

```typescript
// components/ui/forms/
├── FormInput.tsx
├── FormSelect.tsx
├── FormTextarea.tsx
├── FormDatePicker.tsx
└── index.ts
```

### 5. Fix TypeScript Type Safety Issues

Replace all `any` types with proper TypeScript definitions:
- Share Zod schemas between client and server
- Create proper type exports from calculation modules
- Use strict TypeScript configuration

## Medium Priority Refactoring (Code Quality)

### 1. Add Comprehensive Documentation

Add JSDoc comments to all API routes:
```typescript
/**
 * Calculate FIE insurance costs
 * @route POST /api/calculators/fie/calculate
 * @param {FIECalculatorInput} body - Calculator input data
 * @returns {FIECalculatorOutput} Calculated results
 * @rateLimit 5 requests per minute
 */
```

### 2. Extract Configuration

Move hard-coded values to configuration:
```typescript
// lib/config/calculator-defaults.ts
export const FIE_DEFAULTS = {
  adminPEPM: 35,
  specificDeductible: 100000,
  aggregateCorridor: 1.25,
  aggregateRate: 15,
} as const;
```

### 3. Implement Component Testing

Add test coverage for critical calculation logic:
```typescript
// lib/fie-calculator/__tests__/calculations.test.ts
describe('FIE Calculations', () => {
  test('calculates expected premium correctly', () => {
    // Test implementation
  });
});
```

### 4. Create Validation Schemas Library

Consolidate all Zod schemas:
```typescript
// lib/validation/schemas/
├── fie-calculator.schema.ts
├── deductible-analyzer.schema.ts
├── fantasy-football.schema.ts
└── index.ts
```

## Low Priority Refactoring (Nice-to-Have)

### 1. Implement Caching Strategy
- Add Redis for production rate limiting
- Cache calculator results for identical inputs
- Implement API response caching

### 2. Add Analytics Tracking
- Track wizard completion rates
- Monitor API endpoint usage
- Implement error tracking (Sentry)

### 3. Performance Optimizations
- Lazy load heavy components
- Implement virtual scrolling for large lists
- Add image optimization

## Recommended Refactoring Sequence

### Phase 1: Security & Cleanup (Week 1)
1. Enable CAPTCHA on production
2. Implement audit logging
3. Remove duplicate calculator components
4. Add environment variable validation

### Phase 2: Core Refactoring (Week 2-3)
1. Extract wizard hooks
2. Create session storage utility
3. Build form component library
4. Fix TypeScript type issues

### Phase 3: Quality Improvements (Week 4)
1. Add JSDoc documentation
2. Extract configuration values
3. Implement initial test suite
4. Standardize error handling

### Phase 4: Polish (Ongoing)
1. Add caching layer
2. Implement analytics
3. Performance optimizations
4. Create component documentation

## File Structure After Refactoring

```
xlb/
├── app/                      # Pages only
├── components/
│   ├── ui/                   # Generic UI components
│   │   ├── forms/           # Form components
│   │   ├── feedback/        # Loading, error, success
│   │   └── layout/          # Header, footer, etc.
│   ├── features/            # Feature-specific components
│   │   ├── calculators/     # Calculator wizards
│   │   └── fantasy-football/
│   └── shared/              # Shared patterns
├── lib/
│   ├── api/
│   │   ├── handlers/        # API route handlers
│   │   ├── security/        # Security middleware
│   │   └── errors.ts        # Error handling
│   ├── hooks/               # Custom React hooks
│   │   ├── useWizard.ts
│   │   ├── useSessionStorage.ts
│   │   └── useCalculatorAPI.ts
│   ├── validation/          # Zod schemas
│   ├── config/              # Configuration
│   └── utils/               # Utilities
└── __tests__/               # Test files
```

## Expected Outcomes

After implementing these refactoring recommendations:

1. **Code Reduction:** ~30% less code through elimination of duplication
2. **Type Safety:** 100% TypeScript coverage with no `any` types
3. **Maintainability:** Clear separation of concerns and single responsibility
4. **Testing:** Minimum 70% coverage for business logic
5. **Security:** Complete implementation of all security features
6. **Performance:** Improved load times through lazy loading and caching
7. **Developer Experience:** Easier onboarding and faster feature development

## Metrics to Track

- Bundle size reduction
- Time to implement new features
- Bug reports per release
- API response times
- Wizard completion rates
- Code coverage percentage

## Next Steps

1. Review and prioritize recommendations with the team
2. Create detailed tickets for each refactoring task
3. Establish refactoring sprints alongside feature development
4. Set up monitoring for quality metrics
5. Document architectural decisions as you go

## Additional Resources Needed

- Redis instance for production rate limiting
- Error tracking service (Sentry or similar)
- Analytics platform (Plausible is already integrated)
- CI/CD pipeline for automated testing
- Documentation platform for component library