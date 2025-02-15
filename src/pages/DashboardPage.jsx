import React, { useState } from 'react';
import { Users, CalendarCheck, UserCheck } from 'lucide-react';
import VisitorForm from '../components/visitors/VisitorForm';
import VisitorList from '../components/visitors/VisitorList';
import PreApprovalForm from '../components/visitors/PreApprovalForm';
import useStore from '../store/useStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('register');
  const user = useStore((state) => state.user);
  const addVisitor = useStore((state) => state.addVisitor);
  const getVisitorsForHost = useStore((state) => state.getVisitorsForHost);

  const handleVisitorSubmit = (data) => {
    addVisitor(data);
    setActiveTab('list');
  };

  // get visitors for the current user or host
  const visibleVisitors = getVisitorsForHost(user);

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="register">
            <UserCheck className="mr-2 h-4 w-4" />
            Register Visitor
          </TabsTrigger>
          <TabsTrigger value="list">
            <Users className="mr-2 h-4 w-4" />
            Visitor List
          </TabsTrigger>
          <TabsTrigger value="pre-approve">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Pre-approve Visit
          </TabsTrigger>
        </TabsList>
        {/* register section */}
        <TabsContent value="register">
          <div className="">
            <VisitorForm onSubmit={handleVisitorSubmit} />
          </div>
        </TabsContent>
        {/* list section */}
        <TabsContent value="list">
          <VisitorList visitors={visibleVisitors} />
        </TabsContent>
        {/* pre-approve section */}
        <TabsContent value="pre-approve">
          <div className="max-w-lg mx-auto">
            <PreApprovalForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
