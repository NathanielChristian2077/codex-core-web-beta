"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../animate-ui/components/radix/ui/avatar";

type Props = {
  name: string;
  imageUrl?: string | null;
};

export default function UserAvatar({ name, imageUrl }: Props) {
  const initials =
    name
      ?.split(" ")
      .map((p) => p[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "??";

  return (
    <Avatar className="h-8 w-8 rounded-lg">
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={name} />
      ) : (
        <AvatarFallback className="rounded-lg">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
