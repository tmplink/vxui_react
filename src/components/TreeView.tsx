import type { ReactNode, KeyboardEvent } from 'react';
import { useState, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from '../lib/cx';

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  data?: unknown;
}

export interface TreeViewProps {
  nodes: TreeNode[];
  selected?: string;
  defaultSelected?: string;
  onSelect?: (id: string, node: TreeNode) => void;
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  className?: string;
}

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  selected: string | undefined;
  expanded: Set<string>;
  onSelect: (id: string, node: TreeNode) => void;
  onToggle: (id: string) => void;
}

function TreeNodeItem({ node, depth, selected, expanded, onSelect, onToggle }: TreeNodeItemProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!node.disabled) onSelect(node.id, node);
    }
    if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
      e.preventDefault();
      onToggle(node.id);
    }
    if (e.key === 'ArrowLeft' && isExpanded) {
      e.preventDefault();
      onToggle(node.id);
    }
  };

  return (
    <li role="treeitem" aria-selected={isSelected} aria-expanded={hasChildren ? isExpanded : undefined}>
      <div
        className={cx(
          'vx-tree__node',
          isSelected && 'vx-tree__node--selected',
          node.disabled && 'vx-tree__node--disabled',
        )}
        style={{ paddingLeft: `${8 + depth * 20}px` }}
        onClick={() => {
          if (node.disabled) return;
          onSelect(node.id, node);
          if (hasChildren) onToggle(node.id);
        }}
        onKeyDown={handleKeyDown}
        tabIndex={node.disabled ? -1 : 0}
        role="button"
        aria-label={typeof node.label === 'string' ? node.label : undefined}
      >
        <span className={cx('vx-tree__expand', !hasChildren && 'vx-tree__expand--hidden')}>
          <ChevronRight
            size={14}
            className={cx('vx-tree__chevron', isExpanded && 'vx-tree__chevron--open')}
          />
        </span>
        {node.icon && <span className="vx-tree__icon">{node.icon}</span>}
        <span className="vx-tree__label">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <ul role="group" className="vx-tree__children">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({
  nodes,
  selected: controlledSelected,
  defaultSelected,
  onSelect,
  defaultExpanded = [],
  expanded: controlledExpanded,
  onExpandedChange,
  className,
}: TreeViewProps) {
  const isSelControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState<string | undefined>(defaultSelected);
  const selected = isSelControlled ? controlledSelected : internalSelected;

  const isExpControlled = controlledExpanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    new Set(defaultExpanded),
  );
  const expandedSet = isExpControlled ? new Set(controlledExpanded) : internalExpanded;

  const handleSelect = useCallback(
    (id: string, node: TreeNode) => {
      if (!isSelControlled) setInternalSelected(id);
      onSelect?.(id, node);
    },
    [isSelControlled, onSelect],
  );

  const handleToggle = useCallback(
    (id: string) => {
      const next = new Set(expandedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (!isExpControlled) setInternalExpanded(next);
      onExpandedChange?.([...next]);
    },
    [expandedSet, isExpControlled, onExpandedChange],
  );

  return (
    <ul
      className={cx('vx-tree', className)}
      role="tree"
      aria-multiselectable="false"
    >
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          expanded={expandedSet}
          onSelect={handleSelect}
          onToggle={handleToggle}
        />
      ))}
    </ul>
  );
}
