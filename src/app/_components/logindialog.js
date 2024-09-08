import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginDialog({ onLogin, isDialogOpen, setDialogOpen }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, url } = e.target.elements;
    console.log(username.value);
    onLogin(username.value, password.value, url.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account.
            </DialogDescription>
          </DialogHeader>
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
                  placeholder="http://your.url:port"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Log In</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
