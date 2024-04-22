'use client'

import { CallListType, MeetingCardIcons } from '@/shared/enums'
import { useGetCalls } from '@/shared/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard'
import Loader from './Loader'

interface PropsType {
  type: CallListType
}

const CallList = ({ type }: PropsType) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
  const router = useRouter()
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const getCalls = (): Call[] | CallRecording[] | undefined => {
    switch (type) {
      case CallListType.Ended:
        return endedCalls
      case CallListType.Recordings:
        return recordings
      case CallListType.Upcoming:
        return upcomingCalls
      default:
        return []
    }
  }

  const getNoCallsMessage = (): string => {
    switch (type) {
      case CallListType.Ended:
        return 'No Previous Calls'
      case CallListType.Recordings:
        return 'No Recordings'
      case CallListType.Upcoming:
        return 'No Upcoming Calls'
      default:
        return ''
    }
  }

  const setMeetingCardIcon = (): string => {
    switch (type) {
      case CallListType.Ended:
        return MeetingCardIcons.Ended
      case CallListType.Recordings:
        return MeetingCardIcons.Recordings
      case CallListType.Upcoming:
        return MeetingCardIcons.Upcoming
      default:
        return ''
    }
  }

  const setMeetingTitle = (meeting: Call | CallRecording): string => {
    if (meeting instanceof Call) {
      // Instead of substring add text truncation and a tooltip
      TODO: return meeting.state.custom.description.substring(0, 55)
    }

    return 'No description'
  }

  const setMeetingDate = (meeting: Call | CallRecording): string => {
    if (meeting instanceof Call && meeting.state.startsAt) {
      return meeting.state.startsAt.toLocaleString()
    }

    if ('start_time' in meeting) {
      return meeting.start_time.toLocaleString()
    }

    throw new Error('Cannot set meeting date')
  }

  const setMeetingLink = (meeting: Call | CallRecording): string => {
    if (type === CallListType.Recordings && 'url' in meeting) {
      return meeting.url
    }

    if (meeting instanceof Call) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
    }

    throw new Error('Cannot set meeting link')
  }

  const meetingCardHandler = (meeting: Call | CallRecording): (() => void) => {
    return () => {
      if (meeting instanceof Call) {
        router.push(`/meeting/${meeting.id}`)
      }

      if (type === CallListType.Recordings && 'url' in meeting) {
        router.push(`${meeting.url}`)
      }
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map(meeting => meeting.queryRecordings()) ?? []
      )

      const recordings = callData
        .filter(call => call.recordings.length > 0)
        .flatMap(call => call.recordings)

      setRecordings(recordings)
    }

    if (type === CallListType.Recordings) {
      fetchRecordings()
    }
  }, [type, callRecordings])

  const calls = getCalls()
  const noCallsMessage = getNoCallsMessage()

  if (isLoading) return <Loader />

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={meeting instanceof Call ? meeting.id : meeting.start_time}
            icon={setMeetingCardIcon()}
            title={setMeetingTitle(meeting)}
            date={setMeetingDate(meeting)}
            isPreviousMeeting={type === CallListType.Ended}
            buttonIcon={
              type === CallListType.Recordings ? '/icons/play.svg' : undefined
            }
            buttonText={type === CallListType.Recordings ? 'Play' : 'Start'}
            link={setMeetingLink(meeting)}
            handleClick={meetingCardHandler(meeting)}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  )
}

export default CallList
