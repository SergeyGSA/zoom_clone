import CallList from '@/components/CallList'
import { CallListType } from '@/shared/enums'
import React from 'react'

const Recordings = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Recordings
      </h1>

      <CallList type={CallListType.Recordings} />
    </section>
  )
}

export default Recordings