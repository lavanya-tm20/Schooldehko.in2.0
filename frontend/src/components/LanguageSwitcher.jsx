import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import i18n from '../i18n';

export default function LanguageSwitcher() {
  const [lang, setLang] = React.useState(i18n.language || 'en');

  const handle = (_e, value) => {
    if (!value) return;
    setLang(value);
    i18n.changeLanguage(value);
  };

  return (
    <ToggleButtonGroup size="small" color="secondary" value={lang} exclusive onChange={handle}>
      <ToggleButton value="en">EN</ToggleButton>
      <ToggleButton value="hi">हिंदी</ToggleButton>
    </ToggleButtonGroup>
  );
}
