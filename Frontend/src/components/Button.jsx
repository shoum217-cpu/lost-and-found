/**
 * Button.jsx – Reusable button component.
 *
 * Props:
 *   variant  – 'primary' | 'secondary' | 'outline' | 'ghost'  (default: 'primary')
 *   size     – 'sm' | 'md' | 'lg'                             (default: 'md')
 *   as       – render as a different element, e.g. 'a'         (default: 'button')
 *   children – button label / content
 *   ...rest  – any other HTML button or anchor attributes
 */

const variants = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
  secondary:
    'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 active:bg-blue-200 dark:active:bg-blue-800',
  outline:
    'border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 active:bg-gray-100 dark:active:bg-neutral-700',
  ghost:
    'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 active:bg-gray-200 dark:active:bg-neutral-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-lg gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  className = '',
  children,
  ...rest
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  return (
    <Tag
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
