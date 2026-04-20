export const mobileCodeList = [
  {
    code: 60,
    label: "MY +60",
    country: "Malaysia",
    // 60 + 1X + 7/8 digits = 10–11 digits
    // regex: /^(60)1(([0145](-|\s)?\d{7,8})|([236-9](-|\s)?\d{7}))$/,
    regex:
      /^(60)1(([1](-|\s)?\d{8})|([04](-|\s)?\d{7,8})|([236-9](-|\s)?\d{7}))$/,
    icon: "circle-flags:my",
  },
  {
    code: 65,
    label: "SG +65",
    country: "Singapore",
    // 65 + [3/6/8/9] + 7 digits
    regex: /^(65)?[3689]\d{7}$/,
    icon: "circle-flags:sg",
  },
  {
    code: 673,
    label: "BN +673",
    country: "Brunei",
    // 673 + [2–9] + 6 digits
    regex: /^673[2-9]\d{6}$/,
    icon: "circle-flags:bn",
  },
  {
    code: 62,
    label: "ID +62",
    country: "Indonesia",
    // 62 + 8 + up to 10 digits
    regex:
      /^(62)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
    icon: "circle-flags:id",
  },
  {
    code: 63,
    label: "PH +63",
    country: "Philippines",
    // 63 + 9 + 9 digits
    regex: /^(639)\d{9}$/,
    icon: "circle-flags:ph",
  },
  {
    code: 852,
    label: "HK +852",
    country: "Hong Kong",
    // 852 + [5/6/8/9] + 7 digits
    regex: /^(852)?[456789]\d{3}[-\s]?\d{4}$/,
    icon: "circle-flags:hk",
  },
  {
    code: 91,
    label: "IN +91",
    country: "India",
    // 91 + [6–9] + 9 digits
    regex: /^(91)?[6789]\d{9}$/,
    icon: "circle-flags:in",
  },
  {
    code: 94,
    label: "LK +94",
    country: "Sri Lanka",
    // 94 + 7 + 8 digits
    regex: /^947\d{8}$/,
    icon: "circle-flags:lk",
  },
  {
    code: 66,
    country: "Thailand",
    label: "TH +66",
    // 66 + [6–9] + 8 digits
    regex: /^(66)\d{9}$/,
    icon: "circle-flags:th",
  },
  {
    code: 44,
    label: "GB +44",
    country: "United Kingdom (England)",
    // 44 + 7 + 9 digits
    regex: /^(44)7\d{9}$/,
    icon: "circle-flags:gb",
  },
  {
    code: 886,
    label: "TW +886",
    country: "Taiwan",
    // 886 + 9 + 8 digits
    regex: /^(886)?9\d{8}$/,
    icon: "circle-flags:tw",
  },
  {
    code: 81,
    label: "JP +81",
    country: "Japan",
    regex: /^(81)[789]0\d{4}\d{4}$/,
    icon: "circle-flags:jp"
  },
  {
    code: 82,
    label: "KR +82",
    country: "South Korea",
    regex: /^(82)(10|[2-6][1-5]?)\d{7,8}$/,
    icon: "circle-flags:kr"
  },
  {
    code: 86,
    label: "CN +86",
    country: "China",
    regex: /^(86)[1-9]\d{8,12}$/,
    icon: "circle-flags:cn"
  },
  {
    code: 84,
    label: "VN +84",
    country: "Vietnam",
    regex: /^(84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/,
    icon: "circle-flags:vn"
  },
  {
    code: 855,
    label: "KH +855",
    country: "Cambodia",
    regex: /^(855)(1[0-8]|6[016-9]|7[016-8]|8[013-9]|9[0-35-9])\d{6,7}$/,
    icon: "circle-flags:kh"
  },
  {
    code: 856,
    label: "LA +856",
    country: "Laos",
    regex: /^(856)20\d{8}$/,
    icon: "circle-flags:la"
  },
  {
    code: 95,
    label: "MM +95",
    country: "Myanmar",
    regex: /^(95)\d{7,11}$/,
    icon: "circle-flags:mm"
  },
  {
    code: null,
    label: "Other +",
    country: "Other",
    regex: /^\d{5,15}$/,
    icon: "circle-flags:lang-xx",
  },
]

