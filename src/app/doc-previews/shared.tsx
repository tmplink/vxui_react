/**
 * sharedDocPreviews — 桌面端和移动端共享的文档预览渲染逻辑
 * 从 DesktopApp.tsx 和 MobileApp.tsx 提取
 */
import type { ReactNode } from 'react';
import type { PageKey } from '../routes';
import { CodeBlock } from '../../components/CodeBlock';
import { Button } from '../../components/Button';
import { ArrowRight, Zap } from 'lucide-react';
import { pageIcons } from '../nav-config';
import type { PageDefinition } from '../routes';

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
  // Component state callbacks for interactive previews
  onChange?: (pageKey: PageKey, value: any) => void;
}

// ── 共享预览渲染函数 ──
export function renderSharedPreview(pageKey: PageKey, options: SharedPreviewOptions): ReactNode {
  const { isZh, pages } = options;

  switch (pageKey) {
    // ── 基础元素 ──
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

    // ── 表单控件 ──
    case 'form-inputs':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-stack__group">
            <Checkbox checked={false} label={isZh ? '默认启用响应式抽屉' : 'Enable responsive drawer'} onChange={() => {}} />
            <Checkbox checked={true} label={isZh ? '显示调试边界' : 'Show debug boundaries'} onChange={() => {}} />
          </div>
          <RadioGroup label={isZh ? '密度策略' : 'Density strategy'}>
            <Radio checked={false} label={isZh ? '跟随系统' : 'Follow system'} name="density" onChange={() => {}} />
            <Radio checked={true} label={isZh ? '舒适' : 'Comfortable'} name="density" onChange={() => {}} />
            <Radio checked={false} label={isZh ? '紧凑' : 'Compact'} name="density" onChange={() => {}} />
          </RadioGroup>
          <Slider label={isZh ? '文档完成度' : 'Coverage'} max={100} min={0} onChange={() => {}} showValue value={68} />
          <div className="vx-preview-stack__group" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Toggle data-state="on">{isZh ? '自动保存' : 'Auto-save'}</Toggle>
              <Toggle>{isZh ? '多标签模式' : 'Multiple tabs'}</Toggle>
            </div>
            <Switch defaultChecked label={isZh ? '开启实验性功能' : 'Enable experimental features'} />
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

    // ── 布局与导航 ──
    case 'nav-layout':
      return (
        <div className="vx-preview-stack">
          <Breadcrumb items={[{ label: 'Home' }, { label: 'Components' }, { label: 'Navigation' }]} />
          <Separator />
          <Accordion defaultOpen={['hierarchy']} items={[
            { key: 'hierarchy', title: isZh ? '层级保持一致' : 'Hierarchy stays consistent', content: isZh ? '所有断点共享同一路由。' : 'Every breakpoint shares the same route tree.' },
            { key: 'density', title: isZh ? '壳层只调密度' : 'Shell adjusts density', content: isZh ? '导航抽屉、顶部工具区和内容栅格按宽度变化。' : 'The drawer, header tools, and content grids adapt by width.' },
          ]} />
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

    case 'breadcrumb':
      return (
        <div className="vx-preview-stack">
          <Breadcrumb items={[{ label: isZh ? '首页' : 'Home', href: '#' }, { label: isZh ? '组件' : 'Components', href: '#' }, { label: isZh ? '导航' : 'Navigation' }]} />
        </div>
      );

    // ── 数据展示 ──
    case 'data-display':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline">
            <Avatar name="Alice Chen" size="sm" />
            <Avatar name="Bo Wang" size="md" />
            <Avatar name="Cora Lin" size="lg" />
          </div>
          <Timeline items={[
            { title: isZh ? '已创建' : 'Created', time: '10:00 AM' },
            { title: isZh ? '处理中' : 'Processing', time: '10:05 AM' },
            { title: isZh ? '已完成' : 'Completed', time: '10:15 AM' },
          ]} />
        </div>
      );

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

    case 'table':
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
        </div>
      );

    // ── 反馈组件 ──
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

    case 'alert':
      return (
        <div className="vx-preview-stack">
          <Alert title={isZh ? '提示信息' : 'Information'} variant="info">{isZh ? '这是一条提示信息。' : 'This is an informational message.'}</Alert>
          <Alert title={isZh ? '操作成功' : 'Success'} variant="success">{isZh ? '操作已成功完成。' : 'Operation completed successfully.'}</Alert>
          <Alert title={isZh ? '错误' : 'Error'} variant="danger">{isZh ? '出错了，请重试。' : 'Something went wrong.'}</Alert>
        </div>
      );

    case 'feedback':
      return (
        <div className="vx-preview-stack">
          <Alert title={isZh ? '迁移进度' : 'Migration progress'} variant="info">
            {isZh ? '响应式壳层、模板页面和文档内容库已经收敛到同一套运行时。' : 'The responsive shell, template pages, and docs library now share the same runtime.'}
          </Alert>
          <Progress label={isZh ? '默认' : 'Default'} showLabel value={68} />
          <Progress label={isZh ? '成功' : 'Success'} showLabel value={68} variant="success" />
          <div className="vx-preview-stack__group">
            <div className="vx-preview-inline"><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /></div>
            <Stepper currentStep={2} steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]} />
          </div>
        </div>
      );

    case 'empty-states':
      return (
        <div className="vx-empty">
          <div className="vx-empty__icon"><Zap size={20} /></div>
          <strong>{isZh ? '这里暂时没有内容' : 'Nothing lives here yet'}</strong>
          <p>{isZh ? '空状态与错误页共享同一套视觉策略。' : 'Empty states share the same visual language.'}</p>
        </div>
      );

    // ── 叠层浮层 ──
    case 'dialog':
      return (
        <div className="vx-preview-stack">
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Dialog trigger={<Button>{isZh ? '打开对话框' : 'Open dialog'}</Button>}
              title={isZh ? '确认操作' : 'Confirm action'} description={isZh ? '请确认此操作。' : 'Please confirm this operation.'}
              confirmLabel={isZh ? '确认' : 'Confirm'} cancelLabel={isZh ? '取消' : 'Cancel'}>
              {isZh ? '此操作将立即生效。' : 'This action will be applied immediately.'}
            </Dialog>
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

    // ── 内容组件 ──
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
          <Pagination page={1} total={48} pageSize={10} onChange={() => {}} />
        </div>
      );

    case 'stepper':
      return (
        <div className="vx-preview-stack">
          <Stepper currentStep={1} steps={[{ label: isZh ? '规划' : 'Plan' }, { label: isZh ? '开发' : 'Build' }, { label: isZh ? '发布' : 'Launch' }]} />
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

    case 'scroll-area':
      return (
        <div className="vx-preview-stack">
          <ScrollArea maxHeight={160} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--vx-color-border)' }}>
                {isZh ? `日志行 ${i + 1}` : `Log line ${i + 1}`}
              </div>
            ))}
          </ScrollArea>
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

    // ── 默认返回 null ──
    default:
      return null;
  }
}

// ── 需要动态导入的组件（由调用方提供） ──
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Heading } from '../../components/Heading';
import { Text } from '../../components/Text';
import { Skeleton } from '../../components/Skeleton';
import { Checkbox } from '../../components/Checkbox';
import { RadioGroup, Radio } from '../../components/Radio';
import { Slider } from '../../components/Slider';
import { Toggle } from '../../components/Toggle';
import { Switch } from '../../components/Switch';
import { Rating } from '../../components/Rating';
import { Label } from '../../components/Label';
import { Input } from '../../components/Input';
import { DatePicker } from '../../components/DatePicker';
import { FileUpload } from '../../components/FileUpload';
import { ColorPicker } from '../../components/ColorPicker';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import { Pagination } from '../../components/Pagination';
import { Carousel } from '../../components/Carousel';
import { ScrollArea } from '../../components/ScrollArea';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../components/Resizable';
import { Sheet } from '../../components/Sheet';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../../components/Form';