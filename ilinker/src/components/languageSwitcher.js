'use client'

import { useTranslation } from '@/hooks/useTranslation';

const LanguageSwitcher = () => {
    const { locale, changeLanguage } = useTranslation();

    return (
        <div>
            <select
                value={locale}
                onChange={changeLanguage}
                aria-label="Select language"
            >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;
