'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"

import { HouseCardsHandlers, MeetingState } from '@/shared/enums'
import { homeCards } from '@/shared/constants'
import MeetingModal from './MeetingModal'
import HomeCard from './HomeCard'


const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<MeetingState | undefined>()
  const router = useRouter()
  const user = useUser()
  const client = useStreamVideoClient()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const { toast } = useToast()

  const homeCardsHandlers = {
    [HouseCardsHandlers.NewMeeting]: () => setMeetingState(MeetingState.isInstantMeeting),
    [HouseCardsHandlers.ScheduleMeeting]: () => setMeetingState(MeetingState.isScheduleMeeting),
    [HouseCardsHandlers.ViewRecordings]: () => router.push('/recordings'),
    [HouseCardsHandlers.JoinMeeting]: () => setMeetingState(MeetingState.isJoiningMeeting)
  }

  const createMeeting = async() => {
    if (!client || !user) return

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" })
        return
      }

      const id = crypto.randomUUID()
      const call = client.call('default', id)

      if (!call) throw new Error('Failed to create call')
      
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = values.description || 'Instant meeting'

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })

      setCallDetails(call)

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({ title: "Hooray! The Meeting has been created" })
    } catch (error) {
      console.log(error)
      toast({ title: "Failed to create a meeting" })
    }
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
