
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Calendar, Clock, Monitor, MapPin, Shield, LogOut } from 'lucide-react';

const UserDetails = () => {
  const { userId } = useParams();
  const { getUserById, getUserSessions, updateUserRole, logoutSession } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      const [userData, sessionsData] = await Promise.all([
        getUserById(userId!),
        getUserSessions(userId!)
      ]);
      setUser(userData);
      setSessions(sessionsData);
    } catch (error) {
      toast({
        title: "Failed to load user data",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId!, newRole);
      setUser({ ...user, role: newRole });
      toast({
        title: "Role updated",
        description: `User role has been changed to ${newRole}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update role",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await logoutSession(sessionId);
      toast({
        title: "Session terminated",
        description: "The user session has been logged out.",
      });
      loadUserData(); // Refresh the data
    } catch (error) {
      toast({
        title: "Failed to logout session",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
              <p className="text-muted-foreground mb-4">The requested user could not be found.</p>
              <Button asChild>
                <Link to="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">User Details</h1>
          <p className="text-muted-foreground">Detailed information and session management for {user.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select value={user.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account ID</label>
                    <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{user.id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Joined</p>
                      <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  {user.lastLogin && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Active Sessions ({sessions.length})
                </CardTitle>
                <CardDescription>
                  Monitor and manage user sessions across all devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Monitor className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{session.deviceInfo}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {session.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatLastActive(session.lastActive)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.current && (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                Current
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLogoutSession(session.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              Logout
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                          <div>
                            <span className="font-medium text-muted-foreground">IP Address:</span>
                            <span className="ml-2 font-mono">{session.ipAddress}</span>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Last Active:</span>
                            <span className="ml-2">{new Date(session.lastActive).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                    <p className="text-muted-foreground">
                      This user doesn't have any active sessions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
