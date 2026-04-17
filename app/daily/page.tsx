import { getOrCreateDailyLog, getDailyLogs } from '@/src/lib/FileScanner'
import { notFound } from 'next/navigation'
import DailyLogEditor from '@/components/DailyLogEditor'
import DailyLogTimeline from '@/components/DailyLogTimeline'
import { CalendarDays } from 'lucide-react'

export default async function DailyPage() {
  // 获取今日日志（自动创建如果不存在）
  const { doc: todayLog } = await getOrCreateDailyLog()
  
  // 获取所有日志（按日期倒序）
  const logs = await getDailyLogs()
  
  // 按日期排序（新的在前）
  logs.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-8 h-8 text-accent" />
        <h1 className="text-3xl font-bold">每日日志</h1>
      </div>

      {/* 今日笔记 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-accent">📍</span>
          今日笔记
        </h2>
        <DailyLogEditor 
          initialSlug={todayLog.slug}
          initialContent={todayLog.content}
          initialTitle={todayLog.meta.title}
        />
      </section>

      {/* 历史日志时间线 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-accent">📚</span>
          历史日志
        </h2>
        <DailyLogTimeline logs={logs.filter(log => log.slug !== todayLog.slug)} />
      </section>
    </div>
  )
}
