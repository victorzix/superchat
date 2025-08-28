import ChatListItem from "@/features/chat/components/recentChats/ChatListItem";

export default function RecentChats() {
  return (
    <ol>
      <ChatListItem chat={{
        receiver: {
          name: 'Chat 1',
          profilePicture: 'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'
        }
      }}/>

      <ChatListItem chat={{
        name: 'Chat 2 grupo',
        picture: 'https://static.vecteezy.com/system/resources/thumbnails/026/612/361/small_2x/people-icon-simple-solid-style-crowd-sign-flat-style-person-group-user-human-public-member-staff-team-business-concept-glyph-illustration-isolated-on-white-background-eps-10-vector.jpg',
        isGroup: true,
        lastSender: {name: 'Sender'}
      }}/>
    </ol>
  )
}