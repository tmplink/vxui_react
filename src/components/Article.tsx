/**
 * Article — 文章/文档排版容器组件
 * 
 * 提供开箱即用的文章排版布局，配合 typography-base.css 使用。
 * 支持文章头部、正文、章节、示例、属性表格等排版元素。
 * 
 * 用法：
 * ```tsx
 * import { Article, ArticleHeader, ArticleTitle, Section, SectionHeading, Pager } from 'vxui-react';
 * 
 * <Article>
 *   <ArticleHeader>
 *     <span className="vx-kicker">分类</span>
 *     <ArticleTitle>文章标题</ArticleTitle>
 *     <p className="vx-article__description">文章描述</p>
 *   </ArticleHeader>
 *   <ArticleBody>
 *     <Section id="overview">
 *       <SectionHeading anchor="#overview">概述</SectionHeading>
 *       <p>内容...</p>
 *     </Section>
 *   </ArticleBody>
 *   <Pager prev={{ label: '上一页', onClick: () => {} }} next={{ label: '下一页', onClick: () => {} }} />
 * </Article>
 * ```
 */

import type { HTMLAttributes, ReactNode } from 'react';

// ── Article ────────────────────────────────────────────────

export interface ArticleProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function Article({ children, className = '', ...props }: ArticleProps) {
  return (
    <article className={`vx-article ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}

// ── ArticleHeader ──────────────────────────────────────────

export interface ArticleHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function ArticleHeader({ children, className = '', ...props }: ArticleHeaderProps) {
  return (
    <header className={`vx-article__header ${className}`.trim()} {...props}>
      {children}
    </header>
  );
}

// ── ArticleTitle ───────────────────────────────────────────

export interface ArticleTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function ArticleTitle({ children, className = '', ...props }: ArticleTitleProps) {
  return (
    <h1 className={`vx-article__title ${className}`.trim()} {...props}>
      {children}
    </h1>
  );
}

// ── ArticleBody ────────────────────────────────────────────

export interface ArticleBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function ArticleBody({ children, className = '', ...props }: ArticleBodyProps) {
  return (
    <div className={`vx-article__body ${className}`.trim()} {...props}>
      <div className="vx-article__content">
        {children}
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** 章节 id，用于锚点跳转 */
  sectionId?: string;
}

export function Section({ children, className = '', sectionId, ...props }: SectionProps) {
  return (
    <section id={sectionId} className={`vx-section ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}

// ── SectionHeading ─────────────────────────────────────────

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  /** 锚点链接，如果提供则显示 # 锚点图标 */
  anchor?: string;
}

export function SectionHeading({ children, className = '', anchor, ...props }: SectionHeadingProps) {
  return (
    <h2 className={`vx-section__heading ${className}`.trim()} {...props}>
      {children}
      {anchor && (
        <a href={anchor} className="vx-section__anchor" aria-label={`Link to ${anchor}`}>#</a>
      )}
    </h2>
  );
}

// ── Pager ──────────────────────────────────────────────────

export interface PagerItem {
  label: string;
  onClick: () => void;
}

export interface PagerProps {
  /** 上一页，不提供则隐藏 */
  prev?: PagerItem;
  /** 下一页，不提供则隐藏 */
  next?: PagerItem;
  className?: string;
}

export function Pager({ prev, next, className = '' }: PagerProps) {
  if (!prev && !next) return null;
  return (
    <nav className={`vx-pager ${className}`.trim()} aria-label="Page navigation">
      {prev ? (
        <button type="button" className="vx-pager__btn" onClick={prev.onClick}>
          <span className="vx-pager__dir">← Previous</span>
          <span className="vx-pager__label">{prev.label}</span>
        </button>
      ) : <div />}
      {next && (
        <button type="button" className="vx-pager__btn vx-pager__btn--next" onClick={next.onClick}>
          <span className="vx-pager__dir">Next →</span>
          <span className="vx-pager__label">{next.label}</span>
        </button>
      )}
    </nav>
  );
}

// ── PropsTable ─────────────────────────────────────────────

export interface PropsTableColumn {
  prop: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface PropsTableProps {
  columns: PropsTableColumn[];
  className?: string;
}

export function PropsTable({ columns, className = '' }: PropsTableProps) {
  return (
    <div className={`vx-props-table-wrapper ${className}`.trim()}>
      <table className="vx-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((row) => (
            <tr key={row.prop}>
              <td>
                <code>{row.prop}</code>
                {row.required && <span className="vx-prop-required" title="Required">*</span>}
              </td>
              <td><code className="vx-prop-type">{row.type}</code></td>
              <td>
                {row.default ? <code>{row.default}</code> : <span className="vx-prop-dash">—</span>}
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── ArticleEmptyState ──────────────────────────────────────

export interface ArticleEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ArticleEmptyState({ icon, title, description, action, className = '' }: ArticleEmptyStateProps) {
  return (
    <div className={`vx-empty ${className}`.trim()}>
      {icon && <div className="vx-empty__icon">{icon}</div>}
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

// ── StatsGrid / Stat ──────────────────────────────────────

export interface StatItem {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}

export interface StatsGridProps {
  items: StatItem[];
  className?: string;
}

export function StatsGrid({ items, className = '' }: StatsGridProps) {
  return (
    <div className={`vx-stats ${className}`.trim()}>
      {items.map((item) => (
        <div key={item.label} className="vx-stat">
          <div className="vx-stat__copy">
            <span className="vx-stat__label">{item.label}</span>
            <strong className="vx-stat__value">{item.value}</strong>
            {item.hint && <small className="vx-stat__hint">{item.hint}</small>}
          </div>
          {item.icon && <div className="vx-stat__icon">{item.icon}</div>}
        </div>
      ))}
    </div>
  );
}
