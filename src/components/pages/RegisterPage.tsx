import { useMemo, useState, type FormEvent } from 'react';
import { UserPlus } from 'lucide-react';
import {
  Button,
  Checkbox,
  Input,
} from '../../lib';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useI18n } from '../../i18n';

interface RegisterPageProps {
  onRegister: (payload: { name: string; email: string; password: string }) => Promise<void> | void;
  onLogin: () => void;
  onGuest: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onBack: () => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPage({ onRegister, onLogin, onGuest, onPrivacy, onTerms, onBack }: RegisterPageProps) {
  const { t } = useI18n();
  const pp = t.publicPages;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nameError = useMemo(() => {
    const value = name.trim();

    if (!value) {
      return pp.validationNameRequired;
    }

    if (value.length < 2) {
      return pp.validationNameShort;
    }

    return '';
  }, [name, pp.validationNameRequired, pp.validationNameShort]);

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

  const termsError = attempted && !terms ? pp.validationTermsRequired : '';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    if (nameError || emailError || passwordError || !terms) {
      return;
    }

    setSubmitting(true);

    try {
      await onRegister({ name: name.trim(), email: email.trim(), password });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vx-auth-page">
      <header className="vx-auth-topbar">
        <div className="vx-auth-topbar__brand"><img src="/colorful_flat_icon.svg" alt="vxUI" height={24} /></div>
        <div className="vx-auth-topbar__actions">
          <LanguageSwitcher variant="inline" />
          <Button variant="outline" size="sm" onClick={onBack}>{pp.backHome}</Button>
        </div>
      </header>

      <div className="vx-auth-card">
        <div className="vx-auth-card__logo"><img src="/colorful_flat_icon.svg" alt="vxUI" height={48} /></div>
        <div className="vx-auth-card__body">
          <div className="vx-auth__header">
            <h2>{pp.registerTitle}</h2>
            <p>{pp.registerSubtitle}</p>
          </div>

          <form className="vx-auth__form" noValidate onSubmit={handleSubmit}>
            <Input
              autoComplete="name"
              error={attempted ? nameError : undefined}
              label={pp.registerName}
              onChange={(event) => setName(event.target.value)}
              placeholder={pp.registerNamePlaceholder}
              value={name}
            />
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
              autoComplete="new-password"
              error={attempted ? passwordError : undefined}
              label={pp.loginPassword}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={pp.registerPasswordPlaceholder}
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
            <div className="vx-auth__row" style={{ marginTop: '4px' }}>
              <Checkbox
                checked={terms}
                label={
                  <span>
                    {pp.registerTermsAgree}{' '}
                    <button type="button" className="vx-link" onClick={onTerms}>
                      {pp.registerTermsLink}
                    </button>
                    {' '}
                    {pp.registerTermsAnd}
                    {' '}
                    <button type="button" className="vx-link" onClick={onPrivacy}>
                      {pp.registerPrivacyLink}
                    </button>
                  </span>
                }
                onChange={(event) => setTerms(event.target.checked)}
              />
            </div>
            {termsError && (
              <div style={{ color: 'var(--vx-danger)', fontSize: '0.75rem', marginTop: '-8px' }}>
                {termsError}
              </div>
            )}
            <Button disabled={submitting} fullWidth type="submit" size="lg">
              <UserPlus size={16} />
              {pp.registerCta}
            </Button>
          </form>

          <p className="vx-auth__footer">
            {pp.registerHasAccount}{' '}
            <button type="button" className="vx-link" onClick={onLogin}>
              {pp.navLogin}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
