
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Monitor, Smartphone, Laptop, LogOut, MapPin, Clock } from 'lucide-react';

const Sessions = () => {
  const { getSessions, logoutSession } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      toast({
        title: "Failed to load sessions",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await logoutSession(sessionId);
      toast({
        title: "Session terminated",
        description: "The session has been successfully logged out.",
      });
      loadSessions(); // Refresh the list
    } catch (error) {
      toast({
        title: "Failed to logout session",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (deviceInfo: string) => {
    if (deviceInfo.toLowerCase().includes('iphone') || deviceInfo.toLowerCase().includes('android')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (deviceInfo.toLowerCase().includes('ipad') || deviceInfo.toLowerCase().includes('tablet')) {
      return <Monitor className="h-4 w-4" />;
    }
    return <Laptop className="h-4 w-4" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Active Sessions</h1>
          <p className="text-muted-foreground">Monitor and manage your active sessions across all devices.</p>
        </div>

        <div className="grid gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className={`border-0 shadow-lg ${session.current ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {getDeviceIcon(session.deviceInfo)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{session.deviceInfo}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatLastActive(session.lastActive)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.current && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Current Session
                      </Badge>
                    )}
                    {!session.current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogoutSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">IP Address</p>
                    <p className="font-mono">{session.ipAddress}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Location</p>
                    <p>{session.location}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Last Active</p>
                    <p>{new Date(session.lastActive).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sessions.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
              <p className="text-muted-foreground">
                You don't have any active sessions at the moment.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg mt-6 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 text-sm">
              If you notice any suspicious activity or unrecognized sessions, sign them out immediately and consider changing your password.
              Always keep your account secure by logging out from public or shared devices.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sessions;
