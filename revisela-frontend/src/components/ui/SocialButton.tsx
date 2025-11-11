import { Button } from './Button';

interface SocialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  loading?: boolean;
  loadingText?: string;
  loadingAnimation?: 'spin' | 'pulse' | 'dots' | 'bars' | 'ripple';
  size?: 'sm' | 'md' | 'lg';
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  loading,
  loadingText,
  loadingAnimation,
  size,
  ...props
}) => {
  return (
    <Button
      variant="outline"
      loading={loading}
      loadingText={loadingText}
      loadingAnimation={loadingAnimation}
      size={size}
      {...props}
    >
      <span className="flex items-center gap-2">
        {!loading && icon}
        {label}
      </span>
    </Button>
  );
};
