'use client'

import { useState } from 'react'
import { LayoutList, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import { cn } from '@/lib/utils'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { CallLayoutType } from '@/shared/enums'
import EndCallButton from '@/components/EndCallButton'
import Loader from './Loader'

const MeetingRoom = () => {
  const searchParams = useSearchParams()
  const isPersonalRoom = !!searchParams.get('personal')
  const [layout, setLayout] = useState<CallLayoutType>(
    CallLayoutType.SpeakerLeft
  )
  const [showParticipants, setShowParticipants] = useState(false)
  const router = useRouter()

  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()

  if (callingState !== CallingState.JOINED) return <Loader />

  const CallLayout = () => {
    switch (layout) {
      case CallLayoutType.Grid:
        return <PaginatedGridLayout />
      case CallLayoutType.SpeakerRight:
        return <SpeakerLayout participantsBarPosition='left' />
      case CallLayoutType.SpeakerLeft:
        return <SpeakerLayout participantsBarPosition='right' />
      default:
        return <SpeakerLayout participantsBarPosition='left' />
    }
  }

  const makeAppearanceBetter = (type: string): string => {
    const typeWithoutDashes = type.replace(/-/g, " ").split(' ')
    // Make each word's first letter capitalize
    return typeWithoutDashes.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const handleShowParticipants = () => {
    setShowParticipants((prev) => !prev)
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full justify-center items-center'>
        <div className='flex size-full items-center justify-center'>
          <div className='flex size-full max-w-[1000px] items-center'>
            <CallLayout />
          </div>
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
        <CallControls onLeave={() => router.push('/')} />

        <DropdownMenu>
          <div className='flex items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <LayoutList size={20} className='text-white' />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
            {[
              CallLayoutType.Grid,
              CallLayoutType.SpeakerLeft,
              CallLayoutType.SpeakerRight,
            ].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className='cursor-pointer'
                  //TODO: Need to refactor this func below, using it without type assertion
                  onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                >
                  {makeAppearanceBetter(item)}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='border-dark-1 bg-dark-1' />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={handleShowParticipants}>
          <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
            <Users size={20} className='text-white' />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom
