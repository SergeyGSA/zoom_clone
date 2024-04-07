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
