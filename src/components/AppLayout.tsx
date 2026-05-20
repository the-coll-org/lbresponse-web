import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MobileNavbar, { type NavbarTab } from './ui/MobileNavbar';
import HelpCenterScreen from './HelpCenterScreen';
import NeedHelpScreen from './need-help/NeedHelpScreen';
import MapScreen from './map/MapScreen';
import { ScreenHeader } from './ui/ScreenHeader';
import { HelpCenterHeaderActions } from './help-center/HelpCenterHeaderActions';

interface AppLayoutProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export default function AppLayout({
  theme,
  onToggleTheme,
  onToggleLanguage,
}: AppLayoutProps) {
  const [activeTab, setActiveTab] = useState<NavbarTab>('main');
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ar';
  const languageToggleLabel = language.startsWith('ar') ? 'EN' : 'AR';

  const headerTitles: Record<NavbarTab, string> = {
    main: t('needHelp.title'),
    hotlines: t('helpCenter.title'),
    map: t('map.title'),
  };

  const headerSubtitles: Record<NavbarTab, string | undefined> = {
    main: t('needHelp.subtitle'),
    hotlines: t('helpCenter.subtitle'),
    map: t('map.subtitle'),
  };

  return (
    <div className="relative min-h-screen">
      <ScreenHeader
        title={headerTitles[activeTab]}
        subtitle={headerSubtitles[activeTab]}
        actions={
          <HelpCenterHeaderActions
            theme={theme}
            languageToggleLabel={languageToggleLabel}
            languageToggleAriaLabel={t('common.toggleLanguage')}
            themeToggleAriaLabel={t('common.toggleTheme')}
            onToggleLanguage={onToggleLanguage}
            onToggleTheme={onToggleTheme}
          />
        }
      />
      <main className="pb-[calc(72px+env(safe-area-inset-bottom)+24px)]">
        {activeTab === 'main' && <NeedHelpScreen />}
        {activeTab === 'hotlines' && <HelpCenterScreen />}
        {activeTab === 'map' && <MapScreen />}
      </main>

      <MobileNavbar
        selected={activeTab}
        onSelect={setActiveTab}
        className="fixed bottom-0 inset-x-0 z-50 flex justify-center px-16 pb-[calc(env(safe-area-inset-bottom)+12px)]"
      />
    </div>
  );
}
