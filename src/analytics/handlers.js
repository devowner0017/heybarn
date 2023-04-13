export class LoggingAnalyticsHandler {
  trackPageView(url) {
    console.log('Analytics page view:', url);
  }
  identifyUser(user) {
    console.log('Analytics identify user:', user);
  }
}

export class GoogleAnalyticsHandler {
  constructor(ga) {
    if (typeof ga !== 'function') {
      throw new Error('Variable `ga` missing for Google Analytics');
    }
    this.ga = ga;
  }
  trackPageView(url) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications#tracking_virtual_pageviews
    this.ga('set', 'page', url);
    this.ga('send', 'pageview');
  }
  identifyUser(user) {
    this.ga('set', 'userId', user.id);
  }
}

export class SegmentAnalyticsHandler {
  constructor(analytics) {
    if (typeof analytics !== 'function') {
      throw new Error('Variable `analytics` missing for Segment Analytics');
    }
    this.analytics = analytics;
  }
  trackPageView(url) {
    this.analytics.page();
  }
  identifyUser(user) {
    this.analytics.identify(user.id, {
      email: user.email,
      name: user.name,
    });
  }
}
