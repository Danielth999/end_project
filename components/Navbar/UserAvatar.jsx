import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

const UserAvatar = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage
        src={user.imageUrl || "/default-avatar.png"}
        alt={user.fullName || "User"}
      />
      <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
