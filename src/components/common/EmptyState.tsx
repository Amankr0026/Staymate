import React, { type ReactNode } from 'react';
import { LucideIcon, Search, Home, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  extraContent?: ReactNode;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Search,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  extraContent,
  id = 'empty-state',
}) => {
  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[#161618] rounded-2xl border border-dashed border-white/10 max-w-lg mx-auto text-white"
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-colors"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}

      {extraContent && <div className="mt-4">{extraContent}</div>}
    </div>
  );
};
