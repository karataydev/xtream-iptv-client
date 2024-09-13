import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function LoginCard({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, url } = e.target.elements;
    onLogin(username.value, password.value, url.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to IPTV Client</h1>
        <p className="text-xl">
          Browse your Xtream Code playlist, select channels, and copy URLs to
          play in your favorite media player.
        </p>
      </div>
      <Card className="w-full max-w-[425px] bg-background text-foreground">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Enter your Xtream Code credentials to access your playlist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input id="password" type="password" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  className="col-span-3"
                  placeholder="http://your.xtream.code.url:port"
                />
              </div>
            </div>
            <CardFooter className="flex justify-end">
              <Button type="submit">Access Playlist</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
