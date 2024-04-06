'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import HomeCard from './HomeCard'
import { HouseCardsHandlers, MeetingState } from '@/enums'
import { homeCards } from '@/constants'


const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<MeetingState | undefined>()
  const router = useRouter()

  const homeCardsHandlers = {
    [HouseCardsHandlers.NewMeeting]: () => setMeetingState(MeetingState.isInstantMeeting),
    [HouseCardsHandlers.ScheduleMeeting]: () => setMeetingState(MeetingState.isScheduleMeeting),
    [HouseCardsHandlers.ViewRecordings]: () => router.push('/recordings'),
    [HouseCardsHandlers.JoinMeeting]: () => setMeetingState(MeetingState.isJoiningMeeting)
  }

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
    </section>
  )
}

export default MeetingTypeList
