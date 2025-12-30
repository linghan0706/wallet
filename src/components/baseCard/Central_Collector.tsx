import Image from 'next/image'
export default function CentralCollector() {
  return (
    <div className="relative w-[363px] h-[400px] flex items-center justify-center mt-10">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/base/central_collector/background.png"
          alt="Central Collector Background"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        Central Collector
      </div>
    </div>
  )
}
