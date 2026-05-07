import { LogIn } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '../../lib';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useI18n } from '../../i18n';

interface LoginPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onRegister, onGuest, onBack }: LoginPageProps) {
  const { t } = useI18n();
  const pp = t.publicPages;

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
              <CardTitle>{pp.loginTitle}</CardTitle>
              <CardDescription>{pp.loginSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-stack">
                <Input label={pp.loginEmail} type="email" placeholder="you@example.com" />
                <Input label={pp.loginPassword} type="password" placeholder="••••••••" />
                <Button style={{ width: '100%' }} onClick={onLogin}>
                  <LogIn size={14} />
                  {pp.loginCta}
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="vx-auth__footer">
            {pp.loginNoAccount}{' '}
            <button type="button" className="vx-link" onClick={onRegister}>
              {pp.loginRegister}
            </button>
          </p>
          <p className="vx-auth__footer">
            <button type="button" className="vx-link" onClick={onGuest}>
              {pp.loginGuest}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
