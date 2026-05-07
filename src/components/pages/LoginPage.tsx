import { useMemo, useState, type FormEvent } from 'react';
import { Check, LogIn, ShieldCheck } from 'lucide-react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  Input,
} from '../../lib';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useI18n } from '../../i18n';

interface LoginPageProps {
  onLogin: (payload: { email: string; password: string; remember: boolean }) => Promise<void> | void;
  onRegister: () => void;
  onGuest: () => void;
  onBack: () => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage({ onLogin, onRegister, onGuest, onBack }: LoginPageProps) {
  const { t } = useI18n();
  const pp = t.publicPages;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailError = useMemo(() => {
    const value = email.trim();

    if (!value) {
      return pp.validationEmailRequired;
    }

    if (!emailPattern.test(value)) {
      return pp.validationEmailInvalid;
    }

    return '';
  }, [email, pp.validationEmailInvalid, pp.validationEmailRequired]);

  const passwordError = useMemo(() => {
    if (!password) {
      return pp.validationPasswordRequired;
    }

    if (password.length < 8) {
      return pp.validationPasswordShort;
    }

    return '';
  }, [password, pp.validationPasswordRequired, pp.validationPasswordShort]);

  const featureItems = [
    { title: pp.feat1, desc: pp.feat1Desc },
    { title: pp.feat2, desc: pp.feat2Desc },
    { title: pp.feat3, desc: pp.feat3Desc },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    if (emailError || passwordError) {
      return;
    }

    setSubmitting(true);

    try {
      await onLogin({ email: email.trim(), password, remember });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vx-auth-layout">
      {/* Left visual side */}
      <div className="vx-auth-layout__visual">
        <div className="vx-auth-nav__brand" style={{ display: 'flex' }}>
          vx<span>UI</span>
        </div>
        
        <div className="vx-auth-promo">
          <h1 className="vx-auth-promo__title">{pp.heroTitle}</h1>
          <p className="vx-auth-promo__lead">{pp.heroLead}</p>
          <div className="vx-auth-promo__list">
            {featureItems.map((item) => (
              <div key={item.title} className="vx-auth-promo__item">
                <span className="vx-auth-promo__item-icon">
                  <Check size={16} />
                </span>
                <div>
                  <div className="vx-auth-promo__item-title">{item.title}</div>
                  <div className="vx-auth-promo__item-copy">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form side */}
      <div className="vx-auth-layout__form-area">
        <header className="vx-auth-nav">
          <div className="vx-auth-nav__brand">
            vx<span>UI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <LanguageSwitcher variant="inline" />
            <button type="button" className="vx-link" onClick={onBack}>
              {pp.backHome}
            </button>
          </div>
        </header>

        <section className="vx-auth-panel">
          <div className="vx-auth__header">
            <h2>{pp.loginTitle}</h2>
            <p>{pp.loginSubtitle}</p>
          </div>
          
          <Card className="vx-auth__surface">
            <CardContent>
              <form className="vx-auth__form" noValidate onSubmit={handleSubmit}>
                <Alert title={pp.authInfoTitle} variant="info">
                  {pp.authInfoBody}
                </Alert>
                <Input
                  autoComplete="email"
                  error={attempted ? emailError : undefined}
                  label={pp.loginEmail}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={pp.loginEmailPlaceholder}
                  type="email"
                  value={email}
                />
                <Input
                  autoComplete="current-password"
                  error={attempted ? passwordError : undefined}
                  label={pp.loginPassword}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={pp.loginPasswordPlaceholder}
                  suffix={(
                    <button
                      type="button"
                      className="vx-auth__toggle"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? pp.hidePassword : pp.showPassword}
                    </button>
                  )}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <div className="vx-auth__row">
                  <Checkbox
                    checked={remember}
                    label={pp.rememberMe}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <button type="button" className="vx-link" onClick={onGuest}>
                    {pp.loginGuest}
                  </button>
                </div>
                <Button disabled={submitting} fullWidth type="submit" size="lg">
                  <LogIn size={16} />
                  {pp.loginCta}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="vx-auth__footer">
            {pp.loginNoAccount}{' '}
            <button type="button" className="vx-link" onClick={onRegister}>
              {pp.loginRegister}
            </button>
          </p>
          <p className="vx-auth__footer vx-auth__footer--muted">
            <ShieldCheck size={14} />
            <span>{pp.previewAccessGuest}</span>
          </p>
        </section>
      </div>
    </div>
  );
}
