export enum MeetingState {
  isScheduleMeeting = 'isScheduleMeeting',
  isJoiningMeeting = 'isJoiningMeeting',
  isInstantMeeting = 'isInstantMeeting',
}

export enum HouseCardsHandlers {
  NewMeeting = 'newMeeting',
  ScheduleMeeting = 'scheduleMeeting',
  ViewRecordings = 'viewRecordings',
  JoinMeeting = 'joinMeeting',
}

//TODO: Need to refactor this enum below
export enum CallLayoutType {
  Grid = 'grid',
  SpeakerLeft = 'speaker-left',
  SpeakerRight = 'speaker-right',
}

export enum CallListType {
  Upcoming = 'upcoming',
  Recordings = 'recordings',
  Ended = 'ended',
}

export enum MeetingCardIcons {
  Ended = '/icons/previous.svg',
  Upcoming = '/icons/upcoming.svg',
  Recordings = '/icons/recordings.svg',
}
