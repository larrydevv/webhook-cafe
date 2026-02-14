import { DiscordLoginButton } from '@/components/auth/DiscordLoginButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Webhook.cafe</CardTitle>
          <CardDescription>
            Sign in with Discord to get started
          </CardDescription>
        </CardHeader>
          <CardContent className="space-y-4">
            <DiscordLoginButton />
            
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
