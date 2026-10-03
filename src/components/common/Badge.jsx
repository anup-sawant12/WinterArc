import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variantStyles = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    mediumPriority: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    default: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  const selectedVariant = variantStyles[variant] || variantStyles.default;
  const selectedSize = sizeStyles[size] || sizeStyles.sm;

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${selectedVariant} ${selectedSize} ${className}`}>
      {children}
    </span>
  );
}
