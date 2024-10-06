export interface Attribute {
  /**
   * Key or name of the attribute.
   */
  key: string;
  /**
   * Value of the attribute.
   */
  value: string;
}

/**
 * Represents a set of UTM parameters.
 */
export interface UTMParameters {
  /**
   * The name of a marketing campaign.
   */
  campaign?: string;

  /**
   * Identifies specific content in a marketing campaign. Used to differentiate between similar content
   * or links in a marketing campaign to determine which is the most effective.
   */
  content?: string;

  /**
   * The medium of a marketing campaign, such as a banner or email newsletter.
   */
  medium?: string;

  /**
   * The source of traffic to the merchant's store, such as Google or an email newsletter.
   */
  source?: string;

  /**
   * Paid search terms used by a marketing campaign.
   */
  term?: string;
}
