'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { HouseCardsHandlers, MeetingState } from '@/enums'
import { homeCards } from '@/constants'
import MeetingModal from './MeetingModal'
import HomeCard from './HomeCard'


const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<MeetingState | undefined>()
  const router = useRouter()

  const homeCardsHandlers = {
    [HouseCardsHandlers.NewMeeting]: () => setMeetingState(MeetingState.isInstantMeeting),
    [HouseCardsHandlers.ScheduleMeeting]: () => setMeetingState(MeetingState.isScheduleMeeting),
    [HouseCardsHandlers.ViewRecordings]: () => router.push('/recordings'),
    [HouseCardsHandlers.JoinMeeting]: () => setMeetingState(MeetingState.isJoiningMeeting)
  }

  const createMeeting = () => {}

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      {homeCards.map(card => (
        <HomeCard
          img={card.img}
          title={card.title}
          description={card.description}
          handleClick={homeCardsHandlers[card.handle]}
          className={card.className}
          key={card.title}
        />
      ))}

      <MeetingModal
        isOpen={meetingState === MeetingState.isInstantMeeting}
        onClose={() => setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList
