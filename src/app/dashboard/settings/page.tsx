"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es" disabled>
                  Español (coming soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {session?.user && (
                <>
                    <div className="flex items-center justify-between">
                        <Label>Name</Label>
                        <p className="text-sm text-muted-foreground">{session.user.name}</p>
                    </div>
                     <div className="flex items-center justify-between">
                        <Label>Email</Label>
                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                    </div>
                </>
            )}
           <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
