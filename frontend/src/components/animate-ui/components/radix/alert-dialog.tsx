
import { cn } from '../../../../lib/utils';
import {
  AlertDialogAction as AlertDialogActionPrimitive,
  AlertDialogCancel as AlertDialogCancelPrimitive,
  AlertDialogContent as AlertDialogContentPrimitive,
  AlertDialogDescription as AlertDialogDescriptionPrimitive,
  AlertDialogFooter as AlertDialogFooterPrimitive,
  AlertDialogHeader as AlertDialogHeaderPrimitive,
  AlertDialogOverlay as AlertDialogOverlayPrimitive,
  AlertDialogPortal as AlertDialogPortalPrimitive,
  AlertDialog as AlertDialogPrimitive,
  AlertDialogTitle as AlertDialogTitlePrimitive,
  AlertDialogTrigger as AlertDialogTriggerPrimitive,
  type AlertDialogActionProps as AlertDialogActionPrimitiveProps,
  type AlertDialogCancelProps as AlertDialogCancelPrimitiveProps,
  type AlertDialogContentProps as AlertDialogContentPrimitiveProps,
  type AlertDialogDescriptionProps as AlertDialogDescriptionPrimitiveProps,
  type AlertDialogFooterProps as AlertDialogFooterPrimitiveProps,
  type AlertDialogHeaderProps as AlertDialogHeaderPrimitiveProps,
  type AlertDialogOverlayProps as AlertDialogOverlayPrimitiveProps,
  type AlertDialogProps as AlertDialogPrimitiveProps,
  type AlertDialogTitleProps as AlertDialogTitlePrimitiveProps,
  type AlertDialogTriggerProps as AlertDialogTriggerPrimitiveProps,
} from '../../primitives/radix/alert-dialog';
import { buttonVariants } from '../buttons/button';

type AlertDialogProps = AlertDialogPrimitiveProps;

function AlertDialog(props: AlertDialogProps) {
  return <AlertDialogPrimitive {...props} />;
}

type AlertDialogTriggerProps = AlertDialogTriggerPrimitiveProps;

function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return <AlertDialogTriggerPrimitive {...props} />;
}

type AlertDialogOverlayProps = AlertDialogOverlayPrimitiveProps;

function AlertDialogOverlay({ className, ...props }: AlertDialogOverlayProps) {
  return (
    <AlertDialogOverlayPrimitive
      className={cn('fixed inset-0 z-50 bg-black/50', className)}
      {...props}
    />
  );
}

type AlertDialogContentProps = AlertDialogContentPrimitiveProps;

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortalPrimitive>
      <>
        <AlertDialogOverlay />
        <AlertDialogContentPrimitive
          className={cn(
            'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
            className,
          )}
          {...props}
        />
      </>
    </AlertDialogPortalPrimitive>
  );
}


type AlertDialogHeaderProps = AlertDialogHeaderPrimitiveProps;

function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <AlertDialogHeaderPrimitive
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

type AlertDialogFooterProps = AlertDialogFooterPrimitiveProps;

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <AlertDialogFooterPrimitive
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

type AlertDialogTitleProps = AlertDialogTitlePrimitiveProps;

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogTitlePrimitive
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
}

type AlertDialogDescriptionProps = AlertDialogDescriptionPrimitiveProps;

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogDescriptionPrimitive
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

type AlertDialogActionProps = AlertDialogActionPrimitiveProps;

function AlertDialogAction({
  className,
  ...props
}: AlertDialogActionPrimitiveProps) {
  return (
    <AlertDialogActionPrimitive
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

type AlertDialogCancelProps = AlertDialogCancelPrimitiveProps;

function AlertDialogCancel({
  className,
  ...props
}: AlertDialogCancelPrimitiveProps) {
  return (
    <AlertDialogCancelPrimitive
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, type AlertDialogActionProps,
  type AlertDialogCancelProps, type AlertDialogContentProps, type AlertDialogDescriptionProps, type AlertDialogFooterProps, type AlertDialogHeaderProps, type AlertDialogProps, type AlertDialogTitleProps, type AlertDialogTriggerProps
};

