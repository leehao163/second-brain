import { FileList } from '@/components/FileList'
import { SearchBar } from '@/components/SearchBar'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-4">文档列表</h1>
              <ThemeToggle />
            </div>
            <SearchBar />
            <FileList />
          </div>
        </main>
      </div>
    </div>
  )
}
