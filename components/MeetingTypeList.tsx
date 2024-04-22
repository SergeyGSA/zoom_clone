'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/components/ui/use-toast'

import { HouseCardsHandlers, MeetingState } from '@/shared/enums'
import { homeCards } from '@/shared/constants'
import MeetingModal from './MeetingModal'
import HomeCard from './HomeCard'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<MeetingState | undefined>()
  const router = useRouter()
  const user = useUser()
  const client = useStreamVideoClient()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const { toast } = useToast()

  const homeCardsHandlers = {
    [HouseCardsHandlers.NewMeeting]: () =>
      setMeetingState(MeetingState.isInstantMeeting),
    [HouseCardsHandlers.ScheduleMeeting]: () =>
      setMeetingState(MeetingState.isScheduleMeeting),
    [HouseCardsHandlers.ViewRecordings]: () => router.push('/recordings'),
    [HouseCardsHandlers.JoinMeeting]: () =>
      setMeetingState(MeetingState.isJoiningMeeting),
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  const createMeeting = async () => {
    if (!client || !user) return

    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' })
        return
      }

      const id = crypto.randomUUID()
      const call = client.call('default', id)

      if (!call) throw new Error('Failed to create call')

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = values.description || 'Instant meeting'

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      })

      setCallDetails(call)

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({ title: 'Hooray! The Meeting has been created' })
    } catch (error) {
      console.log(error)
      toast({ title: 'Failed to create a meeting' })
    }
  }

  const copyMeetingLink = (): void => {
    navigator.clipboard.writeText(meetingLink)
    toast({ title: 'Link copied' })
  }

  const specifyDescriptionOfMeeting = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setValues({ ...values, description: e.target.value })
  }

  const selectCustomDate = (date: Date): void => {
    setValues({ ...values, dateTime: date })
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

      {callDetails ? (
        <MeetingModal
          isOpen={meetingState === MeetingState.isScheduleMeeting}
          onClose={() => setMeetingState(undefined)}
          title='Meeting Created'
          className='text-center'
          handleClick={copyMeetingLink}
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'
          buttonText='Copy Meeting Link'
        />
      ) : (
        <MeetingModal
          isOpen={meetingState === MeetingState.isScheduleMeeting}
          onClose={() => setMeetingState(undefined)}
          title='Create meeting'
          handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label
              className='text-base text-normal leading-[22px] text-sky-2'
              htmlFor='description'
            >
              Add a description
            </label>
            <Textarea
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={specifyDescriptionOfMeeting}
              id='description'
            />
          </div>
          <div className='flex w-full flex-col gap-2.5'>
            <label
              className='text-base text-normal leading-[22px] text-sky-2'
              htmlFor='date-picker'
            >
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={selectCustomDate}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              className='w-full rounded bg-dark-3 p-2 focus:outline-none'
              id='date-picker'
            />
          </div>
        </MeetingModal>
      )}

      <MeetingModal
        isOpen={meetingState === MeetingState.isInstantMeeting}
        onClose={() => setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === MeetingState.isJoiningMeeting}
        onClose={() => setMeetingState(undefined)}
        title='Type the link here'
        className='text-center'
        buttonText='Join Meeting'
        handleClick={() => router.push(values.link)}
      >
        <Input 
          placeholder='Meeting link'
          className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
