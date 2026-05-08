import { AlertTriangle, ArrowLeft, House, Search } from 'lucide-react';
import { useI18n } from '../../i18n';
import { Badge, Button, Card, CardContent } from '../../lib';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface ErrorPageProps {
  statusCode?: number;
  requestedPath?: string;
  onHome: () => void;
  onDocs: () => void;
  onBack: () => void;
}

export function ErrorPage({
  statusCode = 404,
  requestedPath,
  onHome,
  onDocs,
  onBack,
}: ErrorPageProps) {
  const { t, locale } = useI18n();
  const isZh = locale === 'zh';
  const copy = isZh
    ? {
        badge: statusCode === 404 ? '页面未找到' : '出现异常',
        title: statusCode === 404 ? '这一页不存在，或者已经被移动。' : '页面暂时不可用。',
        body:
          statusCode === 404
            ? '你访问的地址没有对应内容。现在可以直接回到首页、重新进入文档库，或返回上一步。'
            : '当前页面没有成功加载，但应用整体仍可继续使用。建议先回到稳定入口。',
        pathLabel: '请求路径',
        goHome: '返回首页',
        goDocs: '进入文档库',
        goBack: '返回上一步',
      }
    : {
        badge: statusCode === 404 ? 'Page not found' : 'Unexpected state',
        title: statusCode === 404 ? 'This page does not exist, or it has moved.' : 'This page is temporarily unavailable.',
        body:
          statusCode === 404
            ? 'The address you opened has no matching content. You can jump back home, reopen the docs library, or return to the previous page.'
            : 'The current page failed to load, but the rest of the app is still available. Head back to a stable entry point first.',
        pathLabel: 'Requested path',
        goHome: 'Back home',
        goDocs: 'Open docs',
        goBack: 'Go back',
      };

  return (
    <div className="vx-public vx-public--error">
      <header className="vx-public-nav">
        <div className="vx-public-nav__brand">
          <span className="vx-public-nav__brand-mark">vx<span>UI</span></span>
        </div>
        <div className="vx-public-nav__links">
          <LanguageSwitcher variant="inline" />
          <button type="button" className="vx-cmd-trigger" onClick={onDocs}>
            <Search size={14} />
            {t.publicPages.navDocs}
          </button>
        </div>
      </header>

      <main className="vx-error-shell">
        <Card className="vx-error-card">
          <CardContent>
            <div className="vx-error-card__icon">
              <AlertTriangle size={24} />
            </div>
            <Badge variant="warning">{copy.badge}</Badge>
            <div className="vx-error-card__code">{statusCode}</div>
            <h1 className="vx-error-card__title">{copy.title}</h1>
            <p className="vx-error-card__copy">{copy.body}</p>
            {requestedPath ? (
              <div className="vx-error-card__path">
                <span>{copy.pathLabel}</span>
                <strong>{requestedPath}</strong>
              </div>
            ) : null}
            <div className="vx-error-card__actions">
              <Button size="lg" onClick={onHome}>
                <House size={16} />
                {copy.goHome}
              </Button>
              <Button size="lg" variant="secondary" onClick={onDocs}>
                <Search size={16} />
                {copy.goDocs}
              </Button>
              <Button size="lg" variant="ghost" onClick={onBack}>
                <ArrowLeft size={16} />
                {copy.goBack}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}