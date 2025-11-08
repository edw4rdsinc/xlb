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
