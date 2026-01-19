# Filters and Eligibility Checking

This document explains the filter system and eligibility checking logic.

## Overview

The filter system checks user eligibility against project criteria in a specific order, with slash protection as a hard fail condition.

## Checking Order

1. **Slash Protection** (Hard Reject) - If user has been slashed on Ethos, they are permanently ineligible
2. **Score Check** - User score must meet minimum
3. **Vouches Check** - User must have minimum vouches (older than 24h)
4. **Review Balance** - Positive reviews must exceed negative (if required)
5. **Account Age** - Account must be older than minimum age

## Usage

### Basic Eligibility Check

```typescript
import { checkEligibility } from '@/lib/filters'

const userProfile = {
  profileId: 12345,
  username: 'alice.eth',
  score: 1650,
  vouches: 3,
  positiveReviews: 15,
  negativeReviews: 2,
  accountAge: 45,
  hasSlashProtection: true
}

const criteria = {
  minScore: 1400,
  minVouches: 1,
  positiveReviews: true,
  minAccountAge: 7
}

const result = checkEligibility(userProfile, criteria, false)

if (result.status === 'accepted') {
  console.log('User is eligible!')
} else if (result.status === 'rejected') {
  console.log('Rejected:', result.reason)
  console.log('Failed:', result.failedCriteria)
} else if (result.status === 'pending') {
  console.log('Pending manual review')
}
```

### Example Results

**Accepted:**
```javascript
{
  eligible: true,
  status: 'accepted',
  reason: 'All criteria met - access granted'
}
```

**Rejected (Multiple Failures):**
```javascript
{
  eligible: false,
  status: 'rejected',
  reason: 'Score 1180 is below minimum 1400; Vouches 0 is below minimum 1',
  failedCriteria: [
    'Score 1180 is below minimum 1400',
    'Vouches 0 is below minimum 1'
  ]
}
```

**Rejected (Slashed):**
```javascript
{
  eligible: false,
  status: 'rejected',
  reason: 'Account has been slashed on Ethos Network. This is a permanent disqualification.',
  failedCriteria: ['Slash protection failed']
}
```

**Pending Manual Review:**
```javascript
{
  eligible: true,
  status: 'pending',
  reason: 'Application meets all criteria and is pending manual review'
}
```

## Filter Presets

### Basic Filter
```typescript
import { getFilterPreset } from '@/lib/filters'

const basic = getFilterPreset('basic')
// {
//   minScore: 1200,
//   minVouches: 0,
//   positiveReviews: false,
//   minAccountAge: 0
// }
// ~70% pass rate
```

### Standard Filter (Recommended)
```typescript
const standard = getFilterPreset('standard')
// {
//   minScore: 1400,
//   minVouches: 1,
//   positiveReviews: true,
//   minAccountAge: 7
// }
// ~35% pass rate
```

### Strict Filter
```typescript
const strict = getFilterPreset('strict')
// {
//   minScore: 1600,
//   minVouches: 2,
//   positiveReviews: true,
//   minAccountAge: 30
// }
// ~10% pass rate
```

## Helper Functions

### Format Criteria for Display

```typescript
import { formatCriteria } from '@/lib/filters'

const criteria = {
  minScore: 1400,
  minVouches: 1,
  positiveReviews: true,
  minAccountAge: 7
}

const formatted = formatCriteria(criteria)
// [
//   'Ethos Score minimum 1400',
//   'At least 1 vouch (older than 24h)',
//   'Positive review balance',
//   'Account age: 7+ days'
// ]
```

### Estimate Pass Rate

```typescript
import { estimatePassRate } from '@/lib/filters'

const rate = estimatePassRate(criteria)
// Returns estimated percentage (e.g., 35)
```

### Validate Criteria

```typescript
import { validateCriteria } from '@/lib/filters'

const criteria = {
  minScore: 5000, // Invalid - too high
  minVouches: -1,  // Invalid - negative
  positiveReviews: true,
  minAccountAge: 7
}

const validation = validateCriteria(criteria)
// {
//   valid: false,
//   errors: [
//     'Minimum score must be between 0 and 3000',
//     'Minimum vouches must be between 0 and 100'
//   ]
// }
```

### Get Criterion Name

```typescript
import { getCriterionName } from '@/lib/filters'

getCriterionName('score 1400 is below minimum')
// Returns: 'Ethos Score'

getCriterionName('vouches 0 is below minimum')
// Returns: 'Vouches'
```

## Integration with Validation

The `validation.ts` module uses `filters.ts` internally:

```typescript
import { validateCriteria } from '@/lib/validation'

const profile = {
  profileId: 12345,
  username: 'alice.eth',
  score: 1650,
  vouches: 3,
  positiveReviews: 15,
  negativeReviews: 2,
  accountAge: 45,
  hasSlashProtection: true
}

const result = validateCriteria(profile, criteria, false)
// Returns ValidationResult compatible with existing code
```

## Criteria Limits

**Score:**
- Min: 0
- Max: 3000
- Typical range: 1000-2000

**Vouches:**
- Min: 0
- Max: 100
- Note: Only vouches older than 24h count

**Review Balance:**
- Boolean flag
- If true, requires positive reviews > negative reviews

**Account Age:**
- Min: 0 days
- Max: 1000 days
- Common values: 0, 7, 30, 90 days

## Slash Protection

**What is slashing?**
- Ethos Network can "slash" users for malicious behavior
- This is a permanent mark on their reputation
- Slashed users are automatically rejected from all projects

**Implementation:**
```typescript
// Check if user has slash protection
if (userProfile.hasSlashProtection === false) {
  // Hard reject - no appeal possible
  return {
    eligible: false,
    status: 'rejected',
    reason: 'Account has been slashed on Ethos Network'
  }
}
```

**Note:** If `hasSlashProtection` is undefined or not provided, it defaults to `true` (user is not slashed).

## Manual Review Flow

When `manualReview` is enabled:

1. User applies
2. Criteria are checked
3. If criteria PASS → Status = "pending"
4. If criteria FAIL → Status = "rejected"
5. Admin reviews pending applications
6. Admin manually accepts or rejects

```typescript
// With manual review enabled
const result = checkEligibility(profile, criteria, true)

if (result.status === 'pending') {
  // Show "Your application is under review"
  // Store in database with status='pending'
  // Admin will review later
}
```

## Example: Complete Flow

```typescript
import { checkEligibility, formatCriteria } from '@/lib/filters'

// 1. Get user profile from Ethos
const userProfile = await getEthosUserByProfileId(profileId)

// 2. Get project criteria
const project = await getProjectBySlug('defi-protocol')

// 3. Check eligibility
const result = checkEligibility(
  {
    profileId: userProfile.profileId,
    username: userProfile.username,
    score: userProfile.score,
    vouches: userProfile.vouches,
    positiveReviews: userProfile.positiveReviews,
    negativeReviews: userProfile.negativeReviews,
    accountAge: calculateAccountAge(userProfile.createdAt),
    hasSlashProtection: userProfile.hasSlashProtection
  },
  project.criteria,
  project.manual_review
)

// 4. Handle result
if (result.status === 'accepted') {
  // Grant access
  return {
    message: 'Congratulations! You have access.',
    destinationUrl: project.destination_url
  }
} else if (result.status === 'rejected') {
  // Show rejection message
  return {
    message: result.reason,
    failedCriteria: result.failedCriteria,
    canReapplyAt: addDays(new Date(), 30)
  }
} else if (result.status === 'pending') {
  // Show pending message
  return {
    message: 'Your application is under review'
  }
}
```

## Testing

```typescript
import { checkEligibility } from '@/lib/filters'

describe('checkEligibility', () => {
  it('should reject slashed users', () => {
    const result = checkEligibility(
      { ...validProfile, hasSlashProtection: false },
      criteria,
      false
    )
    expect(result.status).toBe('rejected')
    expect(result.failedCriteria).toContain('Slash protection failed')
  })

  it('should accept users meeting all criteria', () => {
    const result = checkEligibility(validProfile, criteria, false)
    expect(result.status).toBe('accepted')
  })

  it('should set pending when manual review enabled', () => {
    const result = checkEligibility(validProfile, criteria, true)
    expect(result.status).toBe('pending')
  })
})
```

## Performance Considerations

- All checks are synchronous and very fast
- No API calls during eligibility check
- User profile should be fetched once and cached
- Criteria checks happen in order (fail fast)

## Future Enhancements

- Vouch age verification (check 24h requirement)
- Weighted criteria (some more important than others)
- Custom rejection messages per criterion
- Appeal system for slashed users (if Ethos allows)
- Time-based criteria (e.g., recent activity)
