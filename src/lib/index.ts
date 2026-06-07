import '../styles/base.css';

export { BREAKPOINTS, PHONE_MAX_WIDTH, PHONE_ASPECT_RATIO_THRESHOLD, TABLET_ASPECT_RATIO_THRESHOLD } from './breakpoints';
export type { ViewportType, ViewportContextValue, ViewportProviderProps } from './viewport';
export { ViewportProvider, useViewport } from './viewport';
export { Responsive } from '../components/Responsive';
export type { ResponsiveProps } from '../components/Responsive';

// ── 组合 Provider ─────────────────────────────────────────
export { VXUIProvider } from './VXUIProvider';
export type { VXUIProviderProps } from './VXUIProvider';

export { AppShell } from '../components/AppShell';
export type { AppShellProps, AppShellNavItem, AppShellNavSection } from '../components/AppShell';

// Shell primitives — compose your own layout
export {
  Shell,
  ShellSidebar,
  ShellNav,
  ShellNavSection,
  ShellNavItem,
  ShellOverlay,
  ShellMain,
  ShellTopbar,
  ShellContent,
} from '../components/Shell';
export type {
  ShellProps,
  ShellSidebarProps,
  ShellNavProps,
  ShellNavSectionProps,
  ShellNavItemProps,
  ShellOverlayProps,
  ShellMainProps,
  ShellTopbarProps,
  ShellContentProps,
  ShellNavItem as ShellNavItemType,
  ShellNavSection as ShellNavSectionType,
} from '../components/Shell';
export { Badge } from '../components/Badge';
export { Button } from '../components/Button';
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
export { Dialog, DialogClose } from '../components/Dialog';
export type { DialogProps, DialogSize, DialogPadding, DialogPlacement } from '../components/Dialog';
export { Input } from '../components/Input';
export { Switch } from '../components/Switch';
export { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
export {
	ThemeProvider,
	createTheme,
	themePresets,
	useTheme,
} from '../components/ThemeProvider';
export type {
	ThemeDefinition,
	ThemeMode,
	ThemeRegistry,
	ThemeTokens,
} from '../components/ThemeProvider';
export { ToastProvider, useToast } from '../components/Toast';

// Typography components
export { Text } from '../components/Text';
export type { TextProps } from '../components/Text';
export { Heading } from '../components/Heading';
export type { HeadingProps } from '../components/Heading';

// Form components
export { Select } from '../components/Select';
export type { SelectProps, SelectOption } from '../components/Select';
export { Checkbox } from '../components/Checkbox';
export type { CheckboxProps } from '../components/Checkbox';

export { SegmentedControl } from '../components/SegmentedControl';
export type { SegmentedControlProps, SegmentedControlOption } from '../components/SegmentedControl';
export { Radio, RadioGroup } from '../components/Radio';
export type { RadioProps, RadioGroupProps } from '../components/Radio';
export { Textarea } from '../components/Textarea';
export type { TextareaProps } from '../components/Textarea';
export { Slider } from '../components/Slider';
export type { SliderProps } from '../components/Slider';

// Feedback components
export { Spinner } from '../components/Spinner';
export type { SpinnerProps } from '../components/Spinner';
export { Progress } from '../components/Progress';
export type { ProgressProps } from '../components/Progress';
export { Alert } from '../components/Alert';
export type { AlertProps } from '../components/Alert';
export { Skeleton } from '../components/Skeleton';
export type { SkeletonProps } from '../components/Skeleton';

// Overlay components
export { Tooltip } from '../components/Tooltip';
export type { TooltipProps } from '../components/Tooltip';
export { Popover } from '../components/Popover';
export type { PopoverProps } from '../components/Popover';
export { DropdownMenu } from '../components/DropdownMenu';
export type { DropdownMenuProps, DropdownMenuItemProps, DropdownMenuGroupProps } from '../components/DropdownMenu';

// Navigation / Layout components
export { Breadcrumb } from '../components/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from '../components/Breadcrumb';
export { Pagination } from '../components/Pagination';
export type { PaginationProps } from '../components/Pagination';
export { Accordion } from '../components/Accordion';
export type { AccordionProps, AccordionItem } from '../components/Accordion';
export { Separator } from '../components/Separator';
export type { SeparatorProps } from '../components/Separator';

// Data display components
export { Avatar } from '../components/Avatar';
export type { AvatarProps } from '../components/Avatar';
export { Table } from '../components/Table';
export type { TableProps, TableColumn, SortDirection } from '../components/Table';

// Mobile components
export { MobileShell, MobileTopBar, MobileIconButton } from '../components/mobile/MobileShell';
export type { MobileShellProps, MobileTopBarProps, MobileIconButtonProps } from '../components/mobile/MobileShell';
export { BottomNav } from '../components/mobile/BottomNav';
export type { BottomNavProps, BottomNavItem } from '../components/mobile/BottomNav';
export { MobileList, MobileListSection, MobileListItem } from '../components/mobile/MobileList';
export type { MobileListSectionProps, MobileListItemProps } from '../components/mobile/MobileList';

// New: Form primitives
export { Label } from '../components/Label';
export type { LabelProps } from '../components/Label';
export { Form, FormField, FormLabel, FormDescription, FormMessage, useFormField } from '../components/Form';
export type { FormProps, FormFieldProps, FormLabelProps, FormDescriptionProps, FormMessageProps } from '../components/Form';

// New: Number Input
export { NumberInput } from '../components/NumberInput';
export type { NumberInputProps } from '../components/NumberInput';

// New: Calendar & DatePicker
export { Calendar } from '../components/Calendar';
export type { CalendarProps } from '../components/Calendar';
export { DatePicker } from '../components/DatePicker';
export type { DatePickerProps } from '../components/DatePicker';

// New: MultiSelect
export { MultiSelect } from '../components/MultiSelect';
export type { MultiSelectProps, MultiSelectOption } from '../components/MultiSelect';

// New: TimePicker
export { TimePicker } from '../components/TimePicker';
export type { TimePickerProps } from '../components/TimePicker';

// New: File Upload
export { FileUpload } from '../components/FileUpload';
export type { FileUploadProps, UploadedFile } from '../components/FileUpload';

// Sheet — 统一 Sheet 组件（替代 ActionSheet / MobileDrawer / 旧 Sheet）
export { Sheet } from '../components/Sheet';
export type { SheetProps, SheetSide, SheetVariant, SheetActionItemProps } from '../components/Sheet';

/**
 * @deprecated 使用统一的 Sheet 组件替代。
 * ActionSheet 将在下一个 major 版本中移除，请迁移到 Sheet 组件：
 *   <Sheet variant="action" side="bottom">
 * @see {@link Sheet} 统一 Sheet 组件
 */
export { ActionSheet, ActionSheetItem } from '../components/mobile/ActionSheet';
export type { ActionSheetProps, ActionSheetItemProps } from '../components/mobile/ActionSheet';

/**
 * @deprecated 使用统一的 Sheet 组件替代。
 * MobileDrawer 将在下一个 major 版本中移除，请迁移到 Sheet 组件：
 *   <Sheet side="left">
 * @see {@link Sheet} 统一 Sheet 组件
 */
export { MobileDrawer, DrawerNavItem, DrawerNavSection } from '../components/mobile/MobileDrawer';
export type { MobileDrawerProps, DrawerNavItemProps, DrawerNavSectionProps } from '../components/mobile/MobileDrawer';

// New: Scroll Area
export { ScrollArea } from '../components/ScrollArea';
export type { ScrollAreaProps } from '../components/ScrollArea';

// New: Toggle
export { Toggle, ToggleGroup } from '../components/Toggle';
export type { ToggleProps, ToggleGroupProps, ToggleGroupItem } from '../components/Toggle';

// New: Context Menu
export { ContextMenu } from '../components/ContextMenu';
export type { ContextMenuProps, ContextMenuItemProps, ContextMenuGroupProps } from '../components/ContextMenu';

// New: Hover Card
export { HoverCard } from '../components/HoverCard';
export type { HoverCardProps, HoverCardPlacement } from '../components/HoverCard';

// New: Menubar
export { Menubar } from '../components/Menubar';
export type { MenubarProps, MenubarMenuProps, MenubarGroupProps, MenubarItemProps } from '../components/Menubar';

// New: Navigation Menu
export { NavigationMenu } from '../components/NavigationMenu';
export type { NavigationMenuProps, NavMenuItem, NavMenuSubItem } from '../components/NavigationMenu';

// New: Stepper
export { Stepper } from '../components/Stepper';
export type { StepperProps, StepItem, StepStatus } from '../components/Stepper';

// New: Timeline
export { Timeline } from '../components/Timeline';
export type { TimelineProps, TimelineItem, TimelineItemStatus } from '../components/Timeline';

// New: Empty State
export { EmptyState } from '../components/EmptyState';
export type { EmptyStateProps } from '../components/EmptyState';

// Low-priority: Carousel
export { Carousel } from '../components/Carousel';
export type { CarouselProps } from '../components/Carousel';

// Low-priority: Rating
export { Rating } from '../components/Rating';
export type { RatingProps } from '../components/Rating';

// Low-priority: TreeView
export { TreeView } from '../components/TreeView';
export type { TreeViewProps, TreeNode } from '../components/TreeView';

// Low-priority: TagInput
export { TagInput } from '../components/TagInput';
export type { TagInputProps } from '../components/TagInput';

// Low-priority: ColorPicker
export { ColorPicker } from '../components/ColorPicker';
export type { ColorPickerProps } from '../components/ColorPicker';

// Low-priority: Resizable
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/Resizable';
export type { ResizablePanelGroupProps, ResizablePanelProps, ResizableHandleProps, ResizableDirection } from '../components/Resizable';

// Search / command
export { CommandPalette } from '../components/CommandPalette';
export type { CommandPaletteProps, SearchEntry } from '../components/CommandPalette';

// Code display
export { CodeBlock } from '../components/CodeBlock';
export type { CodeBlockProps, CodeBlockLanguage } from '../components/CodeBlock';

// Language switcher
export { LanguageSwitcher } from '../components/LanguageSwitcher';
export type { LanguageSwitcherProps } from '../components/LanguageSwitcher';

// ── Typography Base (排版组件) ─────────────────────────────
// 这些组件配合 typography-base.css 使用，提供文章/文档排版布局。
// CSS 类名参考 Bootstrap 风格，可直接在 JSX 中使用 className。
//
// 可用 CSS 类（无需组件，直接使用 className）：
//   vx-article, vx-article__header, vx-article__title, vx-article__description
//   vx-article__body, vx-article__content
//   vx-section, vx-section__heading, vx-section__anchor
//   vx-display, vx-display--page, vx-display--section
//   vx-lead, vx-lead--page
//   vx-kicker, vx-list, vx-code, vx-badges, vx-meta, vx-actions
//   vx-breadcrumb, vx-empty
//   vx-example, vx-example__grid, vx-example__panel, vx-example__meta, vx-example__eyebrow
//   vx-props-table, vx-prop-required, vx-prop-type, vx-prop-dash
//   vx-pager, vx-pager__btn, vx-pager__dir, vx-pager__label
//   vx-mobile-preview, vx-mobile-preview__frame, vx-mobile-preview__iframe, vx-mobile-preview__hint
//   vx-preview-shell, vx-preview-grid, vx-preview-list, vx-preview-stack, vx-preview-inline
//   vx-stats, vx-stat, vx-stat__copy, vx-stat__label, vx-stat__value, vx-stat__hint, vx-stat__icon
export {
  Article,
  ArticleHeader,
  ArticleTitle,
  ArticleBody,
  Section,
  SectionHeading,
  Pager,
  PropsTable,
  ArticleEmptyState,
  StatsGrid,
} from '../components/Article';
export type {
  ArticleProps,
  ArticleHeaderProps,
  ArticleTitleProps,
  ArticleBodyProps,
  SectionProps,
  SectionHeadingProps,
  PagerProps,
  PagerItem,
  PropsTableProps,
  PropsTableColumn,
  ArticleEmptyStateProps,
  StatsGridProps,
  StatItem,
} from '../components/Article';
