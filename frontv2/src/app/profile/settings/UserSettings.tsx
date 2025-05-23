import React, { useState } from 'react'; 
import TabNavigation from './TabNavigation'; 
import ProfileSettings from '@/components/settings/ProfileSettings'; 
import SavedItems from '@/components/settings/SavedItems'; 
import HelpCenter from '@/components/settings/HelpCenter'; 
import BlockedUsers from '@/components/settings/BlockedUsers'; 
import Likes from '@/components/settings/Likes'; 
 
const UserSettings: React.FC = () => { 
  const [activeTab, setActiveTab] = useState('profile'); 
 
  // Define all available tabs 
  const tabs = [  
    { id: 'profile', label: 'Perfil' }, 
    { id: 'likes', label: 'Me gusta' }, 
    { id: 'help', label: 'Ayuda' }, 
    { id: 'blocked', label: 'Bloqueados' }, 
  ]; 
 
  // Render the appropriate content base d on active tab
  const renderContent = () => { 
    switch (activeTab) { 
      case 'profile': 
        return <ProfileSettings />; 
      case 'likes': 
        return <Likes />; 
      case 'help': 
        return <HelpCenter />; 
      case 'blocked': 
        return <BlockedUsers />;  
      default: 
        return <ProfileSettings />;  
    } 
  }; 
 
  return ( 
    <div className="py-8"> 
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1> 
       
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm"> 
        <TabNavigation  
          tabs={tabs}  
          activeTab={activeTab}  
          setActiveTab={setActiveTab}  
        /> 
         
        <div className="flex-1 p-6"> 
          {renderContent()} 
        </div> 
      </div> 
    </div> 
  );    
}; 
 
export default UserSettings; 