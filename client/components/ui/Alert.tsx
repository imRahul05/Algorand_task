import React from 'react';

interface AlertProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'warning';
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ className, variant = 'default', children }) => {
  const baseClasses = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return "text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive";
      case 'warning':
        return "text-yellow-600 dark:text-yellow-400 border-yellow-500/50 dark:border-yellow-500/50 [&>svg]:text-yellow-500";
      default:
        return "text-foreground";
    }
  };

  return (
    <div role="alert" className={`${baseClasses} ${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};

const AlertTitle: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
    {children}
  </h5>
);

const AlertDescription: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
    {children}
  </div>
);

export { Alert, AlertTitle, AlertDescription };