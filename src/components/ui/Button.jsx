import Icon from '../../lib/icons.jsx'

/**
 * Button / link button.
 * variant: primary | secondary | ghost | whatsapp | call
 * as: 'button' | 'a'  (use 'a' for tel:/wa.me/mailto links)
 */
export default function Button({
  children,
  variant = 'primary',
  size,
  block = false,
  icon,
  iconRight,
  as = 'button',
  className = '',
  ...rest
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'lg' ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} />}
    </>
  )

  if (as === 'a') {
    return (
      <a className={cls} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button className={cls} type={rest.type || 'button'} {...rest}>
      {content}
    </button>
  )
}
