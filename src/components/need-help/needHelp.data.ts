import type { NeedHelpResponse } from './needHelp.types';

export const needHelpResponse: NeedHelpResponse = {
  pageLabel: {
    ar: 'أحتاج مساعدة',
    en: 'Need Help',
  },
  heroTitle: {
    ar: 'أحتاج مساعدة',
    en: 'Need Help',
  },
  heroSubtitle: {
    ar: 'اختر نوع المساعدة التي تحتاجها',
    en: 'Choose the type of support you need',
  },
  searchPlaceholder: {
    ar: 'ابحث عن منظمة أو منطقة...',
    en: 'Search for an organization or area...',
  },
  resultsLabel: {
    ar: '20 / 30 منظمة',
    en: '20 / 30 organizations',
  },
  showMoreLabel: {
    ar: 'عرض المزيد (10 متبقية)',
    en: 'Show more (10 remaining)',
  },
  filters: [
    {
      id: 'nearest',
      icon: 'location',
      active: true,
      label: {
        ar: 'الأقرب لموقعي',
        en: 'Closest to me',
      },
    },
    {
      id: 'food',
      icon: 'food',
      label: {
        ar: 'طعام ومياه',
        en: 'Food and water',
      },
    },
    {
      id: 'medical',
      icon: 'medical',
      label: {
        ar: 'طبي وصحي',
        en: 'Medical care',
      },
    },
    {
      id: 'shelter',
      icon: 'shelter',
      label: {
        ar: 'مأوى وسكن',
        en: 'Shelter and housing',
      },
    },
    {
      id: 'clothes',
      icon: 'clothes',
      label: {
        ar: 'ملابس وبطانيات',
        en: 'Clothes and blankets',
      },
    },
  ],
  services: [
    {
      id: 'rapid-relief',
      icon: 'shelter',
      title: {
        ar: 'الإغاثة السريعة',
        en: 'Rapid Relief',
      },
      category: {
        ar: 'مأوى وسكن',
        en: 'Shelter and housing',
      },
      description: {
        ar: 'مأوى مؤقت، خيام',
        en: 'Temporary shelter and tents',
      },
      location: {
        ar: 'بيروت، طرابلس، صيدا',
        en: 'Beirut, Tripoli, Sidon',
      },
      updatedAtLabel: {
        ar: 'منذ 5 دقائق',
        en: 'Updated 5 min ago',
      },
      mapLabel: {
        ar: 'خريطة',
        en: 'Map',
      },
      action: {
        type: 'phone',
        value: '1900',
        href: 'tel:1900',
        label: {
          ar: 'اتصل 1900',
          en: 'Call 1900',
        },
      },
    },
    {
      id: 'food-bank',
      icon: 'food',
      title: {
        ar: 'بنك الطعام',
        en: 'Food Bank',
      },
      category: {
        ar: 'طعام ومياه',
        en: 'Food and water',
      },
      description: {
        ar: 'سلال غذائية، معلبات',
        en: 'Food baskets and canned goods',
      },
      location: {
        ar: 'بيروت، طرابلس، صيدا',
        en: 'Beirut, Tripoli, Sidon',
      },
      updatedAtLabel: {
        ar: 'منذ 10 دقائق',
        en: 'Updated 10 min ago',
      },
      mapLabel: {
        ar: 'خريطة',
        en: 'Map',
      },
      action: {
        type: 'whatsapp',
        value: '1900',
        href: 'https://wa.me/1900',
        label: {
          ar: 'واتساب 1900',
          en: 'WhatsApp 1900',
        },
      },
    },
    {
      id: 'screening-center',
      icon: 'shelter',
      title: {
        ar: 'مركز الفحص الشامل',
        en: 'Comprehensive Screening Center',
      },
      category: {
        ar: 'مأوى وسكن',
        en: 'Shelter and housing',
      },
      description: {
        ar: 'فحوصات طبية شاملة وخدمات تطعيم',
        en: 'Medical screening and vaccination services',
      },
      location: {
        ar: 'صيدا',
        en: 'Sidon',
      },
      updatedAtLabel: {
        ar: 'منذ يوم',
        en: 'Updated 1 day ago',
      },
      mapLabel: {
        ar: 'خريطة',
        en: 'Map',
      },
      action: {
        type: 'phone',
        value: '1234-800',
        href: 'tel:1234800',
        label: {
          ar: 'اتصل 1234-800',
          en: 'Call 1234-800',
        },
      },
    },
    {
      id: 'hope-association',
      icon: 'clothes',
      title: {
        ar: 'جمعية الأمل',
        en: 'Hope Association',
      },
      category: {
        ar: 'ملابس وبطانيات',
        en: 'Clothes and blankets',
      },
      description: {
        ar: 'دعم ورعاية صحية للمحتاجين',
        en: 'Support and care for people in need',
      },
      location: {
        ar: 'بيروت',
        en: 'Beirut',
      },
      updatedAtLabel: {
        ar: 'منذ 10 أيام',
        en: 'Updated 10 days ago',
      },
      mapLabel: {
        ar: 'خريطة',
        en: 'Map',
      },
      action: {
        type: 'phone',
        value: '4567-700',
        href: 'tel:4567700',
        label: {
          ar: 'اتصل 4567-700',
          en: 'Call 4567-700',
        },
      },
    },
  ],
};
