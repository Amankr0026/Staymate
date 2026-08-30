import React from 'react';
import { ShieldCheck, User, Users, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import type { GenderPreference } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  className = '',
  id,
}) => {
  const variantStyles = {
    primary: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    secondary: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    outline: 'bg-transparent text-slate-300 border-white/20',
    slate: 'bg-white/5 text-slate-300 border-white/10',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size];

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export const VerifiedBadge: React.FC<{ size?: 'sm' | 'md'; id?: string }> = ({ size = 'sm', id }) => {
  return (
    <span
      id={id || 'badge-verified'}
      className={`inline-flex items-center gap-1 font-bold text-black bg-white/95 rounded shadow-sm tracking-wider uppercase ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-black' : 'w-3.5 h-3.5 text-black'} />
      VERIFIED
    </span>
  );
};

export const GenderBadge: React.FC<{ gender: GenderPreference; size?: 'sm' | 'md'; id?: string }> = ({
  gender,
  size = 'sm',
  id,
}) => {
  if (gender === 'boys') {
    return (
      <Badge id={id} variant="info" size={size}>
        <User className="w-3 h-3" />
        Boys PG
      </Badge>
    );
  }
  if (gender === 'girls') {
    return (
      <Badge id={id} variant="secondary" size={size}>
        <User className="w-3 h-3" />
        Girls PG
      </Badge>
    );
  }
  return (
    <Badge id={id} variant="primary" size={size}>
      <Users className="w-3 h-3" />
      Unisex / Co-living
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: string; id?: string }> = ({ status, id }) => {
  const normalized = status.toLowerCase();
  if (['accepted', 'responded', 'completed', 'active', 'published'].includes(normalized)) {
    return (
      <Badge id={id} variant="success">
        <CheckCircle className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }
  if (['pending', 'sent', 'viewed'].includes(normalized)) {
    return (
      <Badge id={id} variant="warning">
        <Clock className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }
  if (['rejected', 'closed', 'unverified'].includes(normalized)) {
    return (
      <Badge id={id} variant="danger">
        <XCircle className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }
  return (
    <Badge id={id} variant="info">
      <AlertCircle className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
