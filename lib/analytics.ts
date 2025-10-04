// Google Analytics 4 tracking helpers

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Tool-specific tracking events
export const trackToolStarted = (toolName: string) => {
  event({
    action: 'tool_started',
    category: 'Tools',
    label: toolName,
  })
}

export const trackToolCompleted = (toolName: string) => {
  event({
    action: 'tool_completed',
    category: 'Tools',
    label: toolName,
  })
}

export const trackResultsViewed = (toolName: string) => {
  event({
    action: 'results_viewed',
    category: 'Tools',
    label: toolName,
  })
}

export const trackEmailCaptured = (toolName: string) => {
  event({
    action: 'email_captured',
    category: 'Lead Generation',
    label: toolName,
  })
}
