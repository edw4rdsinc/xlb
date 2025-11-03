'use client';

interface LinkedInShareButtonProps {
  url: string;
  title: string;
  description: string;
  showCopyLink?: boolean;
}

export default function LinkedInShareButton({
  url,
  title,
  description,
  showCopyLink = true
}: LinkedInShareButtonProps) {
  const handleLinkedInShare = () => {
    const shareText = `${description}`;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank', 'width=600,height=600');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    // You could use a toast notification instead of alert
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
      <h3 className="text-xl font-bold text-xl-dark-blue mb-3 text-center">Share This Tool</h3>
      <p className="text-sm text-xl-grey text-center mb-4">
        Help other brokers discover this valuable resource
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={handleLinkedInShare}
          className="flex items-center justify-center px-6 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          Share on LinkedIn
        </button>
        {showCopyLink && (
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center px-6 py-3 border border-xl-dark-blue text-xl-dark-blue rounded-lg hover:bg-xl-light-grey transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </button>
        )}
      </div>
    </div>
  );
}
