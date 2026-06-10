/**
 * sharedDocPreviews — 桌面端和移动端共享的文档预览渲染逻辑
 * 统一了 DesktopApp.tsx 和 MobileApp.tsx 的预览内容
 */
import { useState, type ReactNode } from 'react';
import type { PageKey } from '../routes';
import { CodeBlock } from '../../components/CodeBlock';
import { Button } from '../../components/Button';
import { ArrowRight, Zap, AlertTriangle, House, Monitor, Moon, Sun, Search, Bell, User, Palette } from 'lucide-react';
import { pageIcons } from '../nav-config';
import type { PageDefinition } from '../routes';
import { QUICK_START_PREVIEW_SNIPPETS } from '../doc-snippets';

// ── 子组件：代码块渲染器 ──
interface CodeBlockProps {
  code: string;
  language?: 'tsx' | 'bash';
  copyLabel?: string;
  copiedLabel?: string;
  onCopy?: (code: string) => boolean | Promise<boolean>;
}

export function SharedCodeBlock({ code, language = 'tsx', copyLabel = 'Copy code', copiedLabel = 'Copied', onCopy }: CodeBlockProps) {
  return (
    <CodeBlock
      code={code}
      language={language}
      copyLabel={copyLabel}
      copiedLabel={copiedLabel}
      onCopy={onCopy ?? ((_code: string) => true)}
    />
  );
}

// ── 子组件：模板启动器 ──
interface TemplateLauncherProps {
  pageKey: Extract<PageKey, 'home-page' | 'login-page' | 'register-page' | 'error-page' | 'privacy-policy' | 'terms-of-service'>;
  pageTitle: string;
  pageDescription: string;
  onNavigate: (route: any) => void;
  openPageLabel: string;
}

export function TemplateLauncher({ pageKey, pageTitle, pageDescription, onNavigate, openPageLabel }: TemplateLauncherProps) {
  const actionMap: Record<typeof pageKey, () => void> = {
    'home-page': () => onNavigate({ view: 'home' }),
    'login-page': () => onNavigate({ view: 'login' }),
    'register-page': () => onNavigate({ view: 'register' }),
    'error-page': () => onNavigate({ view: 'error' }),
    'privacy-policy': () => onNavigate({ view: 'privacy-policy' }),
    'terms-of-service': () => onNavigate({ view: 'terms-of-service' }),
  };

  return (
    <div className="vx-template-launch">
      <div className="vx-template-launch__head">
        <span className="vx-template-launch__icon">{pageIcons[pageKey]}</span>
        <div>
          <strong>{pageTitle}</strong>
          <p>{pageDescription}</p>
        </div>
      </div>
      <Button variant="secondary" onClick={actionMap[pageKey]}>
        <ArrowRight size={16} /> {openPageLabel}
      </Button>
    </div>
  );
}

// ── 共享预览渲染器接口 ──
export interface SharedPreviewOptions {
  isZh: boolean;
  pages: Record<string, PageDefinition>;
  onNavigate?: (route: any) => void;
  push?: (toast: any) => void;
  onChange?: (pageKey: PageKey, value: any) => void;
}

// ── 内部辅助：带状态的分页组件（移动端与桌面端共享，使点击可响应） ──
function StatefulPagination({ initialPage = 1, total, pageSize }: { initialPage?: number; total: number; pageSize: number }) {
  const [page, setPage] = useState(initialPage);
  return <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />;
}

// ── 共享预览渲染函数 ──
export function renderSharedPreview(pageKey: PageKey, options: SharedPreviewOptions): ReactNode {
  const { isZh, pages, onNavigate, push } = options;
  const noNavigate = onNavigate ?? ((_route: any) => {});

  switch (pageKey) {
    // ═══════════════════════════════════════════════════════════
    // Getting Started
    // ═══════════════════════════════════════════════════════════
    case 'quick-start': {
      const tabs = [
        { value: 'install', label: isZh ? '安装' : 'Install', code: QUICK_START_PREVIEW_SNIPPETS.install },
        { value: 'providers', label: isZh ? 'Providers' : 'Providers', code: QUICK_START_PREVIEW_SNIPPETS.providers },
        { value: 'layout', label: isZh ? '页面壳层' : 'Layout', code: QUICK_START_PREVIEW_SNIPPETS.layout },
        { value: 'feedback', label: isZh ? '反馈' : 'Feedback', code: QUICK_START_PREVIEW_SNIPPETS.feedback },
      ] as const;
      return (
        <Tabs defaultValue="install">
          <TabsList>{tabs.map((tab) => (<TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>))}</TabsList>
          {tabs.map((tab) => (<TabsContent key={tab.value} value={tab.value}><SharedCodeBlock code={tab.code} language={tab.value === 'install' ? 'bash' : 'tsx'} /></TabsContent>))}
        </Tabs>
      );
    }

    case 'vxui-provider':
      return (
        <div className="vx-preview-stack">
          <Alert variant="info" title={isZh ? '组合 Provider' : 'Combined Provider'}>
            {isZh ? 'VXUIProvider 将 ThemeProvider、ViewportProvider 和 ToastProvider 合并为单一根组件。' : 'VXUIProvider merges ThemeProvider, ViewportProvider, and ToastProvider into one root component.'}
          </Alert>
          <SharedCodeBlock code={isZh
            ? `import { VXUIProvider, themePresets } from 'vxui-react';\n\nexport function App() {\n  return (\n    <VXUIProvider themes={themePresets} defaultTheme="light">\n      <Shell>\n        <ShellMain>\n          <p>应用内容</p>\n        </ShellMain>\n      </Shell>\n    </VXUIProvider>\n  );\n}`
            : `import { VXUIProvider, themePresets } from 'vxui-react';\n\nexport function App() {\n  return (\n    <VXUIProvider themes={themePresets} defaultTheme="light">\n      <Shell>\n        <ShellMain>\n          <p>App content</p>\n        </ShellMain>\n      </Shell>\n    </VXUIProvider>\n  );\n}`} />
        </div>
      );

    case 'viewport':
      return (
        <div className="vx-preview-stack">
          <Alert variant="info" title={isZh ? '响应式设备检测' : 'Responsive Device Detection'}>
            {isZh ? 'ViewportProvider 根据物理屏幕宽度自动检测设备类型。' : 'ViewportProvider automatically detects device type based on physical screen width.'}
          </Alert>
          <SharedCodeBlock code={isZh
            ? `import { ViewportProvider, useViewport } from 'vxui-react';\n\nfunction DeviceInfo() {\n  const { viewport, isPhone, isTablet, isDesktop } = useViewport();\n  return <p>���备类型：{viewport}</p>;\n}`
            : `import { ViewportProvider, useViewport } from 'vxui-react';\n\nfunction DeviceInfo() {\n  const { viewport, isPhone, isTablet, isDesktop } = useViewport();\n  return <p>Device: {viewport}</p>;\n}`} />
        </div>
      );

    case 'constants':
      return (
        <div className="vx-preview-stack">
          <div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
            {[
              { label: 'BREAKPOINTS.sm', value: 480 },
              { label: 'BREAKPOINTS.md', value: 768 },
              { label: 'BREAKPOINTS.lg', value: 1000 },
              { label: 'PHONE_MAX_WIDTH', value: 1000 },
            ].map((c) => (
              <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--vx-surface-elevated)', borderRadius: 'var(--vx-radius-sm)' }}>
                <code style={{ fontSize: 13 }}>{c.label}</code>
                <strong>{c.value}</strong>
              </div>
            ))}
          </div>
          <SharedCodeBlock code={`import { BREAKPOINTS, PHONE_MAX_WIDTH } from 'vxui-react';\n\nconsole.log(BREAKPOINTS.lg); // 1000`} />
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 基础元素
    // ═══════════════════════════════════════════════════════════
    case 'button':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Button>{isZh ? '主要按钮' : 'Primary'}</Button>
            <Button variant="secondary">{isZh ? '次级按钮' : 'Secondary'}</Button>
            <Button variant="ghost">{isZh ? '幽灵按钮' : 'Ghost'}</Button>
            <Button variant="danger">{isZh ? '危险按钮' : 'Danger'}</Button>
          </div>
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Button size="sm">{isZh ? '小' : 'Small'}</Button>
            <Button size="md">{isZh ? '中' : 'Medium'}</Button>
            <Button size="lg">{isZh ? '大' : 'Large'}</Button>
          </div>
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Button shape="square">{isZh ? '直角' : 'Square'}</Button>
            <Button shape="rect">{isZh ? '圆角' : 'Rounded'}</Button>
            <Button shape="pill">{isZh ? '胶囊' : 'Pill'}</Button>
            <Button variant="secondary" shape="pill">{isZh ? '次级胶囊' : 'Secondary pill'}</Button>
          </div>
          <Button fullWidth>{isZh ? '整行操作' : 'Full width action'}</Button>
        </div>
      );

    case 'elements':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Button><Zap size={16} />{isZh ? '主要操作' : 'Primary action'}</Button>
            <Button variant="secondary">{isZh ? '次级操作' : 'Secondary'}</Button>
            <Button variant="ghost">{isZh ? '幽灵按钮' : 'Ghost'}</Button>
          </div>
          <div className="vx-preview-inline">
            <Badge variant="accent">Brand</Badge><Badge variant="success">Live</Badge><Badge variant="warning">Beta</Badge>
          </div>
          <Alert title={isZh ? '统一风格' : 'Unified styling'} variant="info">
            {isZh ? '基础元素在所有页面共享同一套颜色、圆角和交互节奏。' : 'Core elements share the same color, radius, and interaction rhythm.'}
          </Alert>
          <div className="vx-preview-stack__group">
            <Heading level={1}>{isZh ? 'H1 标题' : 'Heading 1'}</Heading>
            <Heading level={2}>{isZh ? 'H2 标题' : 'Heading 2'}</Heading>
            <Heading level={3}>{isZh ? 'H3 标题' : 'Heading 3'}</Heading>
            <Text variant="secondary">{isZh ? '大段文本' : 'Lead text'}</Text>
            <Text variant="muted">{isZh ? '次要文本' : 'Muted text'}</Text>
          </div>
        </div>
      );

    case 'typography':
      return (
        <div className="vx-preview-stack" style={{ display: 'grid', gap: 8 }}>
          <Heading level={1}>{isZh ? '标题 1' : 'Heading 1'}</Heading>
          <Heading level={2}>{isZh ? '标题 2' : 'Heading 2'}</Heading>
          <Heading level={3}>{isZh ? '标题 3' : 'Heading 3'}</Heading>
          <Text>{isZh ? '默认正文文本。' : 'Default body text.'}</Text>
          <Text variant="secondary">{isZh ? '次级强调文本。' : 'Secondary emphasis text.'}</Text>
          <Text variant="muted">{isZh ? '弱化辅助文本。' : 'Muted helper text.'}</Text>
          <Text weight="bold">{isZh ? '加粗正文。' : 'Bold body text.'}</Text>
        </div>
      );

    case 'typography-base':
      return (
        <div className="vx-preview-stack">
          <div className="vx-article">
            <header className="vx-article__header">
              <span className="vx-kicker">{isZh ? 'CSS 类名' : 'CSS Classes'}</span>
              <h1 className="vx-article__title">{isZh ? '使用 CSS 类名' : 'Using CSS Classes'}</h1>
              <p className="vx-article__description">
                {isZh ? '直接使用 className 即可应用排版样式。' : 'Apply typography styles directly via className.'}
              </p>
            </header>
            <div className="vx-article__body">
              <section className="vx-section">
                <h2 className="vx-section__heading">
                  {isZh ? '章节标题' : 'Section Heading'}
                  <a href="#section" className="vx-section__anchor">#</a>
                </h2>
                <p className="vx-lead">{isZh ? '这是导语文本（vx-lead）。' : 'This is lead text (vx-lead).'}</p>
                <ul className="vx-list">
                  <li>{isZh ? '使用 vx-article 作为文章容器' : 'Use vx-article as the article container'}</li>
                  <li>{isZh ? '使用 vx-section 划分章节' : 'Use vx-section to divide chapters'}</li>
                </ul>
              </section>
            </div>
          </div>
          <div className="vx-example">
            <div className="vx-stats" style={{ marginBottom: 16 }}>
              <div className="vx-stat">
                <div className="vx-stat__copy">
                  <span className="vx-stat__label">{isZh ? '组件' : 'Components'}</span>
                  <strong className="vx-stat__value">10</strong>
                  <small className="vx-stat__hint">{isZh ? '可直接导入使用' : 'Ready to import'}</small>
                </div>
                <div className="vx-stat__icon"><Zap size={20} /></div>
              </div>
              <div className="vx-stat">
                <div className="vx-stat__copy">
                  <span className="vx-stat__label">{isZh ? 'CSS 类' : 'CSS Classes'}</span>
                  <strong className="vx-stat__value">30+</strong>
                  <small className="vx-stat__hint">{isZh ? '开箱即用' : 'Out of the box'}</small>
                </div>
                <div className="vx-stat__icon"><Palette size={20} /></div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'badge':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline">
            <Badge variant="accent">{isZh ? '新品' : 'New'}</Badge>
            <Badge variant="success">{isZh ? '在线' : 'Live'}</Badge>
            <Badge variant="warning">{isZh ? '测试版' : 'Beta'}</Badge>
            <Badge variant="neutral">{isZh ? '草稿' : 'Draft'}</Badge>
          </div>
        </div>
      );

    case 'avatar':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline" style={{ gap: 16, alignItems: 'center' }}>
            <Avatar src="https://i.pravatar.cc/80?u=1" name="Alex Morgan" size="xs" />
            <Avatar src="https://i.pravatar.cc/80?u=2" name="Jamie Chen" size="sm" />
            <Avatar src="https://i.pravatar.cc/80?u=3" name="Taylor Kim" size="md" />
            <Avatar name="Sam Wilson" size="lg" />
            <Avatar size="xl" />
          </div>
        </div>
      );

    case 'skeleton':
      return (
        <div className="vx-preview-stack">
          <div style={{ display: 'grid', gap: 8, width: 240 }}>
            <Skeleton variant="rect" width="100%" height={100} />
            <Skeleton variant="text" width="65%" />
            <Skeleton variant="text" lines={2} />
          </div>
        </div>
      );

    case 'code-block':
      return (
        <div className="vx-preview-stack">
          <SharedCodeBlock code={isZh
            ? `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>点击我</Button>;\n}`
            : `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>Click me</Button>;\n}`}
            language="tsx" />
        </div>
      );

    case 'language-switcher':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline"><LanguageSwitcher variant="inline" /></div>
          <Alert variant="info" title={isZh ? '全局语言切换' : 'Global language switch'}>
            {isZh ? '切换语言后，文档内所有 UI 文案同步更新。' : 'Switching locale updates all UI copy across the entire docs surface.'}
          </Alert>
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 表单控件
    // ═══════════════════════════════════════════════════════════
    case 'form-controls':
      return (
        <div className="vx-preview-stack">
          <Input label={isZh ? '项目名称' : 'Project name'} value="VXUI Workspace" readOnly />
          <Select label={isZh ? '发布通道' : 'Release track'} value="stable"
            onChange={() => {}} placeholder={isZh ? '选择通道…' : 'Select track…'}
            options={[{ value: 'stable', label: 'Stable' }, { value: 'preview', label: 'Preview' }, { value: 'internal', label: 'Internal' }]} />
          <Select label={isZh ? '部署环境' : 'Environment'} value={undefined} onChange={() => {}}
            clearable searchable={4} placeholder={isZh ? '选择环境…' : 'Select environment…'}
            options={[{ value: 'prod', label: isZh ? '生产' : 'Production' }, { value: 'staging', label: isZh ? '预发布' : 'Staging' }, { value: 'preview', label: isZh ? '预览' : 'Preview' }, { value: 'dev', label: isZh ? '开发' : 'Development' }]} />
          <MultiSelect label={isZh ? '技术栈' : 'Tech stack'} value={['react', 'typescript']} onChange={() => {}} clearable
            options={[{ value: 'react', label: 'React' }, { value: 'typescript', label: 'TypeScript' }, { value: 'vite', label: 'Vite' }, { value: 'css', label: 'CSS' }]} />
          <TimePicker label={isZh ? '部署时间' : 'Deploy time'} value={undefined} onChange={() => {}} placeholder={isZh ? '选择时间' : 'Select time'} />
          <Textarea label={isZh ? '变更摘要' : 'Change summary'} value={isZh ? '整合移动端与桌面端资源。' : 'Consolidate mobile and desktop resources.'} readOnly resize="none" />
          <div style={{ borderTop: '1px solid var(--vx-border)', paddingTop: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--vx-text-muted)', margin: '0 0 12px' }}>
              {isZh ? '堆叠验证' : 'Stacking verification'}
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              <Select label={isZh ? '来源区域' : 'Source region'} value={undefined} onChange={() => {}}
                placeholder={isZh ? '选择区域…' : 'Select region…'}
                options={[{ value: 'us-east-1', label: 'US East' }, { value: 'us-west-2', label: 'US West' }, { value: 'eu-west-1', label: 'EU West' }]} />
              <Select label={isZh ? '目标区域' : 'Target region'} value={undefined} onChange={() => {}}
                placeholder={isZh ? '选择区域…' : 'Select region…'}
                options={[{ value: 'us-east-1', label: 'US East' }, { value: 'us-west-2', label: 'US West' }, { value: 'eu-west-1', label: 'EU West' }]} />
            </div>
          </div>
        </div>
      );

    case 'form-inputs':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-stack__group">
            <Checkbox checked={true} label={isZh ? '默认启用响应式抽屉' : 'Enable responsive drawer'} onChange={() => {}} />
            <Checkbox checked={false} label={isZh ? '显示调试边界' : 'Show debug boundaries'} onChange={() => {}} />
          </div>
          <RadioGroup label={isZh ? '密度策略' : 'Density strategy'}>
            <Radio checked={true} label={isZh ? '跟随系统' : 'Follow system'} name="density" onChange={() => {}} />
            <Radio checked={false} label={isZh ? '舒适' : 'Comfortable'} name="density" onChange={() => {}} />
            <Radio checked={false} label={isZh ? '紧凑' : 'Compact'} name="density" onChange={() => {}} />
          </RadioGroup>
          <SegmentedControl value="system" onChange={() => {}} fullWidth
            options={[{ label: <><Monitor size={16} />{isZh ? '跟随系统' : 'System'}</>, value: 'system' }, { label: <><Sun size={16} />{isZh ? '浅色' : 'Light'}</>, value: 'light' }, { label: <><Moon size={16} />{isZh ? '深色' : 'Dark'}</>, value: 'dark' }]} />
          <Slider label={isZh ? '文档完成度' : 'Coverage'} max={100} min={0} onChange={() => {}} showValue value={68} />
          <div className="vx-preview-stack__group" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Toggle data-state="on">{isZh ? '自动保存' : 'Auto-save'}</Toggle>
              <Toggle>{isZh ? '多标签模式' : 'Multiple tabs'}</Toggle>
            </div>
            <ToggleGroup type="single" defaultValue="grid" items={[{ value: 'grid', label: isZh ? '网格' : 'Grid' }, { value: 'list', label: isZh ? '列表' : 'List' }, { value: 'table', label: isZh ? '表格' : 'Table' }]} />
            <Switch defaultChecked label={isZh ? '开启实验性功能' : 'Enable experimental features'} />
            <NumberInput min={0} max={100} defaultValue={10} label={isZh ? '阈值' : 'Threshold'} />
            <TagInput placeholder={isZh ? '添加标签...' : 'Add tag...'} defaultValue={['React', 'Vite']} />
            <FileUpload multiple label={isZh ? '上传附件' : 'Upload attachments'} />
            <div style={{ marginTop: 8 }}><Calendar /></div>
          </div>
        </div>
      );

    case 'toggle':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline" style={{ marginBottom: 12 }}>
            <Toggle defaultPressed={false}><Text size="sm">{isZh ? '加粗' : 'Bold'}</Text></Toggle>
            <Toggle><Text size="sm">{isZh ? '斜体' : 'Italic'}</Text></Toggle>
            <Toggle><Text size="sm">{isZh ? '下划线' : 'Underline'}</Text></Toggle>
          </div>
          <ToggleGroup type="single" defaultValue="grid" items={[{ value: 'grid', label: isZh ? '网格' : 'Grid' }, { value: 'list', label: isZh ? '列表' : 'List' }, { value: 'table', label: isZh ? '表格' : 'Table' }]} />
        </div>
      );

    case 'rating':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline" style={{ flexDirection: 'column', gap: 16 }}>
            <Rating defaultValue={3.5} allowHalf />
            <Rating defaultValue={4} size="sm" />
            <Rating defaultValue={5} size="lg" readOnly />
          </div>
        </div>
      );

    case 'label':
      return (
        <div className="vx-preview-stack" style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
          <div style={{ display: 'grid', gap: 4 }}>
            <Label required>{isZh ? '电子邮箱' : 'Email'}</Label>
            <Input placeholder="name@example.com" />
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            <Label>{isZh ? '备注（选填）' : 'Notes (optional)'}</Label>
            <Input placeholder={isZh ? '添加备注...' : 'Add notes...'} />
          </div>
        </div>
      );

    case 'date-pickers':
      return (
        <div className="vx-preview-stack" style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
          <DatePicker label={isZh ? '开始日期' : 'Start date'} />
          <DatePicker label={isZh ? '结束日期' : 'End date'} weekStartsOnMonday />
        </div>
      );

    case 'file-upload':
      return (
        <div className="vx-preview-stack" style={{ maxWidth: 480 }}>
          <FileUpload multiple label={isZh ? '上传附件' : 'Upload attachments'} hint={isZh ? '支持多文件上传，单文件最大 10MB' : 'Multiple files allowed, up to 10MB each'} accept="image/*,.pdf" />
        </div>
      );

    case 'color-picker':
      return (
        <div className="vx-preview-stack" style={{ maxWidth: 480 }}>
          <ColorPicker label={isZh ? '主题色' : 'Theme color'} />
        </div>
      );

    case 'form':
      return (
        <div className="vx-preview-stack">
          <Form style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
            <FormField>
              <FormLabel required>{isZh ? '邮箱' : 'Email'}</FormLabel>
              <FormDescription>{isZh ? '我们不会分享你的邮箱。' : 'We will never share your email.'}</FormDescription>
              <Input type="email" placeholder="name@example.com" />
              <FormMessage />
            </FormField>
            <FormField>
              <FormLabel required>{isZh ? '密码' : 'Password'}</FormLabel>
              <Input type="password" placeholder="••••••••" />
              <FormMessage />
            </FormField>
            <Button type="submit">{isZh ? '提交' : 'Submit'}</Button>
          </Form>
        </div>
      );

    case 'calendar':
      return (
        <div className="vx-preview-stack" style={{ display: 'grid', gap: 16 }}>
          <Calendar />
          <Calendar weekStartsOnMonday />
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 布局与导航
    // ═══════════════════════════════════════════════════════════
    case 'shell-sidebar':
      return (
        <div className="vx-preview-stack">
          <div style={{ background: 'var(--vx-surface)', border: '1px solid var(--vx-border)', borderRadius: 'var(--vx-radius-lg)', overflow: 'hidden' }}>
            <ShellNav label={isZh ? '导航示例' : 'Navigation demo'}>
              <ShellNavSection title={isZh ? '快速开始' : 'Getting started'}>
                <ShellNavItem label={isZh ? '介绍' : 'Introduction'} active onSelect={() => {}} />
              </ShellNavSection>
              <ShellNavSection title={isZh ? '组件' : 'Components'}>
                <ShellNavItem label={isZh ? '表单控件' : 'Form controls'} defaultOpen onSelect={() => {}}>
                  <ShellNavItem label={isZh ? '输入框' : 'Input'} onSelect={() => {}} />
                  <ShellNavItem label={isZh ? '多选框' : 'MultiSelect'} onSelect={() => {}} />
                  <ShellNavItem label={isZh ? '时间选择器' : 'TimePicker'} onSelect={() => {}} />
                </ShellNavItem>
                <ShellNavItem label={isZh ? '叠层浮层' : 'Overlays'} onSelect={() => {}}>
                  <ShellNavItem label={isZh ? '对话框' : 'Dialog'} onSelect={() => {}} />
                  <ShellNavItem label={isZh ? '抽屉' : 'Sheet'} onSelect={() => {}} />
                </ShellNavItem>
                <ShellNavItem label={isZh ? '导航' : 'Navigation'} onSelect={() => {}} />
              </ShellNavSection>
            </ShellNav>
          </div>
        </div>
      );

    case 'grid-page':
      return (
        <div className="vx-stats-grid">
          {[
            { label: isZh ? '模板数' : 'Templates', value: '6', hint: isZh ? '完整页面示例' : 'Full-page examples' },
            { label: isZh ? '文档数' : 'Docs', value: '70+', hint: isZh ? '交互式文档页' : 'Interactive doc pages' },
            { label: isZh ? '断点数' : 'Breakpoints', value: '3', hint: isZh ? '响应式适配' : 'Responsive adaptation' },
            { label: isZh ? '主题数' : 'Themes', value: '6', hint: isZh ? '开箱即用' : 'Out of the box' },
          ].map((m) => (
            <div key={m.label} className="vx-stats-grid__item">
              <span>{m.label}</span><strong>{m.value}</strong><small>{m.hint}</small>
            </div>
          ))}
        </div>
      );

    case 'nav-layout':
      return (
        <div className="vx-preview-stack">
          <Breadcrumb items={[{ label: 'Home' }, { label: 'Components' }, { label: 'Navigation' }]} />
          <Menubar menus={[{ label: 'File', items: [{ label: 'New', shortcut: '⌘N' }, { label: 'Open...', shortcut: '⌘O' }, { label: 'Exit', danger: true }] }, { label: 'Edit', items: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⇧⌘Z' }] }]} />
          <Separator />
          <ScrollArea maxHeight={100} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 'var(--vx-radius-md)', padding: 16 }}>
            {(isZh ? '此区域展示了 ScrollArea 组件的用法。' : 'This area demonstrates the ScrollArea component. ').repeat(20)}
          </ScrollArea>
          <Accordion defaultOpen={['hierarchy']} items={[
            { key: 'hierarchy', title: isZh ? '层级保持一致' : 'Hierarchy stays consistent', content: isZh ? '所有断点共享同一路由。' : 'Every breakpoint shares the same route tree.' },
            { key: 'density', title: isZh ? '壳层只调密度' : 'Shell adjusts density', content: isZh ? '导航抽屉、顶部工具区和内容栅格按宽度变化。' : 'The drawer, header tools, and content grids adapt by width.' },
          ]} />
        </div>
      );

    case 'scroll-area':
      return (
        <div className="vx-preview-stack">
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--vx-text-secondary)', margin: 0 }}>{isZh ? '场景一：Overlay 模式（默认）' : 'Scene 1: Overlay mode (default)'}</p>
          <ScrollArea maxHeight={160} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--vx-color-border)' }}>
                {isZh ? `日志行 ${i + 1}` : `Log line ${i + 1}`}
              </div>
            ))}
          </ScrollArea>
          <SharedCodeBlock code={isZh
            ? `<ScrollArea maxHeight={160}>\n  {/* 默认 variant="overlay" */}\n  {...children}\n</ScrollArea>`
            : `<ScrollArea maxHeight={160}>\n  {/* Default variant="overlay" */}\n  {...children}\n</ScrollArea>`} />

          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--vx-text-secondary)', margin: 0 }}>{isZh ? '场景二：Native 模式' : 'Scene 2: Native mode'}</p>
          <ScrollArea variant="native" maxHeight={160} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--vx-color-border)' }}>
                {isZh ? `日志行 ${i + 1}` : `Log line ${i + 1}`}
              </div>
            ))}
          </ScrollArea>
          <SharedCodeBlock code={isZh
            ? `<ScrollArea variant="native" maxHeight={160}>\n  {/* 浏览器原生滚动条 */}\n  {...children}\n</ScrollArea>`
            : `<ScrollArea variant="native" maxHeight={160}>\n  {/* Native browser scrollbar */}\n  {...children}\n</ScrollArea>`} />

          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--vx-text-secondary)', margin: 0 }}>{isZh ? '场景三：水平 + 垂直滚动' : 'Scene 3: Horizontal + vertical scroll'}</p>
          <ScrollArea maxHeight={120} maxWidth={300} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8, padding: '8px 0' }}>
            <div style={{ width: 500, padding: '0 12px' }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--vx-color-border)', whiteSpace: 'nowrap' }}>
                  {isZh ? `宽内容行 ${i + 1} — 这行文字超出容器宽度因此会触发水平滚动` : `Wide content row ${i + 1} — this text exceeds container width so horizontal scroll is triggered`}
                </div>
              ))}
            </div>
          </ScrollArea>
          <SharedCodeBlock code={`<ScrollArea maxHeight={120} maxWidth={300}>\n  <div style={{ width: 500 }}>\n    {/* 宽内容触发水平滚动 */}\n  </div>\n</ScrollArea>`} />
        </div>
      );

    case 'separator':
      return (
        <div className="vx-preview-stack">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>{isZh ? '左' : 'Left'}</span>
            <Separator orientation="vertical" style={{ height: 24 }} />
            <span>{isZh ? '中' : 'Center'}</span>
            <Separator orientation="vertical" style={{ height: 24 }} />
            <span>{isZh ? '右' : 'Right'}</span>
          </div>
          <Separator />
          <p>{isZh ? '水平分隔线上方内容' : 'Content above the horizontal separator.'}</p>
        </div>
      );

    case 'resizable':
      return (
        <div className="vx-preview-stack">
          <div style={{ height: 200, border: '1px solid var(--vx-border)', borderRadius: 'var(--vx-radius-lg)', overflow: 'hidden' }}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isZh ? '左侧面板' : 'Left panel'}
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isZh ? '右侧面板' : 'Right panel'}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      );

    case 'breadcrumb':
      return (
        <div className="vx-preview-stack">
          <Breadcrumb items={[{ label: isZh ? '首页' : 'Home', href: '#' }, { label: isZh ? '组件' : 'Components', href: '#' }, { label: isZh ? '导航' : 'Navigation' }]} />
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 数据展示
    // ═══════════════════════════════════════════════════════════
    case 'data-display':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline">
            <Avatar name="Alice Chen" size="sm" />
            <Avatar name="Bo Wang" size="md" />
            <Avatar name="Cora Lin" size="lg" />
          </div>
          <Table columns={[{ key: 'name', header: isZh ? '角色' : 'Role', accessor: (r: any) => r.name }, { key: 'scope', header: 'Scope', accessor: (r: any) => r.scope }]}
            data={[{ name: isZh ? '设计系统' : 'Design system', scope: isZh ? '公共组件' : 'Shared primitives' }, { name: isZh ? '文档库' : 'Documentation', scope: isZh ? '内容导航' : 'Content navigation' }]} />
          <Timeline items={[{ title: isZh ? '已创建' : 'Created', time: '10:00 AM' }, { title: isZh ? '处理中' : 'Processing', time: '10:05 AM' }, { title: isZh ? '已完成' : 'Completed', time: '10:15 AM' }]} />
          <Carousel items={[
            <div key="1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, background: 'var(--vx-surface-elevated)', borderRadius: 'var(--vx-radius-md)' }}>Slide 1</div>,
            <div key="2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, background: 'var(--vx-surface-elevated)', borderRadius: 'var(--vx-radius-md)' }}>Slide 2</div>,
          ]} />
        </div>
      );

    case 'data-list':
      return (
        <Table columns={[
          { key: 'name', header: isZh ? '页面' : 'Screen', accessor: (r: any) => r.name },
          { key: 'status', header: isZh ? '状态' : 'Status', accessor: (r: any) => <Badge variant={r.v}>{r.status}</Badge> },
          { key: 'updated', header: isZh ? '更新时间' : 'Updated', accessor: (r: any) => r.updated },
        ]} data={[
          { name: pages['home-page']?.title ?? 'Home', status: isZh ? '已整合' : 'Unified', updated: '2026-05-08', v: 'success' as const },
          { name: pages['error-page']?.title ?? 'Error', status: isZh ? '新增' : 'New', updated: '2026-05-08', v: 'accent' as const },
          { name: pages.mobile?.title ?? 'Mobile', status: isZh ? '已重写' : 'Reframed', updated: '2026-05-08', v: 'warning' as const },
        ]} />
      );

    case 'table': {
      // Large dataset for the scroll / sticky-header stress-test demo
      const largeRoles = isZh ? ['设计师', '工程师', '产品经理', '测试'] : ['Designer', 'Engineer', 'Product manager', 'QA'];
      const largeTeams = isZh ? ['设计系统', '平台', '增长', '基础架构'] : ['Design system', 'Platform', 'Growth', 'Infrastructure'];
      const largeStatuses = isZh ? ['在岗', '休假', '出差'] : ['Active', 'On leave', 'On site'];
      const largeData = Array.from({ length: 200 }, (_, i) => ({
        id: i + 1,
        name: `User-${String(i + 1).padStart(3, '0')}`,
        role: largeRoles[i % largeRoles.length],
        team: largeTeams[i % largeTeams.length],
        status: largeStatuses[i % largeStatuses.length],
        score: (i * 37) % 100,
      }));
      const largeColumns = [
        { key: 'id', header: isZh ? '编号' : 'ID', accessor: (r: { id: number }) => r.id, sortable: true, width: 80, align: 'right' as const },
        { key: 'name', header: isZh ? '姓名' : 'Name', accessor: (r: { name: string }) => r.name, sortable: true },
        { key: 'role', header: isZh ? '角色' : 'Role', accessor: (r: { role: string }) => r.role },
        { key: 'team', header: isZh ? '团队' : 'Team', accessor: (r: { team: string }) => r.team },
        { key: 'status', header: isZh ? '状态' : 'Status', accessor: (r: { status: string }) => <Badge variant={((r.status === 'Active' || r.status === '在岗') ? 'success' : 'warning') as 'success' | 'warning'}>{r.status}</Badge>, sortable: true },
        { key: 'score', header: isZh ? '得分' : 'Score', accessor: (r: { score: number }) => r.score, align: 'right' as const, sortable: true },
      ];
      return (
        <div className="vx-preview-stack">
          <Table columns={[
            { key: 'name', header: isZh ? '名称' : 'Name', accessor: (r: { name: string; role: string; status: string }) => r.name },
            { key: 'role', header: isZh ? '角色' : 'Role', accessor: (r: { name: string; role: string; status: string }) => r.role },
            { key: 'status', header: isZh ? '状态' : 'Status', accessor: (r: { name: string; role: string; status: string }) => <Badge variant={(r.status === 'Active' ? 'success' : 'warning') as 'success' | 'warning'}>{r.status}</Badge> },
          ]} data={[
            { name: 'Alice Chen', role: isZh ? '设计师' : 'Designer', status: 'Active' },
            { name: 'Bo Wang', role: isZh ? '工程师' : 'Engineer', status: 'Active' },
          ]} striped bordered />
          <p style={{ fontSize: 13, color: 'var(--vx-text-muted)', margin: '4px 0 0' }}>
            {isZh
              ? '大量数据 + 表头吸顶 + 容器滚动（共 200 行）。向下滚动以验证 stickyHeader 效果：'
              : 'Large dataset with sticky header and scrollable container (200 rows). Scroll down to verify stickyHeader:'}
          </p>
          <Table
            columns={largeColumns}
            data={largeData}
            stickyHeader
            striped
            hoverable
            style={{ maxHeight: 360, overflow: 'auto' }}
            caption={isZh ? `成员名单 · ${largeData.length} 人` : `Roster · ${largeData.length} members`}
          />
        </div>
      );
    }

    case 'timeline':
      return (
        <div className="vx-preview-stack">
          <Timeline items={[
            { title: isZh ? '订单已创建' : 'Order created', time: '09:42', status: 'success' as const },
            { title: isZh ? '支付成功' : 'Payment confirmed', time: '09:43', status: 'info' as const },
            { title: isZh ? '配送中' : 'Shipping', time: '10:15', status: 'warning' as const },
            { title: isZh ? '已签收' : 'Delivered', time: '14:30', status: 'default' as const },
          ]} />
        </div>
      );

    case 'tree-view':
      return (
        <div className="vx-preview-stack">
          <TreeView nodes={[
            { id: 'src', label: 'src', children: [
              { id: 'components', label: 'components', children: [
                { id: 'btn', label: 'Button.tsx' },
                { id: 'card', label: 'Card.tsx' },
              ]},
              { id: 'pages', label: 'pages', children: [
                { id: 'home', label: 'Home.tsx' },
                { id: 'about', label: 'About.tsx' },
              ]},
            ]},
            { id: 'public', label: 'public', children: [{ id: 'index', label: 'index.html' }] },
          ]} defaultExpanded={['src', 'components', 'pages']} />
        </div>
      );

    case 'carousel':
      return (
        <div className="vx-preview-stack">
          <div style={{ maxWidth: 400 }}>
            <Carousel items={[
              <div key="1" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-2)' }}>{isZh ? '第一张' : 'Slide 1'}</div>,
              <div key="2" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-3)' }}>{isZh ? '第二张' : 'Slide 2'}</div>,
              <div key="3" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-2)' }}>{isZh ? '第三张' : 'Slide 3'}</div>,
            ]} showDots showArrows />
          </div>
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 内容组件
    // ═══════════════════════════════════════════════════════════
    case 'card':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Card variant="default" padding="md"><CardHeader><CardTitle>Default</CardTitle><CardDescription>Standard card.</CardDescription></CardHeader><CardContent>Content.</CardContent></Card>
            <Card variant="elevated" padding="md" hoverable><CardHeader><CardTitle>Elevated</CardTitle><CardDescription>Interactive.</CardDescription></CardHeader><CardContent>Hover over this card.</CardContent></Card>
            <Card variant="outlined" padding="md"><CardHeader><CardTitle>Outlined</CardTitle><CardDescription>Bordered.</CardDescription></CardHeader><CardContent>Content.</CardContent></Card>
          </div>
        </div>
      );

    case 'accordion':
      return (
        <div className="vx-preview-stack">
          <Accordion defaultOpen={['getting-started']} items={[
            { key: 'getting-started', title: isZh ? '快速开始' : 'Getting Started', content: isZh ? '安装包并配置 Provider。' : 'Install the package and set up providers.' },
            { key: 'components', title: isZh ? '组件库' : 'Components', content: isZh ? '按分类浏览全部组件。' : 'Browse the full component library.' },
            { key: 'templates', title: isZh ? '页面模板' : 'Templates', content: isZh ? '可直接引入项目的预置页面布局。' : 'Pre-built page layouts.' },
          ]} />
        </div>
      );

    case 'tabs':
      return (
        <div className="vx-preview-stack">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">{isZh ? '预览' : 'Preview'}</TabsTrigger>
              <TabsTrigger value="code">{isZh ? '代码' : 'Code'}</TabsTrigger>
              <TabsTrigger value="props">{isZh ? '属性' : 'Props'}</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">{isZh ? '实时预览组件效果。' : 'Preview the component in real time.'}</TabsContent>
            <TabsContent value="code">{isZh ? '查看源代码并复制到项目中使用。' : 'View the source code.'}</TabsContent>
            <TabsContent value="props">{isZh ? '浏览完整的 API 参考。' : 'Browse the full API reference.'}</TabsContent>
          </Tabs>
        </div>
      );

    case 'pagination':
      return (
        <div className="vx-preview-stack">
          <StatefulPagination initialPage={1} total={48} pageSize={10} />
        </div>
      );

    case 'stepper':
      return (
        <div className="vx-preview-stack">
          <Stepper currentStep={1} steps={[
            { label: isZh ? '规划' : 'Plan', description: isZh ? '确定需求和目标' : 'Define requirements & goals' },
            { label: isZh ? '开发' : 'Build', description: isZh ? '编码与测试' : 'Code & test' },
            { label: isZh ? '发布' : 'Launch', description: isZh ? '部署上线' : 'Deploy to production' },
          ]} />
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 反馈组件
    // ═══════════════════════════════════════════════════════════
    case 'alert':
      return (
        <div className="vx-preview-stack">
          <Alert title={isZh ? '提示信息' : 'Information'} variant="info">{isZh ? '这是一条提示信息。' : 'This is an informational message.'}</Alert>
          <Alert title={isZh ? '操作成功' : 'Success'} variant="success">{isZh ? '操作已成功完成。' : 'Operation completed successfully.'}</Alert>
          <Alert title={isZh ? '错误' : 'Error'} variant="danger">{isZh ? '出错了，请重试。' : 'Something went wrong.'}</Alert>
        </div>
      );

    case 'progress':
      return (
        <div className="vx-preview-stack">
          <Progress label={isZh ? '默认' : 'Default'} showLabel value={68} />
          <Progress label={isZh ? '成功' : 'Success'} showLabel value={68} variant="success" />
          <Progress label={isZh ? '警告' : 'Warning'} showLabel value={68} variant="warning" />
          <Progress label={isZh ? '危险' : 'Danger'} showLabel value={68} variant="danger" />
        </div>
      );

    case 'spinner':
      return (
        <div className="vx-preview-inline vx-preview-inline--wrap">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      );

    case 'feedback':
      return (
        <div className="vx-preview-stack">
          <Alert title={isZh ? '迁��进度' : 'Migration progress'} variant="info">
            {isZh ? '响应式壳层、模板页面和文档内容库已经收敛到同一套运行时。' : 'The responsive shell, template pages, and docs library now share the same runtime.'}
          </Alert>
          <Progress label={isZh ? '默认' : 'Default'} showLabel value={68} />
          <Progress label={isZh ? '成功' : 'Success'} showLabel value={68} variant="success" />
          <Progress label={isZh ? '警告' : 'Warning'} showLabel value={68} variant="warning" />
          <Progress label={isZh ? '危险' : 'Danger'} showLabel value={68} variant="danger" />
          <Progress label={isZh ? '炫彩' : 'Rainbow'} showLabel value={68} variant="rainbow" size="lg" />
          <div className="vx-doc-skeleton-grid"><Skeleton lines={3} variant="text" /><Skeleton height={92} /></div>
          <div className="vx-preview-stack__group">
            <div className="vx-preview-inline"><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /></div>
            <Stepper currentStep={2} steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]} />
          </div>
        </div>
      );

    case 'toasts':
      return (
        <div className="vx-preview-inline vx-preview-inline--wrap">
          <Button onClick={() => push?.({ tone: 'info', title: isZh ? '文档树已同步' : 'Docs tree synced', description: isZh ? '所有页面已映射到统一壳层。' : 'Every page is mapped to the unified shell.' })}>
            {isZh ? '信息提示' : 'Info toast'}
          </Button>
          <Button variant="secondary" onClick={() => push?.({ tone: 'success', title: isZh ? '路由更新完成' : 'Route update complete', description: isZh ? '桌面端、平板和手机已共享同一套页面定义。' : 'Desktop, tablet, and phone now share one page definition set.' })}>
            {isZh ? '成功提示' : 'Success toast'}
          </Button>
        </div>
      );

    case 'empty-states':
      return (
        <div className="vx-empty">
          <div className="vx-empty__icon"><AlertTriangle size={20} /></div>
          <strong>{isZh ? '这里暂时没有内容' : 'Nothing lives here yet'}</strong>
          <p>{isZh ? '空状态与错误页共享同一套视觉策略。' : 'Empty states share the same visual language.'}</p>
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 叠层浮层
    // ═══════════════════════════════════════════════════════════
    case 'dialog': {
      const ConfirmDialogDemo = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <Button onClick={() => setOpen(true)}>{isZh ? '打开对话框' : 'Open dialog'}</Button>
            <Dialog title={isZh ? '确认操作' : 'Confirm action'} description={isZh ? '请确认此操作。' : 'Please confirm this operation.'} open={open} onOpenChange={setOpen}
              confirmLabel={isZh ? '确认' : 'Confirm'} cancelLabel={isZh ? '取消' : 'Cancel'}>
              {isZh ? '此操作将立即生效。' : 'This action will be applied immediately.'}
            </Dialog>
          </>
        );
      };
      const DialogFormDemo = () => {
        const [open, setOpen] = useState(false);
        const [role, setRole] = useState<string>();
        return (
          <>
            <Button onClick={() => setOpen(true)}>{isZh ? '创建用户' : 'Create User'}</Button>
            <Dialog title={isZh ? '新建用户' : 'New User'} open={open} onOpenChange={setOpen}
              onConfirm={() => { console.log({ role }); setOpen(false); }}
              onCancel={() => setOpen(false)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label={isZh ? '姓名' : 'Name'} placeholder={isZh ? '全名' : 'Full name'} />
                <Input label="Email" placeholder="user@example.com" />
                <Select
                  label={isZh ? '角色' : 'Role'}
                  placeholder={isZh ? '选择角色' : 'Choose a role'}
                  options={[
                    { value: 'admin', label: isZh ? '管理员' : 'Admin' },
                    { value: 'editor', label: isZh ? '编辑者' : 'Editor' },
                    { value: 'viewer', label: isZh ? '观察者' : 'Viewer' },
                  ]}
                  value={role}
                  onChange={setRole}
                />
              </div>
            </Dialog>
          </>
        );
      };
      const SidePanelDemo = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <Button onClick={() => setOpen(true)}>{isZh ? '侧边面板' : 'Side panel'}</Button>
            <Dialog placement="right" title={isZh ? '侧边面板' : 'Side panel'} open={open} onOpenChange={setOpen}>
              {isZh ? '固定在右侧边缘的对话框。' : 'A dialog anchored to the right edge.'}
            </Dialog>
          </>
        );
      };
      return (
        <div className="vx-preview-stack" style={{ gap: 12 }}>
          <div className="vx-preview-inline vx-preview-inline--wrap" style={{ gap: 8 }}>
            <ConfirmDialogDemo />
            <DialogFormDemo />
            <SidePanelDemo />
          </div>
        </div>
      );
    }

    case 'sheet':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline">
            <Sheet trigger={<Button>{isZh ? '打开面板' : 'Open panel'}</Button>}
              title={isZh ? '侧滑面板' : 'Sheet panel'} description={isZh ? '这是从右侧滑入的面板。' : 'This panel slides in from the right.'} side="right">
              <div style={{ padding: 16 }}>{isZh ? '面板内容' : 'Panel content'}</div>
            </Sheet>
          </div>
        </div>
      );

    case 'popover':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Popover content={<div style={{ padding: 8 }}>{isZh ? '弹出内容，提供额外信息。' : 'Popover content.'}</div>}>
              <Button variant="secondary">{isZh ? '点击打开' : 'Click me'}</Button>
            </Popover>
          </div>
        </div>
      );

    case 'tooltip':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Tooltip content={isZh ? '这是一个工具提示' : 'This is a tooltip'}><Button variant="secondary">{isZh ? '悬停查看' : 'Hover me'}</Button></Tooltip>
            <Tooltip content={isZh ? '顶部提示' : 'Top tooltip'} placement="top"><Button variant="ghost">{isZh ? '顶部' : 'Top'}</Button></Tooltip>
          </div>
        </div>
      );

    case 'hover-card':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <HoverCard content={<div style={{ padding: 12, maxWidth: 220 }}><strong>{isZh ? '用户资料' : 'User profile'}</strong><p style={{ margin: '4px 0 0', color: 'var(--vx-text-secondary)' }}>{isZh ? '无需导航即可预览更多上下文。' : 'Preview additional context.'}</p></div>}>
              <Button variant="secondary">{isZh ? '悬停查看' : 'Hover me'}</Button>
            </HoverCard>
          </div>
        </div>
      );

    case 'dropdown-menu':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <DropdownMenu trigger={<Button variant="secondary">{isZh ? '操作' : 'Actions'}</Button>}
              items={[{ label: isZh ? '复制' : 'Duplicate', onClick: () => {} }, { label: isZh ? '归档' : 'Archive', onClick: () => {} }, { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} }]} />
          </div>
        </div>
      );

    case 'context-menu':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline">
            <ContextMenu items={[{ label: isZh ? '复制' : 'Copy', onClick: () => {} }, { label: isZh ? '粘贴' : 'Paste', onClick: () => {} }, { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} }]}>
              <div style={{ padding: '2rem 3rem', border: '1px dashed var(--vx-color-border)', borderRadius: 'var(--vx-radius-md)', textAlign: 'center', color: 'var(--vx-text-secondary)' }}>
                {isZh ? '在此区域右键点击' : 'Right-click this area'}
              </div>
            </ContextMenu>
          </div>
        </div>
      );

    case 'overlays':
      return (
        <div className="vx-preview-inline vx-preview-inline--wrap">
          <Dialog trigger={<Button variant="secondary">{isZh ? '打开对话框' : 'Open dialog'}</Button>}
            title={isZh ? '删除项目' : 'Delete project'} description={isZh ? '此操作将移除所有成员的访问权限。' : 'This action removes access for the whole team.'}
            confirmLabel={isZh ? '删除' : 'Delete'} cancelLabel={isZh ? '取消' : 'Cancel'} confirmVariant="danger">
            <div style={{ padding: '4px 0', lineHeight: 1.5, color: 'var(--vx-text-secondary)' }}>{isZh ? '此项目将被永久删除且无法恢复。' : 'This project will be removed permanently and cannot be recovered.'}</div>
          </Dialog>
          <Popover content={<div>{isZh ? 'Popover 用于补充上下文。' : 'Popover adds context.'}</div>}>
            <Button variant="secondary">Popover</Button>
          </Popover>
          <DropdownMenu trigger={<Button variant="secondary">{isZh ? '更多操作' : 'More actions'}</Button>}
            items={[{ label: isZh ? '打开首页' : 'Open home', onClick: () => noNavigate({ view: 'home' }) }, { label: isZh ? '打开文档' : 'Open docs', onClick: () => noNavigate({ view: 'docs', page: 'introduction' }) }]} />
          <Sheet trigger={<Button variant="secondary" size="sm">{isZh ? '底部抽屉' : 'Bottom sheet'}</Button>} title={isZh ? '通知设置' : 'Notifications'} side="bottom">
            <div className="vx-stack"><Switch label={isZh ? '邮件通知' : 'Email notifications'} defaultChecked /><Switch label={isZh ? '推送通知' : 'Push notifications'} defaultChecked /></div>
          </Sheet>
          <Tooltip content={isZh ? '这是一个工具提示' : 'This is a tooltip'}><Button variant="ghost">{isZh ? '工具提示' : 'Tooltip'}</Button></Tooltip>
        </div>
      );

    case 'command-palette':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline">
            <Button onClick={() => {}}>
              {isZh ? '打开搜索' : 'Open search'}<kbd className="vx-search-kbd">⌘K</kbd>
            </Button>
          </div>
          <Alert variant="info" title={isZh ? '键盘优先' : 'Keyboard first'}>
            {isZh ? '按下 ⌘K 即可随时唤起命令面板。' : 'Press ⌘K to open the palette from anywhere.'}
          </Alert>
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 导航组件
    // ═══════════════════════════════════════════════════════════
    case 'navigation':
      return (
        <div className="vx-preview-stack">
          <Tabs defaultValue="library">
            <TabsList>
              <TabsTrigger value="library">{isZh ? '组件库' : 'Library'}</TabsTrigger>
              <TabsTrigger value="templates">{isZh ? '模板' : 'Templates'}</TabsTrigger>
              <TabsTrigger value="responsive">{isZh ? '响应式' : 'Responsive'}</TabsTrigger>
            </TabsList>
            <TabsContent value="library">A lightweight component library. Zero heavy dependencies, themeable, and dark-mode ready.</TabsContent>
            <TabsContent value="templates">{pages['home-page']?.description}</TabsContent>
            <TabsContent value="responsive">{pages.mobile?.description}</TabsContent>
          </Tabs>
          <StatefulPagination initialPage={4} total={96} pageSize={8} />
        </div>
      );

    case 'navigation-menu':
      return (
        <div className="vx-preview-stack">
          <NavigationMenu items={[
            { label: isZh ? '文档' : 'Docs', items: [{ label: isZh ? '介绍' : 'Introduction', description: isZh ? '开始使用 VXUI' : 'Get started', onClick: () => {} }, { label: isZh ? '快速开始' : 'Quick Start', description: isZh ? '安装和配置' : 'Install and configure', onClick: () => {} }] },
            { label: isZh ? '组件' : 'Components', items: [{ label: 'Button', description: isZh ? '主要操作元素' : 'Primary action', onClick: () => {} }, { label: 'Dialog', description: isZh ? '模态叠层' : 'Modal overlay', onClick: () => {} }] },
            { label: isZh ? '模板' : 'Templates', onClick: () => {} },
          ]} />
        </div>
      );

    case 'menubar':
      return (
        <div className="vx-preview-stack">
          <Menubar menus={[
            { label: 'File', items: [{ label: 'New', shortcut: '⌘N', onClick: () => {} }, { label: 'Open...', shortcut: '⌘O', onClick: () => {} }, { label: 'Save', shortcut: '⌘S', onClick: () => {} }, { label: 'Exit', danger: true, onClick: () => {} }] },
            { label: 'Edit', items: [{ label: 'Undo', shortcut: '⌘Z', onClick: () => {} }, { label: 'Redo', shortcut: '⇧⌘Z', onClick: () => {} }] },
          ]} />
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 移动端
    // ═══════════════════════════════════════════════════════════
    case 'mobile':
      return (
        <div className="vx-breakpoint-grid">
          {[
            { label: 'Phone', accent: '< 480px', description: isZh ? '单列布局，底部导航，简化数据表。' : 'Single-column layout, bottom nav, simplified tables.' },
            { label: 'Tablet', accent: '480–768px', description: isZh ? '保持可读间距，折叠侧边栏。' : 'Readable spacing, collapsible sidebar.' },
            { label: 'Desktop', accent: '> 768px', description: isZh ? '全功能布局，多列栅格。' : 'Full-featured layout, multi-column grids.' },
          ].map((card) => (
            <div key={card.label} className="vx-breakpoint-card">
              <Badge variant="accent">{card.accent}</Badge><strong>{card.label}</strong><p>{card.description}</p>
            </div>
          ))}
          <Alert title={isZh ? '统一代码基' : 'Unified codebase'} variant="info">
            {isZh ? '桌面端和移动端共享同一套路由树、状态管理和组件定义。' : 'Desktop and mobile share the same route tree, state management, and component definitions.'}
          </Alert>
        </div>
      );

    case 'mobile-list':
      return (
        <div className="vx-preview-stack" style={{ maxWidth: 320, border: '1px solid var(--vx-color-border)', borderRadius: 8, overflow: 'hidden' }}>
          <MobileList>
            <MobileListSection title={isZh ? '账户' : 'Account'}>
              <MobileListItem label={isZh ? '个人资料' : 'Profile'} chevron onClick={() => {}} />
              <MobileListItem label={isZh ? '安全设置' : 'Security'} chevron onClick={() => {}} />
            </MobileListSection>
            <MobileListSection title={isZh ? '偏好' : 'Preferences'}>
              <MobileListItem label={isZh ? '通知' : 'Notifications'} trailing={<Badge variant="accent">3</Badge>} />
              <MobileListItem label={isZh ? '主题' : 'Theme'} description={isZh ? '跟随系统' : 'System'} chevron onClick={() => {}} />
            </MobileListSection>
          </MobileList>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="vx-preview-stack" style={{ maxWidth: 400, border: '1px solid var(--vx-color-border)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: 16 }}>
            <BottomNav items={[
              { key: 'home', label: isZh ? '首页' : 'Home', icon: <House size={20} />, active: true },
              { key: 'search', label: isZh ? '搜索' : 'Search', icon: <Search size={20} /> },
              { key: 'alerts', label: isZh ? '通知' : 'Alerts', icon: <Bell size={20} />, badge: 3 },
              { key: 'profile', label: isZh ? '我的' : 'Profile', icon: <User size={20} /> },
            ]} />
          </div>
        </div>
      );

    // ═══════════════════════════════════════════════════════════
    // 模板页
    // ═══════════════════════════════════════════════════════════
    case 'home-page':
    case 'login-page':
    case 'register-page':
    case 'error-page':
    case 'privacy-policy':
    case 'terms-of-service': {
      const templateLabels: Record<string, string> = {
        'home-page': isZh ? '打开主页' : 'Open home',
        'login-page': isZh ? '打开登录' : 'Open login',
        'register-page': isZh ? '打开注册' : 'Open register',
        'error-page': isZh ? '打开错误页' : 'Open error page',
        'privacy-policy': isZh ? '打开隐私政策' : 'Open privacy policy',
        'terms-of-service': isZh ? '打开服务条款' : 'Open terms of service',
      };
      return <TemplateLauncher pageKey={pageKey as any} pageTitle={pages[pageKey]?.title ?? pageKey} pageDescription={pages[pageKey]?.description ?? ''} onNavigate={noNavigate} openPageLabel={templateLabels[pageKey] ?? (isZh ? '打开页面' : 'Open page')} />;
    }

    // ── 默认返回 null ──
    default:
      return null;
  }
}

// ── 底部导入 ──
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Heading } from '../../components/Heading';
import { Text } from '../../components/Text';
import { Skeleton } from '../../components/Skeleton';
import { Checkbox } from '../../components/Checkbox';
import { RadioGroup, Radio } from '../../components/Radio';
import { Slider } from '../../components/Slider';
import { Toggle, ToggleGroup } from '../../components/Toggle';
import { Switch } from '../../components/Switch';
import { Rating } from '../../components/Rating';
import { Label } from '../../components/Label';
import { Input } from '../../components/Input';
import { NumberInput } from '../../components/NumberInput';
import { TagInput } from '../../components/TagInput';
import { Textarea } from '../../components/Textarea';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Select } from '../../components/Select';
import { MultiSelect } from '../../components/MultiSelect';
import { DatePicker } from '../../components/DatePicker';
import { TimePicker } from '../../components/TimePicker';
import { FileUpload } from '../../components/FileUpload';
import { ColorPicker } from '../../components/ColorPicker';
import { Calendar } from '../../components/Calendar';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Separator } from '../../components/Separator';
import { Accordion } from '../../components/Accordion';
import { Timeline } from '../../components/Timeline';
import { TreeView } from '../../components/TreeView';
import { Table } from '../../components/Table';
import { Progress } from '../../components/Progress';
import { Spinner } from '../../components/Spinner';
import { Alert } from '../../components/Alert';
import { Stepper } from '../../components/Stepper';
import { Dialog } from '../../components/Dialog';
import { Popover } from '../../components/Popover';
import { Tooltip } from '../../components/Tooltip';
import { HoverCard } from '../../components/HoverCard';
import { DropdownMenu } from '../../components/DropdownMenu';
import { ContextMenu } from '../../components/ContextMenu';
import { NavigationMenu } from '../../components/NavigationMenu';
import { Menubar } from '../../components/Menubar';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import { Pagination } from '../../components/Pagination';
import { Carousel } from '../../components/Carousel';
import { ScrollArea } from '../../components/ScrollArea';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../components/Resizable';
import { Sheet } from '../../components/Sheet';
import { ShellNav, ShellNavSection, ShellNavItem } from '../../components/Shell';
import { BottomNav } from '../../components/mobile/BottomNav';
import { MobileList, MobileListSection, MobileListItem } from '../../components/mobile/MobileList';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../../components/Form';
