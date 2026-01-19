# Filter Preset Comparison

Quick reference for choosing the right filter preset for your project.

## Comparison Table

| Criterion | Basic | Standard | Strict |
|-----------|-------|----------|--------|
| **Min Score** | 1200 | 1400 | 1600 |
| **Min Vouches** | 0 | 1 | 2 |
| **Positive Reviews** | ❌ | ✅ | ✅ |
| **Min Account Age** | 0 days | 7 days | 30 days |
| **Estimated Pass Rate** | ~70% | ~35% | ~10% |

## When to Use

### Basic Filter (70% pass rate)
**Use when:**
- You want maximum reach
- Early-stage testing with diverse feedback
- Community building phase
- Less concern about bad actors

**Best for:**
- Open beta tests
- Community surveys
- Early product validation
- Social projects

**Example projects:**
- Discord community servers
- Early feedback collection
- Social experiments
- Governance voting

---

### Standard Filter (35% pass rate) ⭐ **Recommended**
**Use when:**
- Balanced quality and quantity needed
- Moderate risk tolerance
- Professional beta testing
- Standard web3 projects

**Best for:**
- Most DeFi protocols
- NFT marketplaces
- Web3 applications
- Token launches

**Example projects:**
- DeFi protocol beta
- NFT platform early access
- DAO tool testing
- Web3 gaming alpha

---

### Strict Filter (10% pass rate)
**Use when:**
- High-value testing
- Security-critical applications
- Limited slots available
- Reputation is paramount

**Best for:**
- High-stakes DeFi
- Security audits
- Exclusive access
- Small cohorts

**Example projects:**
- Multi-sig wallet testing
- High-TVL DeFi protocols
- Security research programs
- Exclusive NFT mints

## Slash Protection

All filters include **automatic slash protection**:
- ✅ Enabled by default
- ⚠️ Hard reject (no appeal)
- 🔒 Protects against known bad actors

Slashed users are **permanently ineligible** across all filter levels.

## Customization

Don't see a perfect match? Create a **custom filter**:

```typescript
{
  minScore: 1500,        // Between Standard and Strict
  minVouches: 2,         // Strict level
  positiveReviews: true, // Required
  minAccountAge: 14      // 2 weeks (between 7 and 30)
}
```

## Pass Rate Factors

Pass rate is affected by:

1. **Score threshold** (biggest impact)
   - 1200: ~70% have this
   - 1400: ~35% have this
   - 1600: ~10% have this

2. **Vouches required** (moderate impact)
   - 0: No filtering
   - 1: ~60% reduction
   - 2: ~40% additional reduction

3. **Review balance** (small impact)
   - Adds ~20% reduction

4. **Account age** (variable impact)
   - 7 days: ~10% reduction
   - 30 days: ~30% reduction
   - 90 days: ~50% reduction

## Manual Review Option

Add manual review to any preset:

```typescript
{
  ...preset,
  manual_review: true
}
```

**Effect:**
- Passing users → Status: "pending"
- Failing users → Status: "rejected"
- You review pending manually

**When to use:**
- Extra verification needed
- Sensitive project
- Want to interview applicants
- Combine automated + human judgment

## Examples by Industry

### DeFi
- Stablecoin: **Strict**
- DEX: **Standard**
- Yield farm: **Standard**
- DAO tools: **Basic-Standard**

### NFTs
- Profile pictures: **Basic**
- Marketplaces: **Standard**
- High-value mints: **Strict**
- Community projects: **Basic**

### Gaming
- Casual games: **Basic**
- Competitive games: **Standard**
- Play-to-earn: **Standard-Strict**
- Esports: **Strict**

### Social
- Social networks: **Basic**
- Dating apps: **Standard**
- Professional networks: **Standard**
- Exclusive clubs: **Strict**

## Testing Your Filter

1. **Start conservative** (Strict)
2. **Monitor pass rate** in dashboard
3. **Adjust if needed**
   - Too few users? → Lower requirements
   - Too many bad actors? → Raise requirements
4. **Iterate based on feedback**

## Migration Between Filters

You can change filters anytime:

```typescript
// Start with Standard
const initialCriteria = getFilterPreset('standard')

// After launch, adjust based on data
if (passRate < 20) {
  // Too restrictive - relax criteria
  const newCriteria = {
    ...initialCriteria,
    minScore: 1300 // Lower from 1400
  }
}
```

**Note:** Changing criteria doesn't affect existing applications - only new ones.

## Quick Decision Tree

```
┌─ High risk / high value?
│  └─ YES → Strict
│  └─ NO → ↓
│
┌─ Need large community?
│  └─ YES → Basic
│  └─ NO → ↓
│
└─ Standard ⭐
```

## Additional Resources

- [lib/FILTERS.md](./lib/FILTERS.md) - Technical documentation
- [API.md](./API.md) - API integration guide
- [SETUP.md](./SETUP.md) - Setup instructions
