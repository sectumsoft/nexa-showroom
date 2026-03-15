'use client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Props {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
}

export default function AnimatedSection({ children, className = '', direction = 'up', delay = 0 }: Props) {
  const { ref, isVisible } = useScrollAnimation();

  const baseClass =
    direction === 'left'
      ? 'animate-on-scroll-left'
      : direction === 'right'
      ? 'animate-on-scroll-right'
      : 'animate-on-scroll';

  return (
    <div
      ref={ref}
      className={`${baseClass} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}