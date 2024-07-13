/**
 * The code designating a country/region, which generally follows ISO 3166-1 alpha-2 guidelines.
 * If a territory doesn't have a country code value in the CountryCode enum, then it might be
 * considered a subdivision of another country. For example, the territories associated with
 * Spain are represented by the country code ES, and the territories associated with the
 * United States of America are represented by the country code US.
 */
export enum CountryCode {
  /** Ascension Island */
  AC = "AC",
  /** Andorra */
  AD = "AD",
  /** United Arab Emirates */
  AE = "AE",
  /** Afghanistan */
  AF = "AF",
  /** Antigua & Barbuda */
  AG = "AG",
  /** Anguilla */
  AI = "AI",
  /** Albania */
  AL = "AL",
  /** Armenia */
  AM = "AM",
  /** Netherlands Antilles */
  AN = "AN",
  /** Angola */
  AO = "AO",
  /** Argentina */
  AR = "AR",
  /** Austria */
  AT = "AT",
  /** Australia */
  AU = "AU",
  /** Aruba */
  AW = "AW",
  /** Åland Islands */
  AX = "AX",
  /** Azerbaijan */
  AZ = "AZ",
  /** Bosnia & Herzegovina */
  BA = "BA",
  /** Barbados */
  BB = "BB",
  /** Bangladesh */
  BD = "BD",
  /** Belgium */
  BE = "BE",
  /** Burkina Faso */
  BF = "BF",
  /** Bulgaria */
  BG = "BG",
  /** Bahrain */
  BH = "BH",
  /** Burundi */
  BI = "BI",
  /** Benin */
  BJ = "BJ",
  /** St. Barthélemy */
  BL = "BL",
  /** Bermuda */
  BM = "BM",
  /** Brunei */
  BN = "BN",
  /** Bolivia */
  BO = "BO",
  /** Caribbean Netherlands */
  BQ = "BQ",
  /** Brazil */
  BR = "BR",
  /** Bahamas */
  BS = "BS",
  /** Bhutan */
  BT = "BT",
  /** Bouvet Island */
  BV = "BV",
  /** Botswana */
  BW = "BW",
  /** Belarus */
  BY = "BY",
  /** Belize */
  BZ = "BZ",
  /** Canada */
  CA = "CA",
  /** Cocos (Keeling) Islands */
  CC = "CC",
  /** Congo - Kinshasa */
  CD = "CD",
  /** Central African Republic */
  CF = "CF",
  /** Congo - Brazzaville */
  CG = "CG",
  /** Switzerland */
  CH = "CH",
  /** Côte d'Ivoire */
  CI = "CI",
  /** Cook Islands */
  CK = "CK",
  /** Chile */
  CL = "CL",
  /** Cameroon */
  CM = "CM",
  /** China */
  CN = "CN",
  /** Colombia */
  CO = "CO",
  /** Costa Rica */
  CR = "CR",
  /** Cuba */
  CU = "CU",
  /** Cape Verde */
  CV = "CV",
  /** Curaçao */
  CW = "CW",
  /** Christmas Island */
  CX = "CX",
  /** Cyprus */
  CY = "CY",
  /** Czechia */
  CZ = "CZ",
  /** Germany */
  DE = "DE",
  /** Djibouti */
  DJ = "DJ",
  /** Denmark */
  DK = "DK",
  /** Dominica */
  DM = "DM",
  /** Dominican Republic */
  DO = "DO",
  /** Algeria */
  DZ = "DZ",
  /** Ecuador */
  EC = "EC",
  /** Estonia */
  EE = "EE",
  /** Egypt */
  EG = "EG",
  /** Western Sahara */
  EH = "EH",
  /** Eritrea */
  ER = "ER",
  /** Spain */
  ES = "ES",
  /** Ethiopia */
  ET = "ET",
  /** Finland */
  FI = "FI",
  /** Fiji */
  FJ = "FJ",
  /** Falkland Islands */
  FK = "FK",
  /** Faroe Islands */
  FO = "FO",
  /** France */
  FR = "FR",
  /** Gabon */
  GA = "GA",
  /** United Kingdom */
  GB = "GB",
  /** Grenada */
  GD = "GD",
  /** Georgia */
  GE = "GE",
  /** French Guiana */
  GF = "GF",
  /** Guernsey */
  GG = "GG",
  /** Ghana */
  GH = "GH",
  /** Gibraltar */
  GI = "GI",
  /** Greenland */
  GL = "GL",
  /** Gambia */
  GM = "GM",
  /** Guinea */
  GN = "GN",
  /** Guadeloupe */
  GP = "GP",
  /** Equatorial Guinea */
  GQ = "GQ",
  /** Greece */
  GR = "GR",
  /** South Georgia & South Sandwich Islands */
  GS = "GS",
  /** Guatemala */
  GT = "GT",
  /** Guinea-Bissau */
  GW = "GW",
  /** Guyana */
  GY = "GY",
  /** Hong Kong SAR */
  HK = "HK",
  /** Heard & McDonald Islands */
  HM = "HM",
  /** Honduras */
  HN = "HN",
  /** Croatia */
  HR = "HR",
  /** Haiti */
  HT = "HT",
  /** Hungary */
  HU = "HU",
  /** Indonesia */
  ID = "ID",
  /** Ireland */
  IE = "IE",
  /** Israel */
  IL = "IL",
  /** Isle of Man */
  IM = "IM",
  /** India */
  IN = "IN",
  /** British Indian Ocean Territory */
  IO = "IO",
  /** Iraq */
  IQ = "IQ",
  /** Iran */
  IR = "IR",
  /** Iceland */
  IS = "IS",
  /** Italy */
  IT = "IT",
  /** Jersey */
  JE = "JE",
  /** Jamaica */
  JM = "JM",
  /** Jordan */
  JO = "JO",
  /** Japan */
  JP = "JP",
  /** Kenya */
  KE = "KE",
  /** Kyrgyzstan */
  KG = "KG",
  /** Cambodia */
  KH = "KH",
  /** Kiribati */
  KI = "KI",
  /** Comoros */
  KM = "KM",
  /** St. Kitts & Nevis */
  KN = "KN",
  /** North Korea */
  KP = "KP",
  /** South Korea */
  KR = "KR",
  /** Kuwait */
  KW = "KW",
  /** Cayman Islands */
  KY = "KY",
  /** Kazakhstan */
  KZ = "KZ",
  /** Laos */
  LA = "LA",
  /** Lebanon */
  LB = "LB",
  /** St. Lucia */
  LC = "LC",
  /** Liechtenstein */
  LI = "LI",
  /** Sri Lanka */
  LK = "LK",
  /** Liberia */
  LR = "LR",
  /** Lesotho */
  LS = "LS",
  /** Lithuania */
  LT = "LT",
  /** Luxembourg */
  LU = "LU",
  /** Latvia */
  LV = "LV",
  /** Libya */
  LY = "LY",
  /** Morocco */
  MA = "MA",
  /** Monaco */
  MC = "MC",
  /** Moldova */
  MD = "MD",
  /** Montenegro */
  ME = "ME",
  /** St. Martin */
  MF = "MF",
  /** Madagascar */
  MG = "MG",
  /** North Macedonia */
  MK = "MK",
  /** Mali */
  ML = "ML",
  /** Myanmar (Burma) */
  MM = "MM",
  /** Mongolia */
  MN = "MN",
  /** Macao SAR */
  MO = "MO",
  /** Martinique */
  MQ = "MQ",
  /** Mauritania */
  MR = "MR",
  /** Montserrat */
  MS = "MS",
  /** Malta */
  MT = "MT",
  /** Mauritius */
  MU = "MU",
  /** Maldives */
  MV = "MV",
  /** Malawi */
  MW = "MW",
  /** Mexico */
  MX = "MX",
  /** Malaysia */
  MY = "MY",
  /** Mozambique */
  MZ = "MZ",
  /** Namibia */
  NA = "NA",
  /** New Caledonia */
  NC = "NC",
  /** Niger */
  NE = "NE",
  /** Norfolk Island */
  NF = "NF",
  /** Nigeria */
  NG = "NG",
  /** Nicaragua */
  NI = "NI",
  /** Netherlands */
  NL = "NL",
  /** Norway */
  NO = "NO",
  /** Nepal */
  NP = "NP",
  /** Nauru */
  NR = "NR",
  /** Niue */
  NU = "NU",
  /** New Zealand */
  NZ = "NZ",
  /** Oman */
  OM = "OM",
  /** Panama */
  PA = "PA",
  /** Peru */
  PE = "PE",
  /** French Polynesia */
  PF = "PF",
  /** Papua New Guinea */
  PG = "PG",
  /** Philippines */
  PH = "PH",
  /** Pakistan */
  PK = "PK",
  /** Poland */
  PL = "PL",
  /** St. Pierre & Miquelon */
  PM = "PM",
  /** Pitcairn Islands */
  PN = "PN",
  /** Palestinian Territories */
  PS = "PS",
  /** Portugal */
  PT = "PT",
  /** Paraguay */
  PY = "PY",
  /** Qatar */
  QA = "QA",
  /** Réunion */
  RE = "RE",
  /** Romania */
  RO = "RO",
  /** Serbia */
  RS = "RS",
  /** Russia */
  RU = "RU",
  /** Rwanda */
  RW = "RW",
  /** Saudi Arabia */
  SA = "SA",
  /** Solomon Islands */
  SB = "SB",
  /** Seychelles */
  SC = "SC",
  /** Sudan */
  SD = "SD",
  /** Sweden */
  SE = "SE",
  /** Singapore */
  SG = "SG",
  /** St. Helena */
  SH = "SH",
  /** Slovenia */
  SI = "SI",
  /** Svalbard & Jan Mayen */
  SJ = "SJ",
  /** Slovakia */
  SK = "SK",
  /** Sierra Leone */
  SL = "SL",
  /** San Marino */
  SM = "SM",
  /** Senegal */
  SN = "SN",
  /** Somalia */
  SO = "SO",
  /** Suriname */
  SR = "SR",
  /** South Sudan */
  SS = "SS",
  /** São Tomé & Príncipe */
  ST = "ST",
  /** El Salvador */
  SV = "SV",
  /** Sint Maarten */
  SX = "SX",
  /** Syria */
  SY = "SY",
  /** Eswatini */
  SZ = "SZ",
  /** Tristan da Cunha */
  TA = "TA",
  /** Turks & Caicos Islands */
  TC = "TC",
  /** Chad */
  TD = "TD",
  /** French Southern Territories */
  TF = "TF",
  /** Togo */
  TG = "TG",
  /** Thailand */
  TH = "TH",
  /** Tajikistan */
  TJ = "TJ",
  /** Tokelau */
  TK = "TK",
  /** Timor-Leste */
  TL = "TL",
  /** Turkmenistan */
  TM = "TM",
  /** Tunisia */
  TN = "TN",
  /** Tonga */
  TO = "TO",
  /** Türkiye */
  TR = "TR",
  /** Trinidad & Tobago */
  TT = "TT",
  /** Tuvalu */
  TV = "TV",
  /** Taiwan */
  TW = "TW",
  /** Tanzania */
  TZ = "TZ",
  /** Ukraine */
  UA = "UA",
  /** Uganda */
  UG = "UG",
  /** U.S. Outlying Islands */
  UM = "UM",
  /** United States */
  US = "US",
  /** Uruguay */
  UY = "UY",
  /** Uzbekistan */
  UZ = "UZ",
  /** Vatican City */
  VA = "VA",
  /** St. Vincent & Grenadines */
  VC = "VC",
  /** Venezuela */
  VE = "VE",
  /** British Virgin Islands */
  VG = "VG",
  /** Vietnam */
  VN = "VN",
  /** Vanuatu */
  VU = "VU",
  /** Wallis & Futuna */
  WF = "WF",
  /** Samoa */
  WS = "WS",
  /** Kosovo */
  XK = "XK",
  /** Yemen */
  YE = "YE",
  /** Mayotte */
  YT = "YT",
  /** South Africa */
  ZA = "ZA",
  /** Zambia */
  ZM = "ZM",
  /** Zimbabwe */
  ZW = "ZW",
  /** Unknown Region */
  ZZ = "ZZ",
}

const countryCodeToNameMap = new Map<CountryCode, string>([
  [CountryCode.AC, "Ascension Island"],
  [CountryCode.AD, "Andorra"],
  [CountryCode.AE, "United Arab Emirates"],
  [CountryCode.AF, "Afghanistan"],
  [CountryCode.AG, "Antigua & Barbuda"],
  [CountryCode.AI, "Anguilla"],
  [CountryCode.AL, "Albania"],
  [CountryCode.AM, "Armenia"],
  [CountryCode.AN, "Netherlands Antilles"],
  [CountryCode.AO, "Angola"],
  [CountryCode.AR, "Argentina"],
  [CountryCode.AT, "Austria"],
  [CountryCode.AU, "Australia"],
  [CountryCode.AW, "Aruba"],
  [CountryCode.AX, "Åland Islands"],
  [CountryCode.AZ, "Azerbaijan"],
  [CountryCode.BA, "Bosnia & Herzegovina"],
  [CountryCode.BB, "Barbados"],
  [CountryCode.BD, "Bangladesh"],
  [CountryCode.BE, "Belgium"],
  [CountryCode.BF, "Burkina Faso"],
  [CountryCode.BG, "Bulgaria"],
  [CountryCode.BH, "Bahrain"],
  [CountryCode.BI, "Burundi"],
  [CountryCode.BJ, "Benin"],
  [CountryCode.BL, "St. Barthélemy"],
  [CountryCode.BM, "Bermuda"],
  [CountryCode.BN, "Brunei"],
  [CountryCode.BO, "Bolivia"],
  [CountryCode.BQ, "Caribbean Netherlands"],
  [CountryCode.BR, "Brazil"],
  [CountryCode.BS, "Bahamas"],
  [CountryCode.BT, "Bhutan"],
  [CountryCode.BV, "Bouvet Island"],
  [CountryCode.BW, "Botswana"],
  [CountryCode.BY, "Belarus"],
  [CountryCode.BZ, "Belize"],
  [CountryCode.CA, "Canada"],
  [CountryCode.CC, "Cocos (Keeling) Islands"],
  [CountryCode.CD, "Congo - Kinshasa"],
  [CountryCode.CF, "Central African Republic"],
  [CountryCode.CG, "Congo - Brazzaville"],
  [CountryCode.CH, "Switzerland"],
  [CountryCode.CI, "Côte d'Ivoire"],
  [CountryCode.CK, "Cook Islands"],
  [CountryCode.CL, "Chile"],
  [CountryCode.CM, "Cameroon"],
  [CountryCode.CN, "China"],
  [CountryCode.CO, "Colombia"],
  [CountryCode.CR, "Costa Rica"],
  [CountryCode.CU, "Cuba"],
  [CountryCode.CV, "Cape Verde"],
  [CountryCode.CW, "Curaçao"],
  [CountryCode.CX, "Christmas Island"],
  [CountryCode.CY, "Cyprus"],
  [CountryCode.CZ, "Czechia"],
  [CountryCode.DE, "Germany"],
  [CountryCode.DJ, "Djibouti"],
  [CountryCode.DK, "Denmark"],
  [CountryCode.DM, "Dominica"],
  [CountryCode.DO, "Dominican Republic"],
  [CountryCode.DZ, "Algeria"],
  [CountryCode.EC, "Ecuador"],
  [CountryCode.EE, "Estonia"],
  [CountryCode.EG, "Egypt"],
  [CountryCode.EH, "Western Sahara"],
  [CountryCode.ER, "Eritrea"],
  [CountryCode.ES, "Spain"],
  [CountryCode.ET, "Ethiopia"],
  [CountryCode.FI, "Finland"],
  [CountryCode.FJ, "Fiji"],
  [CountryCode.FK, "Falkland Islands"],
  [CountryCode.FO, "Faroe Islands"],
  [CountryCode.FR, "France"],
  [CountryCode.GA, "Gabon"],
  [CountryCode.GB, "United Kingdom"],
  [CountryCode.GD, "Grenada"],
  [CountryCode.GE, "Georgia"],
  [CountryCode.GF, "French Guiana"],
  [CountryCode.GG, "Guernsey"],
  [CountryCode.GH, "Ghana"],
  [CountryCode.GI, "Gibraltar"],
  [CountryCode.GL, "Greenland"],
  [CountryCode.GM, "Gambia"],
  [CountryCode.GN, "Guinea"],
  [CountryCode.GP, "Guadeloupe"],
  [CountryCode.GQ, "Equatorial Guinea"],
  [CountryCode.GR, "Greece"],
  [CountryCode.GS, "South Georgia & South Sandwich Islands"],
  [CountryCode.GT, "Guatemala"],
  [CountryCode.GW, "Guinea-Bissau"],
  [CountryCode.GY, "Guyana"],
  [CountryCode.HK, "Hong Kong SAR"],
  [CountryCode.HM, "Heard & McDonald Islands"],
  [CountryCode.HN, "Honduras"],
  [CountryCode.HR, "Croatia"],
  [CountryCode.HT, "Haiti"],
  [CountryCode.HU, "Hungary"],
  [CountryCode.ID, "Indonesia"],
  [CountryCode.IE, "Ireland"],
  [CountryCode.IL, "Israel"],
  [CountryCode.IM, "Isle of Man"],
  [CountryCode.IN, "India"],
  [CountryCode.IO, "British Indian Ocean Territory"],
  [CountryCode.IQ, "Iraq"],
  [CountryCode.IR, "Iran"],
  [CountryCode.IS, "Iceland"],
  [CountryCode.IT, "Italy"],
  [CountryCode.JE, "Jersey"],
  [CountryCode.JM, "Jamaica"],
  [CountryCode.JO, "Jordan"],
  [CountryCode.JP, "Japan"],
  [CountryCode.KE, "Kenya"],
  [CountryCode.KG, "Kyrgyzstan"],
  [CountryCode.KH, "Cambodia"],
  [CountryCode.KI, "Kiribati"],
  [CountryCode.KM, "Comoros"],
  [CountryCode.KN, "St. Kitts & Nevis"],
  [CountryCode.KP, "North Korea"],
  [CountryCode.KR, "South Korea"],
  [CountryCode.KW, "Kuwait"],
  [CountryCode.KY, "Cayman Islands"],
  [CountryCode.KZ, "Kazakhstan"],
  [CountryCode.LA, "Laos"],
  [CountryCode.LB, "Lebanon"],
  [CountryCode.LC, "St. Lucia"],
  [CountryCode.LI, "Liechtenstein"],
  [CountryCode.LK, "Sri Lanka"],
  [CountryCode.LR, "Liberia"],
  [CountryCode.LS, "Lesotho"],
  [CountryCode.LT, "Lithuania"],
  [CountryCode.LU, "Luxembourg"],
  [CountryCode.LV, "Latvia"],
  [CountryCode.LY, "Libya"],
  [CountryCode.MA, "Morocco"],
  [CountryCode.MC, "Monaco"],
  [CountryCode.MD, "Moldova"],
  [CountryCode.ME, "Montenegro"],
  [CountryCode.MF, "St. Martin"],
  [CountryCode.MG, "Madagascar"],
  [CountryCode.MK, "North Macedonia"],
  [CountryCode.ML, "Mali"],
  [CountryCode.MM, "Myanmar (Burma)"],
  [CountryCode.MN, "Mongolia"],
  [CountryCode.MO, "Macao SAR"],
  [CountryCode.MQ, "Martinique"],
  [CountryCode.MR, "Mauritania"],
  [CountryCode.MS, "Montserrat"],
  [CountryCode.MT, "Malta"],
  [CountryCode.MU, "Mauritius"],
  [CountryCode.MV, "Maldives"],
  [CountryCode.MW, "Malawi"],
  [CountryCode.MX, "Mexico"],
  [CountryCode.MY, "Malaysia"],
  [CountryCode.MZ, "Mozambique"],
  [CountryCode.NA, "Namibia"],
  [CountryCode.NC, "New Caledonia"],
  [CountryCode.NE, "Niger"],
  [CountryCode.NF, "Norfolk Island"],
  [CountryCode.NG, "Nigeria"],
  [CountryCode.NI, "Nicaragua"],
  [CountryCode.NL, "Netherlands"],
  [CountryCode.NO, "Norway"],
  [CountryCode.NP, "Nepal"],
  [CountryCode.NR, "Nauru"],
  [CountryCode.NU, "Niue"],
  [CountryCode.NZ, "New Zealand"],
  [CountryCode.OM, "Oman"],
  [CountryCode.PA, "Panama"],
  [CountryCode.PE, "Peru"],
  [CountryCode.PF, "French Polynesia"],
  [CountryCode.PG, "Papua New Guinea"],
  [CountryCode.PH, "Philippines"],
  [CountryCode.PK, "Pakistan"],
  [CountryCode.PL, "Poland"],
  [CountryCode.PM, "St. Pierre & Miquelon"],
  [CountryCode.PN, "Pitcairn Islands"],
  [CountryCode.PS, "Palestinian Territories"],
  [CountryCode.PT, "Portugal"],
  [CountryCode.PY, "Paraguay"],
  [CountryCode.QA, "Qatar"],
  [CountryCode.RE, "Réunion"],
  [CountryCode.RO, "Romania"],
  [CountryCode.RS, "Serbia"],
  [CountryCode.RU, "Russia"],
  [CountryCode.RW, "Rwanda"],
  [CountryCode.SA, "Saudi Arabia"],
  [CountryCode.SB, "Solomon Islands"],
  [CountryCode.SC, "Seychelles"],
  [CountryCode.SD, "Sudan"],
  [CountryCode.SE, "Sweden"],
  [CountryCode.SG, "Singapore"],
  [CountryCode.SH, "St. Helena"],
  [CountryCode.SI, "Slovenia"],
  [CountryCode.SJ, "Svalbard & Jan Mayen"],
  [CountryCode.SK, "Slovakia"],
  [CountryCode.SL, "Sierra Leone"],
  [CountryCode.SM, "San Marino"],
  [CountryCode.SN, "Senegal"],
  [CountryCode.SO, "Somalia"],
  [CountryCode.SR, "Suriname"],
  [CountryCode.SS, "South Sudan"],
  [CountryCode.ST, "São Tomé & Príncipe"],
  [CountryCode.SV, "El Salvador"],
  [CountryCode.SX, "Sint Maarten"],
  [CountryCode.SY, "Syria"],
  [CountryCode.SZ, "Eswatini"],
  [CountryCode.TA, "Tristan da Cunha"],
  [CountryCode.TC, "Turks & Caicos Islands"],
  [CountryCode.TD, "Chad"],
  [CountryCode.TF, "French Southern Territories"],
  [CountryCode.TG, "Togo"],
  [CountryCode.TH, "Thailand"],
  [CountryCode.TJ, "Tajikistan"],
  [CountryCode.TK, "Tokelau"],
  [CountryCode.TL, "Timor-Leste"],
  [CountryCode.TM, "Turkmenistan"],
  [CountryCode.TN, "Tunisia"],
  [CountryCode.TO, "Tonga"],
  [CountryCode.TR, "Türkiye"],
  [CountryCode.TT, "Trinidad & Tobago"],
  [CountryCode.TV, "Tuvalu"],
  [CountryCode.TW, "Taiwan"],
  [CountryCode.TZ, "Tanzania"],
  [CountryCode.UA, "Ukraine"],
  [CountryCode.UG, "Uganda"],
  [CountryCode.UM, "U.S. Outlying Islands"],
  [CountryCode.US, "United States"],
  [CountryCode.UY, "Uruguay"],
  [CountryCode.UZ, "Uzbekistan"],
  [CountryCode.VA, "Vatican City"],
  [CountryCode.VC, "St. Vincent & Grenadines"],
  [CountryCode.VE, "Venezuela"],
  [CountryCode.VG, "British Virgin Islands"],
  [CountryCode.VN, "Vietnam"],
  [CountryCode.VU, "Vanuatu"],
  [CountryCode.WF, "Wallis & Futuna"],
  [CountryCode.WS, "Samoa"],
  [CountryCode.XK, "Kosovo"],
  [CountryCode.YE, "Yemen"],
  [CountryCode.YT, "Mayotte"],
  [CountryCode.ZA, "South Africa"],
  [CountryCode.ZM, "Zambia"],
  [CountryCode.ZW, "Zimbabwe"],
  [CountryCode.ZZ, "Unknown Region"],
]);

/**
 * Returns an array of all the values in the CountryCode enum.
 * @returns {CountryCode[]} An array of CountryCode enum values.
 */
export function getCountryCodeEnumValues(): CountryCode[] {
  return Object.values(CountryCode);
}

/**
 * Converts an array of country codes to an array of corresponding country names.
 * @param codes - An array of country codes.
 * @returns An array of country names.
 */
export function countryCodesToCountryNames(codes: CountryCode[]): string[] {
  return codes.map((code) => countryCodesToCountryName(code));
}

/**
 * Converts a country code to its corresponding country name.
 * @param code The country code to convert.
 * @returns The corresponding country name, or "Unknown Region" if the code is not found.
 */
export function countryCodesToCountryName(code: CountryCode): string {
  return countryCodeToNameMap.get(code) ?? "Unknown Region";
}
