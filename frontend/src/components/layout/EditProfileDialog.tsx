"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../animate-ui/components/radix/dialog";

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "../animate-ui/components/radix/tabs";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../animate-ui/components/radix/alert-dialog";

import {
  changePassword,
  deleteCurrentUser as deleteMe,
  updateCurrentUser as updateMe,
} from "../../features/users/api";
import { cn } from "../../lib/utils";
import { useSession } from "../../store/useSession";
import { Button } from "../animate-ui/components/radix/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../animate-ui/components/radix/ui/card";
import { Input } from "../animate-ui/components/radix/ui/input";
import { Label } from "../animate-ui/components/radix/ui/label";
import { useToast } from "./ToastProvider";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string | null;
  initialEmail?: string | null;
};

export function EditProfileDialog({
  open,
  onOpenChange,
  initialName,
  initialEmail,
}: EditProfileDialogProps) {
  const t = useToast();
  const logout = useSession((s) => s.logout);

  const [name, setName] = React.useState(initialName ?? "");
  const [email, setEmail] = React.useState(initialEmail ?? "");

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const [savingAccount, setSavingAccount] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  // Reset when dialog opens
  React.useEffect(() => {
    if (!open) return;
    setName(initialName ?? "");
    setEmail(initialEmail ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  }, [open, initialName, initialEmail]);

  function handleClose() {
    onOpenChange(false);
  }

  async function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      t.show("Name and email are required", "error");
      return;
    }

    try {
      setSavingAccount(true);
      await updateMe({
        name: name.trim(),
        email: email.trim(),
      });

      t.show("Profile updated", "success");
      handleClose();
    } catch {
      t.show("Failed to update profile", "error");
    } finally {
      setSavingAccount(false);
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({
        currentPassword,
        newPassword,
      });

      t.show("Password updated", "success");
      handleClose();
    } catch {
      setPasswordError(
        "Failed to update password. Check your current password."
      );
      t.show("Failed to update password", "error");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      setDeleting(true);
      await deleteMe();
      t.show("Account deleted", "success");
      logout();
    } catch {
      t.show("Failed to delete account", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent from="bottom" showCloseButton className="sm:max-w-xl">
        <DialogHeader className="mb-4">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Manage your account information and password.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account">
          {/* TAB HEADERS */}
          <TabsList className="flex gap-2 rounded-md bg-zinc-100 p-1 text-sm dark:bg-zinc-900">
            <TabsTrigger
              value="account"
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-center cursor-pointer transition",
                "data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-950"
              )}
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-center cursor-pointer transition",
                "data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-950"
              )}
            >
              Password
            </TabsTrigger>
          </TabsList>

          <Card className="mt-4 border-none p-0 shadow-none">
            <TabsContents className="pt-2">
              {/* ACCOUNT TAB */}
              <TabsContent value="account" className="flex flex-col gap-6">
                <form
                  onSubmit={handleSaveAccount}
                  className="flex flex-col gap-6"
                >
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                      Update your display name and email.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grid gap-4 px-0">
                    <div className="grid gap-2">
                      <Label htmlFor="profile-name">Name</Label>
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </CardContent>

                  <DialogFooter className="gap-2 px-0 pb-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={savingAccount}>
                      {savingAccount ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>

                {/* DANGER ZONE */}
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-xs dark:border-red-900/60 dark:bg-red-950/40">
                  <div className="mb-2 font-semibold text-red-700 dark:text-red-300">
                    Danger zone
                  </div>
                  <p className="mb-3 text-red-700/80 dark:text-red-300/80">
                    Deleting your account will remove all campaigns and data.
                    This action cannot be undone.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* IMPORTANT: single React element child */}
                      <Button
                        type="button"
                        variant="outline"
                        className="border-red-400 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
                      >
                        Delete account
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent from="top">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete account permanently?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will delete your user and all associated Codex
                          Core data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                        >
                          {deleting ? "Deleting..." : "Delete account"}
                        </AlertDialogAction>
                        <AlertDialogCancel asChild>
                          <Button variant="outline">Cancel</Button>
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TabsContent>

              {/* PASSWORD TAB */}
              <TabsContent value="password" className="flex flex-col gap-6">
                <form
                  onSubmit={handleSavePassword}
                  className="flex flex-col gap-6"
                >
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password. You might be logged out after
                      saving.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grid gap-4 px-0">
                    <div className="grid gap-2">
                      <Label htmlFor="profile-current-password">
                        Current password
                      </Label>
                      <Input
                        id="profile-current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="profile-new-password">New password</Label>
                      <Input
                        id="profile-new-password"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="profile-confirm-password">
                        Confirm new password
                      </Label>
                      <Input
                        id="profile-confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    {passwordError && (
                      <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                  </CardContent>

                  <DialogFooter className="gap-2 px-0 pb-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={savingPassword}>
                      {savingPassword ? "Saving..." : "Save password"}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </TabsContents>
          </Card>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
