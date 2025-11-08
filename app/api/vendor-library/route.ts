import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Initialize Wasabi S3 client
const s3Client = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT || 'https://s3.us-west-1.wasabisys.com',
  region: process.env.WASABI_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY || '',
    secretAccessKey: process.env.WASABI_SECRET_KEY || '',
  },
});

const BUCKET_NAME = 'xlb-vendor-library';

/**
 * GET /api/vendor-library
 * Fetch vendor library data from Wasabi
 * Query params:
 * - action: 'list' | 'read' | 'search'
 * - path: specific file path for 'read' action
 * - query: search term for 'search' action
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';
    const path = searchParams.get('path');
    const query = searchParams.get('query');

    switch (action) {
      case 'list':
        return await listFiles();

      case 'read':
        if (!path) {
          return NextResponse.json({ error: 'Path required for read action' }, { status: 400 });
        }
        return await readFile(path);

      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Query required for search action' }, { status: 400 });
        }
        return await searchFiles(query);

      case 'overview':
        return await getOverview();

      case 'category':
        const categoryId = searchParams.get('id');
        if (!categoryId) {
          return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
        }
        return await getCategoryData(categoryId);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Vendor library API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor library data' },
      { status: 500 }
    );
  }
}

/**
 * List all markdown files in the vendor library
 */
async function listFiles() {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: 'research/',
  });

  const response = await s3Client.send(command);
  const files = response.Contents?.filter(item => item.Key?.endsWith('.md')) || [];

  const fileList = files.map(file => ({
    key: file.Key,
    name: file.Key?.split('/').pop(),
    size: file.Size,
    lastModified: file.LastModified,
    path: file.Key?.replace('research/', ''),
  }));

  return NextResponse.json({ files: fileList });
}

/**
 * Read a specific file from Wasabi
 */
async function readFile(path: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  const response = await s3Client.send(command);
  const content = await response.Body?.transformToString();

  return NextResponse.json({
    path,
    content,
    metadata: {
      contentType: response.ContentType,
      lastModified: response.LastModified,
      size: response.ContentLength,
    },
  });
}

/**
 * Search for files matching a query
 */
async function searchFiles(query: string) {
  const listCommand = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: 'research/',
  });

  const response = await s3Client.send(listCommand);
  const files = response.Contents?.filter(item => item.Key?.endsWith('.md')) || [];

  // Simple filename search
  const queryLower = query.toLowerCase();
  const matchingFiles = files.filter(file =>
    file.Key?.toLowerCase().includes(queryLower)
  );

  // Read matching files to search content
  const results = await Promise.all(
    matchingFiles.slice(0, 10).map(async (file) => {
      try {
        const readCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: file.Key,
        });
        const fileResponse = await s3Client.send(readCommand);
        const content = await fileResponse.Body?.transformToString();

        // Check if query appears in content
        const contentMatch = content?.toLowerCase().includes(queryLower);

        if (contentMatch) {
          // Extract a snippet around the match
          const index = content?.toLowerCase().indexOf(queryLower) || 0;
          const snippet = content?.substring(Math.max(0, index - 100), index + 200);

          return {
            key: file.Key,
            name: file.Key?.split('/').pop(),
            path: file.Key?.replace('research/', ''),
            snippet,
            relevance: 'content',
          };
        }

        return {
          key: file.Key,
          name: file.Key?.split('/').pop(),
          path: file.Key?.replace('research/', ''),
          relevance: 'filename',
        };
      } catch (err) {
        console.error(`Error reading file ${file.Key}:`, err);
        return null;
      }
    })
  );

  return NextResponse.json({
    query,
    results: results.filter(r => r !== null),
  });
}

/**
 * Get overview data (README, PROGRESS, etc.)
 */
async function getOverview() {
  try {
    const readmeCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'README.md',
    });
    const readmeResponse = await s3Client.send(readmeCommand);
    const readme = await readmeResponse.Body?.transformToString();

    const progressCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'PROGRESS.md',
    });
    const progressResponse = await s3Client.send(progressCommand);
    const progress = await progressResponse.Body?.transformToString();

    return NextResponse.json({
      readme,
      progress,
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview data' },
      { status: 500 }
    );
  }
}

/**
 * Get category data including explanation and ranked vendors
 */
async function getCategoryData(categoryId: string) {
  // Map category IDs to their file paths
  const categoryMap: Record<string, string[]> = {
    '1': [
      'research/phase-1-foundation/tier-1-claims/1.1-rbp-fair-pricing.md',
      'research/phase-1-foundation/tier-1-claims/1.2-payment-integrity.md',
      'research/phase-1-foundation/tier-1-claims/1.3-direct-partnerships.md',
      'research/phase-1-foundation/tier-1-claims/1.4-claims-commercial.md',
    ],
    '2': [
      'research/phase-3-ecosystem/tier-2-risk/2.1-stoploss-partners.md',
      'research/phase-3-ecosystem/tier-2-risk/2.2-alternative-risk.md',
      'research/phase-3-ecosystem/tier-2-risk/2.3-risk-optimization.md',
      'research/phase-3-ecosystem/tier-2-risk/2.4-stop-loss-mgus.md',
    ],
    '3': [
      'research/phase-1-foundation/tier-3-pharmacy/3.1-transparent-pbm-landscape.md',
      'research/phase-1-foundation/tier-3-pharmacy/3.2-pbm-partnership-models.md',
      'research/phase-1-foundation/tier-3-pharmacy/3.3-specialty-drug-compassion.md',
      'research/phase-1-foundation/tier-3-pharmacy/3.4-biosimilar-innovation.md',
      'research/phase-1-foundation/tier-3-pharmacy/3.5-pbm-commercial-transparency.md',
      'research/phase-1-foundation/tier-3-pharmacy/3.6-international-pharmacy-sourcing.md',
    ],
    '4': [
      'research/phase-3-ecosystem/tier-4-high-cost/4.1-cancer-navigation.md',
      'research/phase-3-ecosystem/tier-4-high-cost/4.2-dialysis-management.md',
      'research/phase-3-ecosystem/tier-4-high-cost/4.3-transplant-management.md',
      'research/phase-3-ecosystem/tier-4-high-cost/4.4-gene-cell-therapy.md',
    ],
    '5': [
      'research/phase-3-ecosystem/tier-5-high-prevalence/5.1-diabetes-management.md',
      'research/phase-3-ecosystem/tier-5-high-prevalence/5.2-msk-care.md',
      'research/phase-3-ecosystem/tier-5-high-prevalence/5.3-rare-disease-management.md',
      'research/phase-3-ecosystem/tier-5-high-prevalence/5.4-ckd-management.md',
      'research/phase-3-ecosystem/tier-5-high-prevalence/5.5-cardiovascular-programs.md',
      'research/phase-3-ecosystem/tier-5-high-prevalence/5.6-fertility-maternity.md',
    ],
    '6': [
      'research/phase-1-foundation/tier-6-care-delivery/6.1-advanced-primary-care.md',
      'research/phase-1-foundation/tier-6-care-delivery/6.2-virtual-care-access.md',
      'research/phase-1-foundation/tier-6-care-delivery/6.3-centers-excellence.md',
      'research/phase-2-connected/tier-6-care-delivery/6.4-delivery-integration.md',
    ],
    '7': [
      'research/phase-3-ecosystem/tier-7-navigation/7.1-patient-navigation.md',
      'research/phase-3-ecosystem/tier-7-navigation/7.2-second-opinion.md',
    ],
    '8': [
      'research/phase-3-ecosystem/tier-8-behavioral/8.1-mental-health.md',
      'research/phase-3-ecosystem/tier-8-behavioral/8.2-wellness-prevention.md',
      'research/phase-3-ecosystem/tier-8-behavioral/8.3-weight-management.md',
      'research/phase-3-ecosystem/tier-8-behavioral/8.4-autism-support.md',
      'research/phase-3-ecosystem/tier-8-behavioral/8.5-substance-use-disorder.md',
    ],
    '9': [
      'research/phase-2-connected/tier-9-utilization/9.1-intelligent-care.md',
      'research/phase-2-connected/tier-9-utilization/9.2-benefit-coordination.md',
    ],
    '10': [
      'research/phase-3-ecosystem/tier-10-compliance/10.1-benefits-admin.md',
    ],
    '11': [
      'research/phase-1-foundation/tier-11-analytics/11.1-independent-analytics.md',
      'research/phase-1-foundation/tier-11-analytics/11.2-cost-visibility.md',
    ],
    '12': [
      // TPA research files to be added
    ],
    '13': [
      'research/phase-3-ecosystem/tier-13-emerging/13.1-digital-therapeutics.md',
    ],
    '14': [
      'research/phase-2-connected/tier-14-integration/14.1-data-liberation.md',
      'research/phase-2-connected/tier-14-integration/14.2-unified-experience.md',
      'research/phase-2-connected/tier-14-integration/14.3-performance-attribution.md',
    ],
    '15': [
      'research/phase-1-foundation/tier-15-governance/15.1-fiduciary-leadership.md',
      'research/phase-2-connected/tier-15-governance/15.2-partnership-frameworks.md',
      'research/phase-2-connected/tier-15-governance/15.3-trust-verification.md',
    ],
  };

  const files = categoryMap[categoryId];

  if (!files || files.length === 0) {
    return NextResponse.json({
      explanation: `This category is documented in our vendor library. The research covers comprehensive vendor analysis with scoring across multiple dimensions.`,
      vendors: [],
      files: [],
    });
  }

  try {
    const fileData = await Promise.all(
      files.map(async (filePath) => {
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filePath,
        });
        const response = await s3Client.send(command);
        const content = await response.Body?.transformToString();
        return { filePath, content };
      })
    );

    // Parse vendors from markdown
    const vendors = extractVendorsFromMarkdown(fileData);

    // Extract category explanation
    const explanation = extractCategoryExplanation(fileData[0].content);

    return NextResponse.json({
      explanation,
      vendors,
      files: fileData.map(f => ({ path: f.filePath, hasContent: !!f.content })),
    });
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch category data' },
      { status: 500 }
    );
  }
}

/**
 * Extract vendor profiles from markdown content
 */
function extractVendorsFromMarkdown(fileData: Array<{ filePath: string; content?: string }>) {
  const vendors: any[] = [];

  for (const file of fileData) {
    if (!file.content) continue;

    // Look for vendor sections (### or #### headers with numbers)
    const vendorMatches = file.content.matchAll(/###?\s+(\d+)\.\s+([^\n]+)/g);

    for (const match of vendorMatches) {
      const vendorName = match[2].trim();
      const startIndex = match.index || 0;

      // Find the next vendor section or end of file
      const nextVendorMatch = file.content.indexOf('###', startIndex + 1);
      const endIndex = nextVendorMatch > 0 ? nextVendorMatch : file.content.length;

      const vendorSection = file.content.substring(startIndex, endIndex);

      // Extract evaluation score
      const scoreMatch = vendorSection.match(/\*\*Total:\s*(\d+)\/100\*\*/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

      // Extract overview
      const overviewMatch = vendorSection.match(/\*\*Company Overview:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
      const overview = overviewMatch ? overviewMatch[1].trim() : '';

      // Extract best for
      const bestForMatch = vendorSection.match(/\*\*Best For:\*\*\s*([^\n]+)/);
      const bestFor = bestForMatch ? bestForMatch[1].trim() : '';

      // Extract alignment details
      const fairPricingMatch = vendorSection.match(/Fair Pricing:\s*(\d+)\/25/);
      const memberProtectionMatch = vendorSection.match(/Member Protection:\s*(\d+)\/25/);
      const providerRelationsMatch = vendorSection.match(/Provider Relations:\s*(\d+)\/25/);
      const tpaIntegrationMatch = vendorSection.match(/TPA Integration:\s*(\d+)\/25/);

      vendors.push({
        name: vendorName,
        score,
        overview,
        bestFor,
        alignment: {
          fairPricing: fairPricingMatch ? parseInt(fairPricingMatch[1]) : 0,
          memberProtection: memberProtectionMatch ? parseInt(memberProtectionMatch[1]) : 0,
          providerRelations: providerRelationsMatch ? parseInt(providerRelationsMatch[1]) : 0,
          tpaIntegration: tpaIntegrationMatch ? parseInt(tpaIntegrationMatch[1]) : 0,
        },
        fullContent: vendorSection,
      });
    }
  }

  // Sort by score descending
  return vendors.sort((a, b) => b.score - a.score);
}

/**
 * Extract category explanation from markdown
 */
function extractCategoryExplanation(content?: string): string {
  if (!content) return '';

  // Look for Executive Summary
  const summaryMatch = content.match(/##\s+Executive Summary\s+([\s\S]+?)(?=\n##|$)/);
  if (summaryMatch) {
    return summaryMatch[1].trim();
  }

  // Fallback: get first paragraph after title
  const lines = content.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim() && !line.startsWith('#'));
  return nonEmptyLines.slice(0, 3).join('\n').trim();
}
