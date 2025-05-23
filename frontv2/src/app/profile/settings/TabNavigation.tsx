import React from 'react'; 
import {  
  User,  
  Bookmark,    
  HelpCircle,  
  ShieldX, 
  Heart 
} from 'lucide-react';  
 
interface Tab { 
  id: string; 
  label: string; 
} 
  
interface TabNavigationProps { 
  tabs: Tab[]; 
  activeTab: string; 
  setActiveTab: (id: string) => void;  
} 
 
const TabNavigation: React.FC<TabNavigationProps> = ({  
  tabs,  
  activeTab,  
  setActiveTab  
}) => { 
  const getIcon = (id: string) => { 
    switch (id) { 
      case 'profile': 
        return <User className="h-5 w-5" />; 
      case 'likes': 
        return <Heart className="h-5 w-5" />; 
      case 'help': 
        return <HelpCircle className="h-5 w-5" />; 
      case 'blocked': 
        return <ShieldX className="h-5 w-5" />; 
      default: 
        return null; 
    } 
  }; 
 
  return ( 
    <> 
      {/* Mobile tabs (horizontal) */} 
      <div className="md:hidden w-full overflow-x-auto scrollbar-hide"> 
        <div className="flex border-b border-gray-200 w-full"> 
          {tabs.map((tab) => ( 
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}   
              className={`flex items-center space-x-2 py-3 px-4 whitespace-nowrap transition-colors duration-200 ${ 
                activeTab === tab.id 
                  ? 'text-black border-b-2 border-black font-medium' 
                  : 'text-gray-600 hover:text-gray-900' 
              }`} 
            > 
              {getIcon(tab.id)} 
              <span>{tab.label}</span> 
            </button> 
          ))} 
        </div>  
      </div> 
 
      {/* Desktop tabs (vertical) */} 
      <div className="hidden md:block w-64 border-r border-gray-200"> 
        <nav className="py-4"> 
          {tabs.map((tab) => ( 
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center w-full space-x-3 px-6 py-3 text-left transition-colors duration-200 ${ 
                activeTab === tab.id 
                  ? 'bg-gray-100 text-black border-l-4 border-black font-medium'  
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' 
              }`} 
            > 
              {getIcon(tab.id)} 
              <span>{tab.label}</span> 
            </button> 
          ))} 
        </nav> 
      </div> 
    </> 
  ); 
}; 
 
export default TabNavigation 