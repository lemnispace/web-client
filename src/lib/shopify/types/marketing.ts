/**
 * Represents actions that market a merchant's store or products.
 */
export interface MarketingEvent {
  /**
   * The app that the marketing event is attributed to.
   */
  app: App;

  /**
   * The unique string identifier of the channel to which this activity belongs. For the correct
   * handle for your channel, contact your partner manager.
   */
  channelHandle?: string;

  /**
   * A human-readable description of the marketing event.
   */
  description?: string;

  /**
   * The date and time when the marketing event ended.
   */
  endedAt?: string;

  /**
   * A globally-unique identifier
   */
  id: string;

  /**
   * The ID of the corresponding resource in the REST Admin API
   */
  legacyResourceId: number;

  /**
   * The URL where the marketing event can be managed.
   */
  manageUrl?: string;

  /**
   * The medium through which the marketing activity and event reached consumers. This is used for
   * reporting aggregation.
   */
  marketingChannelType?: MarketingChannel;

  /**
   * The URL where the marketing event can be previewed.
   */
  previewUrl?: string;

  /**
   * An optional ID that helps Shopify validate engagement data.
   */
  remoteId?: string;

  /**
   * The date and time when the marketing event is scheduled to end
   */
  scheduledToEndAt?: string;

  /**
   * Where the `MarketingEvent` occurred and what kind of content was used. Because `utmSource` and
   * `utmMedium` are often used interchangeably, this is based on a combination of `marketingChannel`,
   * `referringDomain`, and `type` to provide a consistent representation for any given piece of
   * marketing regardless of the app that created it.
   */
  sourceAndMedium: string;

  /**
   * The date and time when the marketing event started
   */
  startedAt: string;

  /**
   * The marketing event type
   */
  type: MarketingTactic;

  /**
   * The name of the marketing campaign.
   */
  utmCampaign?: string;

  /**
   * The medium that the marketing campaign is using. Example values: 'cpc', 'banner'.
   */
  utmMedium?: string;

  /**
   * The referrer of the marketing event. Example values: 'google', 'newsletter'.
   */
  utmSource?: string;
}

/**
 * The available types of tactics for a marketing activity.
 */
export type MarketingTactic =
  /** An abandoned cart recovery email. */
  | "ABANDONED_CART"
  /** An ad, such as a Facebook ad. */
  | "AD"
  /** An affiliate link. */
  | "AFFILIATE"
  /** A link. */
  | "LINK"
  /** A loyalty program. */
  | "LOYALTY"
  /** A messaging app, such as Facebook Messenger. */
  | "MESSAGE"
  /** A newsletter. */
  | "NEWSLETTER"
  /** A notification in the Shopify admin. */
  | "NOTIFICATION"
  /** A blog post. */
  | "POST"
  /** A retargeting ad. */
  | "RETARGETING"
  /** Search engine optimization. */
  | "SEO"
  /** A popup on the online store. */
  | "STOREFRONT_APP"
  /** A transactional email. */
  | "TRANSACTIONAL";

export type MarketingChannel = unknown; // TODO: Add marketing channel types

type App = unknown; // TODO: Add app types
