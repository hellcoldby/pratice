import React from 'react';
import './index.css';

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be? 按钮尺寸选择
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents  按钮上为文字内容
   */
  label: string;
  /**
   * Optional click handler  设置点击事件
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 * 用于用户交互的主要 UI 组件
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
