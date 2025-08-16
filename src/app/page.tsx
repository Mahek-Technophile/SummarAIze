import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Bot, BrainCircuit, FileText } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">summarAIze</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard">Login <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Unlock Insights from Your Documents
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            summarAIze is an intelligent platform that helps you summarize text, optimize transcripts, and chat with your documents to find the answers you need, instantly.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
                <Link href="/dashboard">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 border rounded-lg bg-card">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">Summarize Text</h3>
                <p className="mt-2 text-muted-foreground">Generate concise, conversational summaries from long texts or transcripts.</p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg bg-card">
                <BrainCircuit className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">Optimize Content</h3>
                <p className="mt-2 text-muted-foreground">Extract actionable insights and bullet-point optimizations from your content.</p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg bg-card">
                <Bot className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">Document Assistant</h3>
                <p className="mt-2 text-muted-foreground">Chat with your documents and get instant answers to your questions.</p>
            </div>
        </div>
      </main>
      <footer className="p-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} summarAIze. All rights reserved.</p>
      </footer>
    </div>
  )
}
