import { useMemo, useState, type FormEvent } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import {
  Button,
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
    <div className="vx-auth-page">
      <header className="vx-auth-topbar">
        <div className="vx-auth-topbar__brand">vx<span>UI</span></div>
        <div className="vx-auth-topbar__actions">
          <LanguageSwitcher variant="inline" />
          <button type="button" className="vx-lang-drop__trigger" style={{ width: 'auto' }} onClick={onBack}>
            {pp.backHome}
          </button>
        </div>
      </header>

      <div className="vx-auth-card">
        <div className="vx-auth-card__logo">vx<span>UI</span></div>
        <div className="vx-auth-card__body">
          <div className="vx-auth__header">
            <h2>{pp.loginTitle}</h2>
            <p>{pp.loginSubtitle}</p>
          </div>

          <form className="vx-auth__form" noValidate onSubmit={handleSubmit}>
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

          <p className="vx-auth__footer">
            {pp.loginNoAccount}{' '}
            <button type="button" className="vx-link" onClick={onRegister}>
              {pp.loginRegister}
            </button>
          </p>
          <p className="vx-auth__footer vx-auth__footer--muted">
            <ShieldCheck size={13} />
            <span>{pp.previewAccessGuest}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
