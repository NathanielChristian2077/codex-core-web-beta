'use client';

import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import * as React from 'react';

import type { HTMLMotionProps } from 'motion/react';

type AlertDialogContextType = {
  isOpen: boolean;
  setIsOpen: AlertDialogProps['onOpenChange'];
};

const AlertDialogContext = React.createContext<AlertDialogContextType | null>(
  null,
);

function useAlertDialog() {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) {
    throw new Error('useAlertDialog must be used within AlertDialogProvider');
  }
  return ctx;
}

type AlertDialogProps = React.ComponentProps<typeof AlertDialogPrimitive.Root>;

function AlertDialog(props: AlertDialogProps) {
  const [isOpen, setIsOpen] = React.useState(
    props.open ?? props.defaultOpen ?? false,
  );

  const handleOpenChange =
    props.onOpenChange ??
    ((_open: boolean) => {

    });

  const handleSetOpen = (open: boolean) => {
    setIsOpen(open);
    handleOpenChange(open);
  };

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen: handleSetOpen }}>
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        {...props}
        open={isOpen}
        onOpenChange={handleSetOpen}
      />
    </AlertDialogContext.Provider>
  );
}

type AlertDialogTriggerProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Trigger
>;

function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
    />
  );
}

type AlertDialogPortalProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Portal
>;

function AlertDialogPortal(props: AlertDialogPortalProps) {
  const { isOpen } = useAlertDialog();

  if (!isOpen) return null;

  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      {...props}
    />
  );
}

type AlertDialogOverlayProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Overlay
> &
  HTMLMotionProps<'div'>;

function AlertDialogOverlay({ style, ...props }: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      style={style}
      {...props}
    />
  );
}

type AlertDialogContentProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Content
> &
  HTMLMotionProps<'div'> & {
    from?: 'top' | 'bottom' | 'left' | 'right';
  };

function AlertDialogContent({
  from, 
  style,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Content
      data-slot="alert-dialog-content"
      style={style}
      {...props}
    />
  );
}

type AlertDialogCancelProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Cancel
>;

function AlertDialogCancel(props: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      {...props}
    />
  );
}

type AlertDialogActionProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Action
>;

function AlertDialogAction(props: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      {...props}
    />
  );
}

type AlertDialogHeaderProps = React.ComponentProps<'div'>;

function AlertDialogHeader(props: AlertDialogHeaderProps) {
  return <div data-slot="alert-dialog-header" {...props} />;
}

type AlertDialogFooterProps = React.ComponentProps<'div'>;

function AlertDialogFooter(props: AlertDialogFooterProps) {
  return <div data-slot="alert-dialog-footer" {...props} />;
}

type AlertDialogTitleProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Title
>;

function AlertDialogTitle(props: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      {...props}
    />
  );
}

type AlertDialogDescriptionProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Description
>;

function AlertDialogDescription(props: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  useAlertDialog,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
  type AlertDialogContentProps,
  type AlertDialogContextType,
  type AlertDialogDescriptionProps,
  type AlertDialogFooterProps,
  type AlertDialogHeaderProps,
  type AlertDialogOverlayProps,
  type AlertDialogPortalProps,
  type AlertDialogProps,
  type AlertDialogTitleProps,
  type AlertDialogTriggerProps
};

