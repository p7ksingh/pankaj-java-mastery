import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'icon' | 'success' | 'danger'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  onClick?: () => void
  title?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  title,
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}
