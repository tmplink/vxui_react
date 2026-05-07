import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Input } from '../../lib';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useI18n } from '../../i18n';

interface RegisterPageProps {
  onRegister: () => void;
  onLogin: () => void;
  onGuest: () => void;
  onBack: () => void;
}

export function RegisterPage({ onRegister, onLogin, onGuest, onBack }: RegisterPageProps) {
  const { t } = useI18n();
  const pp = t.publicPages;
  const [terms, setTerms] = useState(false);

  return (
    <div className="vx-public">
      <header className="vx-public-nav">
        <div className="vx-public-nav__brand">vxUI</div>
        <div className="vx-public-nav__links">
          <LanguageSwitcher variant="inline" />
          <button type="button" className="vx-link" onClick={onBack}>{pp.backHome}</button>
        </div>
      </header>

      <div className="vx-auth">
        <div className="vx-auth__card">
          <div className="vx-auth__logo">vxUI</div>
          <Card>
            <CardHeader>
              <CardTitle>{pp.registerTitle}</CardTitle>
              <CardDescription>{pp.registerSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-stack">
                <Input label={pp.registerName} placeholder="Jane Smith" />
                <Input label={pp.registerEmail} type="email" placeholder="you@example.com" />
                <Input label={pp.registerPassword} type="password" placeholder="••••••••" />
                <Checkbox
                  label={pp.registerTerms}
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <Button style={{ width: '100%' }} onClick={onRegister}>
                  <UserPlus size={14} />
                  {pp.registerCta}
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="vx-auth__footer">
            {pp.registerHasAccount}{' '}
            <button type="button" className="vx-link" onClick={onLogin}>
              {pp.registerLogin}
            </button>
          </p>
          <p className="vx-auth__footer">
            <button type="button" className="vx-link" onClick={onGuest}>
              {pp.registerGuest}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
