type Props = {
  name?: string,
  email?: string,
  imageUrl?: string,
  size?: number //px
}

export default function UserAvatar({ name, email, imageUrl, size = 36 }: Props) {
  const initials = getInitials(name || email || "U");
  const style = { width: size, height: size };
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || email || "User"}
        className="rounded-full object-cover"
        style={style}
      />
    );
  }
  return (
    <div
      className="grid place-items-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
      style={style}
      aria-label={name || email || "User"}
      role="img"
    >
      <span className="text-sm font-semibold">{initials}</span>
    </div>
  );
}

function getInitials(s: string) {
  return s.split(/[@\s._-]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

