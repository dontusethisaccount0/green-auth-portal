
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, User } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar">Profile Picture URL</Label>
                    <Input
                      id="avatar"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a URL for your profile picture
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Account Role</Label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm">
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact an administrator to change your role
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Account ID</Label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm font-mono">
                      {user.id}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your unique account identifier
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setFormData({
                      name: user.name,
                      email: user.email,
                      avatar: user.avatar || '',
                    })}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
