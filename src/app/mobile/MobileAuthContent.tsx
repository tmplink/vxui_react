/**
 * MobileAuthContent — 移动端登录/注册页面
 */
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Checkbox } from '../../components/Checkbox';
import { Sparkles } from 'lucide-react';

interface MobileAuthContentProps {
  mode: 'login' | 'register';
  t: Record<string, any>;
  onSwitchMode: () => void;
  onBack: () => void;
}

export function MobileAuthContent({ mode, t, onSwitchMode }: MobileAuthContentProps) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const pp = t.publicPages;
  const isZh = t.locale === 'zh';

  if (mode === 'login') {
    return (
      <div className="vxm-auth-screen">
        <div className="vxm-auth-screen__body">
          <div className="vxm-auth-screen__icon"><Sparkles size={38} /></div>
          <h1 className="vxm-auth-screen__title">{pp.loginCta}</h1>
          <div className="vxm-auth-screen__fields">
            <div>
              <span className="vxm-auth-screen__label">{pp.loginEmail}</span>
              <Input type="email" placeholder={pp.loginEmailPlaceholder} />
            </div>
            <div>
              <span className="vxm-auth-screen__label">{pp.loginPassword}</span>
              <Input type="password" placeholder={pp.loginPasswordPlaceholder} />
            </div>
            <p className="vxm-auth-screen__forgot">
              <button type="button" className="vxm-auth-screen__forgot-btn">
                {isZh ? '忘记密码？来这里找回' : 'Forgot password?'}
              </button>
            </p>
          </div>
        </div>
        <div className="vxm-auth-screen__actions">
          <Button shape="pill" style={{ width: '100%', minHeight: 52, fontSize: '1rem', fontWeight: 600 }}>
            {pp.loginCta}
          </Button>
          <p className="vxm-auth-screen__footer-link">
            {pp.loginNoAccount}{' '}
            <button type="button" onClick={onSwitchMode}>
              {isZh ? '点这里注册' : pp.loginRegister}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vxm-auth-screen">
      <div className="vxm-auth-screen__body">
        <div className="vxm-auth-screen__icon"><Sparkles size={38} /></div>
        <h1 className="vxm-auth-screen__title">{pp.registerCta}</h1>
        <div className="vxm-auth-screen__fields">
          <div>
            <span className="vxm-auth-screen__label">{pp.registerName}</span>
            <Input placeholder={pp.registerNamePlaceholder} />
          </div>
          <div>
            <span className="vxm-auth-screen__label">{pp.registerEmail}</span>
            <Input type="email" placeholder={pp.registerEmailPlaceholder} />
          </div>
          <div>
            <span className="vxm-auth-screen__label">{pp.registerPassword}</span>
            <Input type="password" placeholder={pp.registerPasswordPlaceholder} />
          </div>
          <Checkbox
            label={`${pp.registerTermsAgree} ${pp.registerTermsLink} ${pp.registerTermsAnd} ${pp.registerPrivacyLink}`}
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
          />
        </div>
      </div>
      <div className="vxm-auth-screen__actions">
        <Button shape="pill" style={{ width: '100%', minHeight: 52, fontSize: '1rem', fontWeight: 600 }}>
          {pp.registerCta}
        </Button>
        <p className="vxm-auth-screen__footer-link">
          {pp.registerHasAccount}{' '}
          <button type="button" onClick={onSwitchMode}>
            {isZh ? '点这里登录' : pp.registerLogin}
          </button>
        </p>
      </div>
    </div>
  );
}
