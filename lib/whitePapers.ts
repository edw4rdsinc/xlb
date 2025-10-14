// White Papers Content Management
// Add new white papers by adding entries to this array

export interface WhitePaper {
  id: string
  title: string
  description: string
  category: 'stop-loss' | 'self-funding' | 'compliance' | 'market-analysis' | 'cost-containment'
  publishDate: string
  author: string
  readTime: string
  downloadUrl?: string // If you have PDF files
  content?: string // Or inline content
  tags: string[]
  featured: boolean
}

export const whitePapers: WhitePaper[] = [
  // Example white paper - replace with actual content
  {
    id: 'understanding-stop-loss-basics',
    title: 'Understanding Stop-Loss Insurance: A Comprehensive Guide for Brokers',
    description: 'A deep dive into stop-loss fundamentals, including specific vs. aggregate coverage, attachment points, and how to structure optimal protection for self-funded groups.',
    category: 'stop-loss',
    publishDate: '2025-01-15',
    author: 'Daron Pitts, CSFS',
    readTime: '12 min',
    tags: ['Stop-Loss', 'Insurance Basics', 'Broker Education'],
    featured: true,
    content: `
# Understanding Stop-Loss Insurance: A Comprehensive Guide for Brokers

## Introduction

Stop-loss insurance is the safety net that makes self-funding viable. But understanding how to structure effective stop-loss coverage requires more than knowing the difference between specific and aggregate policies.

This guide walks you through the critical decision points brokers face when selecting stop-loss coverage for their clients.

## Specific vs. Aggregate Coverage

### Specific Stop-Loss

Specific stop-loss protects against large individual claims...

(Add full content here)

## Key Considerations

1. **Attachment Points**: How to determine the right deductible level
2. **Rate Structure**: Understanding how carriers price stop-loss
3. **Contract Language**: Critical provisions you can't afford to miss
4. **Laser Provisions**: When and how they're applied

## Conclusion

Effective stop-loss selection requires balancing premium costs against risk tolerance...

---

**About the Author**: Daron Pitts is the founder of XL Benefits and holds the Certified Self-Funding Specialist (CSFS) designation. With over 20 years of experience in self-funding, he specializes in helping brokers navigate complex stop-loss placements.
    `
  },
  // Add more white papers here as they're created
]

/**
 * Get all white papers
 */
export function getAllWhitePapers(): WhitePaper[] {
  return whitePapers.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
}

/**
 * Get featured white papers
 */
export function getFeaturedWhitePapers(): WhitePaper[] {
  return whitePapers.filter(wp => wp.featured)
}

/**
 * Get white papers by category
 */
export function getWhitePapersByCategory(category: WhitePaper['category']): WhitePaper[] {
  return whitePapers.filter(wp => wp.category === category)
}

/**
 * Get a single white paper by ID
 */
export function getWhitePaperById(id: string): WhitePaper | undefined {
  return whitePapers.find(wp => wp.id === id)
}

/**
 * Get white papers by tag
 */
export function getWhitePapersByTag(tag: string): WhitePaper[] {
  return whitePapers.filter(wp =>
    wp.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

/**
 * Get all unique categories
 */
export function getAllCategories(): WhitePaper['category'][] {
  return Array.from(new Set(whitePapers.map(wp => wp.category)))
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allTags = whitePapers.flatMap(wp => wp.tags)
  return Array.from(new Set(allTags))
}
