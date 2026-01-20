import { useState } from "react";
import Notifications from "./Notification";
import UserManagement from "./UserManagement";
import InfluencerManagement from "./InfluencerManagement";
import InviteUser from "./InviteUser";
import TokenDetails from "./TokenDetails";
import Navbar from "./Navbar";

function Panel() {
  const [activeTab, setActiveTab] = useState('Notifications');

  const renderContent = () => {
    switch (activeTab) {
      case 'Notifications':
        return <Notifications />;
      case 'User Management':
        return <UserManagement />;
      case 'Influencer Management':
        return <InfluencerManagement />;
      case 'Invite User':
        return <InviteUser />;
      case 'Token Details':
        return <TokenDetails />;
      default:
        return <Notifications />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="py-8 px-4">
        {renderContent()}
      </main>
    </div>
  );
}

export default Panel;