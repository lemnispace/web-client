/**
 * The three-letter currency codes that represent the world currencies used in stores.
 * These include standard ISO 4217 codes, legacy codes, and non-standard codes.
 */
export enum CurrencyCode {
  /** United Arab Emirates Dirham (AED) */
  AED = "AED",
  /** Afghan Afghani (AFN) */
  AFN = "AFN",
  /** Albanian Lek (ALL) */
  ALL = "ALL",
  /** Armenian Dram (AMD) */
  AMD = "AMD",
  /** Netherlands Antillean Guilder */
  ANG = "ANG",
  /** Angolan Kwanza (AOA) */
  AOA = "AOA",
  /** Argentine Pesos (ARS) */
  ARS = "ARS",
  /** Australian Dollars (AUD) */
  AUD = "AUD",
  /** Aruban Florin (AWG) */
  AWG = "AWG",
  /** Azerbaijani Manat (AZN) */
  AZN = "AZN",
  /** Bosnia and Herzegovina Convertible Mark (BAM) */
  BAM = "BAM",
  /** Barbadian Dollar (BBD) */
  BBD = "BBD",
  /** Bangladesh Taka (BDT) */
  BDT = "BDT",
  /** Bulgarian Lev (BGN) */
  BGN = "BGN",
  /** Bahraini Dinar (BHD) */
  BHD = "BHD",
  /** Burundian Franc (BIF) */
  BIF = "BIF",
  /** Bermudian Dollar (BMD) */
  BMD = "BMD",
  /** Brunei Dollar (BND) */
  BND = "BND",
  /** Bolivian Boliviano (BOB) */
  BOB = "BOB",
  /** Brazilian Real (BRL) */
  BRL = "BRL",
  /** Bahamian Dollar (BSD) */
  BSD = "BSD",
  /** Bhutanese Ngultrum (BTN) */
  BTN = "BTN",
  /** Botswana Pula (BWP) */
  BWP = "BWP",
  /** Belarusian Ruble (BYN) */
  BYN = "BYN",
  /** Belize Dollar (BZD) */
  BZD = "BZD",
  /** Canadian Dollars (CAD) */
  CAD = "CAD",
  /** Congolese franc (CDF) */
  CDF = "CDF",
  /** Swiss Francs (CHF) */
  CHF = "CHF",
  /** Chilean Peso (CLP) */
  CLP = "CLP",
  /** Chinese Yuan Renminbi (CNY) */
  CNY = "CNY",
  /** Colombian Peso (COP) */
  COP = "COP",
  /** Costa Rican Colones (CRC) */
  CRC = "CRC",
  /** Cape Verdean escudo (CVE) */
  CVE = "CVE",
  /** Czech Koruny (CZK) */
  CZK = "CZK",
  /** Djiboutian Franc (DJF) */
  DJF = "DJF",
  /** Danish Kroner (DKK) */
  DKK = "DKK",
  /** Dominican Peso (DOP) */
  DOP = "DOP",
  /** Algerian Dinar (DZD) */
  DZD = "DZD",
  /** Egyptian Pound (EGP) */
  EGP = "EGP",
  /** Eritrean Nakfa (ERN) */
  ERN = "ERN",
  /** Ethiopian Birr (ETB) */
  ETB = "ETB",
  /** Euro (EUR) */
  EUR = "EUR",
  /** Fijian Dollars (FJD) */
  FJD = "FJD",
  /** Falkland Islands Pounds (FKP) */
  FKP = "FKP",
  /** United Kingdom Pounds (GBP) */
  GBP = "GBP",
  /** Georgian Lari (GEL) */
  GEL = "GEL",
  /** Ghanaian Cedi (GHS) */
  GHS = "GHS",
  /** Gibraltar Pounds (GIP) */
  GIP = "GIP",
  /** Gambian Dalasi (GMD) */
  GMD = "GMD",
  /** Guinean Franc (GNF) */
  GNF = "GNF",
  /** Guatemalan Quetzal (GTQ) */
  GTQ = "GTQ",
  /** Guyanese Dollar (GYD) */
  GYD = "GYD",
  /** Hong Kong Dollars (HKD) */
  HKD = "HKD",
  /** Honduran Lempira (HNL) */
  HNL = "HNL",
  /** Croatian Kuna (HRK) */
  HRK = "HRK",
  /** Haitian Gourde (HTG) */
  HTG = "HTG",
  /** Hungarian Forint (HUF) */
  HUF = "HUF",
  /** Indonesian Rupiah (IDR) */
  IDR = "IDR",
  /** Israeli New Shekel (NIS) */
  ILS = "ILS",
  /** Indian Rupees (INR) */
  INR = "INR",
  /** Iraqi Dinar (IQD) */
  IQD = "IQD",
  /** Iranian Rial (IRR) */
  IRR = "IRR",
  /** Icelandic Kronur (ISK) */
  ISK = "ISK",
  /** Jersey Pound */
  JEP = "JEP",
  /** Jamaican Dollars (JMD) */
  JMD = "JMD",
  /** Jordanian Dinar (JOD) */
  JOD = "JOD",
  /** Japanese Yen (JPY) */
  JPY = "JPY",
  /** Kenyan Shilling (KES) */
  KES = "KES",
  /** Kyrgyzstani Som (KGS) */
  KGS = "KGS",
  /** Cambodian Riel */
  KHR = "KHR",
  /** Kiribati Dollar (KID) */
  KID = "KID",
  /** Comorian Franc (KMF) */
  KMF = "KMF",
  /** South Korean Won (KRW) */
  KRW = "KRW",
  /** Kuwaiti Dinar (KWD) */
  KWD = "KWD",
  /** Cayman Dollars (KYD) */
  KYD = "KYD",
  /** Kazakhstani Tenge (KZT) */
  KZT = "KZT",
  /** Laotian Kip (LAK) */
  LAK = "LAK",
  /** Lebanese Pounds (LBP) */
  LBP = "LBP",
  /** Sri Lankan Rupees (LKR) */
  LKR = "LKR",
  /** Liberian Dollar (LRD) */
  LRD = "LRD",
  /** Lesotho Loti (LSL) */
  LSL = "LSL",
  /** Lithuanian Litai (LTL) */
  LTL = "LTL",
  /** Latvian Lati (LVL) */
  LVL = "LVL",
  /** Libyan Dinar (LYD) */
  LYD = "LYD",
  /** Moroccan Dirham */
  MAD = "MAD",
  /** Moldovan Leu (MDL) */
  MDL = "MDL",
  /** Malagasy Ariary (MGA) */
  MGA = "MGA",
  /** Macedonia Denar (MKD) */
  MKD = "MKD",
  /** Burmese Kyat (MMK) */
  MMK = "MMK",
  /** Mongolian Tugrik */
  MNT = "MNT",
  /** Macanese Pataca (MOP) */
  MOP = "MOP",
  /** Mauritanian Ouguiya (MRU) */
  MRU = "MRU",
  /** Mauritian Rupee (MUR) */
  MUR = "MUR",
  /** Maldivian Rufiyaa (MVR) */
  MVR = "MVR",
  /** Malawian Kwacha (MWK) */
  MWK = "MWK",
  /** Mexican Pesos (MXN) */
  MXN = "MXN",
  /** Malaysian Ringgits (MYR) */
  MYR = "MYR",
  /** Mozambican Metical */
  MZN = "MZN",
  /** Namibian Dollar */
  NAD = "NAD",
  /** Nigerian Naira (NGN) */
  NGN = "NGN",
  /** Nicaraguan Córdoba (NIO) */
  NIO = "NIO",
  /** Norwegian Kroner (NOK) */
  NOK = "NOK",
  /** Nepalese Rupee (NPR) */
  NPR = "NPR",
  /** New Zealand Dollars (NZD) */
  NZD = "NZD",
  /** Omani Rial (OMR) */
  OMR = "OMR",
  /** Panamian Balboa (PAB) */
  PAB = "PAB",
  /** Peruvian Nuevo Sol (PEN) */
  PEN = "PEN",
  /** Papua New Guinean Kina (PGK) */
  PGK = "PGK",
  /** Philippine Peso (PHP) */
  PHP = "PHP",
  /** Pakistani Rupee (PKR) */
  PKR = "PKR",
  /** Polish Zlotych (PLN) */
  PLN = "PLN",
  /** Paraguayan Guarani (PYG) */
  PYG = "PYG",
  /** Qatari Rial (QAR) */
  QAR = "QAR",
  /** Romanian Lei (RON) */
  RON = "RON",
  /** Serbian dinar (RSD) */
  RSD = "RSD",
  /** Russian Rubles (RUB) */
  RUB = "RUB",
  /** Rwandan Franc (RWF) */
  RWF = "RWF",
  /** Saudi Riyal (SAR) */
  SAR = "SAR",
  /** Solomon Islands Dollar (SBD) */
  SBD = "SBD",
  /** Seychellois Rupee (SCR) */
  SCR = "SCR",
  /** Sudanese Pound (SDG) */
  SDG = "SDG",
  /** Swedish Kronor (SEK) */
  SEK = "SEK",
  /** Singapore Dollars (SGD) */
  SGD = "SGD",
  /** Saint Helena Pounds (SHP) */
  SHP = "SHP",
  /** Sierra Leonean Leone (SLL) */
  SLL = "SLL",
  /** Somali Shilling (SOS) */
  SOS = "SOS",
  /** Surinamese Dollar (SRD) */
  SRD = "SRD",
  /** South Sudanese Pound (SSP) */
  SSP = "SSP",
  /** Sao Tome And Principe Dobra (STN) */
  STN = "STN",
  /** Syrian Pound (SYP) */
  SYP = "SYP",
  /** Swazi Lilangeni (SZL) */
  SZL = "SZL",
  /** Thai baht (THB) */
  THB = "THB",
  /** Tajikistani Somoni (TJS) */
  TJS = "TJS",
  /** Turkmenistani Manat (TMT) */
  TMT = "TMT",
  /** Tunisian Dinar (TND) */
  TND = "TND",
  /** Tongan Pa'anga (TOP) */
  TOP = "TOP",
  /** Turkish Lira (TRY) */
  TRY = "TRY",
  /** Trinidad and Tobago Dollars (TTD) */
  TTD = "TTD",
  /** Taiwan Dollars (TWD) */
  TWD = "TWD",
  /** Tanzanian Shilling (TZS) */
  TZS = "TZS",
  /** Ukrainian Hryvnia (UAH) */
  UAH = "UAH",
  /** Ugandan Shilling (UGX) */
  UGX = "UGX",
  /** United States Dollars (USD) */
  USD = "USD",
  /** Uruguayan Pesos (UYU) */
  UYU = "UYU",
  /** Uzbekistan som (UZS) */
  UZS = "UZS",
  /** Venezuelan Bolivares (VED) */
  VED = "VED",
  /** Venezuelan Bolivares Soberanos (VES) */
  VES = "VES",
  /** Vietnamese đồng (VND) */
  VND = "VND",
  /** Vanuatu Vatu (VUV) */
  VUV = "VUV",
  /** Samoan Tala (WST) */
  WST = "WST",
  /** Central African CFA Franc (XAF) */
  XAF = "XAF",
  /** East Caribbean Dollar (XCD) */
  XCD = "XCD",
  /** West African CFA franc (XOF) */
  XOF = "XOF",
  /** CFP Franc (XPF) */
  XPF = "XPF",
  /** Yemeni Rial (YER) */
  YER = "YER",
  /** South African Rand (ZAR) */
  ZAR = "ZAR",
  /** Zambian Kwacha (ZMW) */
  ZMW = "ZMW",
}

export const DEFAULT_CURRENCY_CODE = CurrencyCode.USD;
