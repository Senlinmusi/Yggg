'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

// 这里引用你改名后的文件
const MX1 = dynamic(() => import('./MX1'), {
  ssr: false,
  loading: () => <div className="text-white">加载中...</div>
})

export default function YX1() {
  useEffect(() => {
    document.title = '1'
  }, [])

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <div className="w-[360px] h-[640px] bg-white">
        <MX1 />
      </div>
    </div>
  )
}

