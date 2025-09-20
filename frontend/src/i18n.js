import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: 'SchoolDekho.in',
      home: 'Home',
      loans: 'Loans',
      myLoans: 'My Loans',
      searchPlaceholder: 'Search schools by name, city, board...',
      compare: 'Compare',
      applyLoan: 'Apply for Loan',
      search: 'Search',
      reset: 'Reset',
      scholarships: 'Scholarships',
      alumni: 'Alumni',
      fundraising: 'Fundraising',
      policies: 'Policies',
      heroTitle: 'Find the Perfect School for Your Child',
      heroSubtitle: "Discover, compare, and connect with the best educational institutions. From loans to scholarships, we've got your educational journey covered.",
      heroCtaApply: 'Apply for Loan',
      heroCtaEligibility: 'Check Eligibility',
      heroCtaExplore: 'Explore'
    }
  },
  hi: {
    translation: {
      appTitle: 'स्कूलदेखो.इन',
      home: 'होम',
      loans: 'शिक्षा ऋण',
      myLoans: 'मेरे ऋण',
      searchPlaceholder: 'स्कूल नाम, शहर, बोर्ड से खोजें...',
      compare: 'तुलना',
      applyLoan: 'ऋण के लिए आवेदन',
      search: 'खोजें',
      reset: 'रीसेट',
      scholarships: 'वृत्तियाँ',
      alumni: 'पूर्व छात्र',
      fundraising: 'धन संग्रह',
      policies: 'नीतियाँ',
      heroTitle: 'अपने बच्चे के लिए उपयुक्त स्कूल खोजें',
      heroSubtitle: 'खोजें, तुलना करें और सर्वश्रेष्ठ शैक्षिक संस्थानों से जुड़ें। ऋण से लेकर वृत्तियों तक, आपकी शिक्षा यात्रा यहीं पूरी।',
      heroCtaApply: 'ऋण के लिए आवेदन',
      heroCtaEligibility: 'पात्रता जाँचें',
      heroCtaExplore: 'एक्सप्लोर करें'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
