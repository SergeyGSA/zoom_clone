import { HouseCardsHandlers } from '@/enums'

export const sidebarLinks = [
  {
    label: 'Home',
    route: '/',
    imgUrl: '/icons/Home.svg',
  },
  {
    label: 'Upcoming',
    route: '/upcoming',
    imgUrl: '/icons/upcoming.svg',
  },
  {
    label: 'Previous',
    route: '/previous',
    imgUrl: '/icons/previous.svg',
  },
  {
    label: 'Recordings',
    route: '/recordings',
    imgUrl: '/icons/Video.svg',
  },
  {
    label: 'Personal Room',
    route: '/personal-room',
    imgUrl: '/icons/add-personal.svg',
  },
]

export const homeCards = [
  {
    img: '/icons/add-meeting.svg',
    title: 'New Meeting',
    description: 'Start an instant meeting',
    handle: HouseCardsHandlers.NewMeeting,
    className: 'bg-orange-1',
  },
  {
    img: '/icons/schedule.svg',
    title: 'Schedule Meeting',
    description: 'Plan your meeting',
    handle: HouseCardsHandlers.ScheduleMeeting,
    className: 'bg-blue-1',
  },
  {
    img: '/icons/recordings.svg',
    title: 'View Recordings',
    description: 'Check out your recordings',
    handle: HouseCardsHandlers.ViewRecordings,
    className: 'bg-purple-1',
  },
  {
    img: '/icons/join-meeting.svg',
    title: 'Join Meeting',
    description: 'via invitation link',
    handle: HouseCardsHandlers.JoinMeeting,
    className: 'bg-yellow-1',
  },
]
