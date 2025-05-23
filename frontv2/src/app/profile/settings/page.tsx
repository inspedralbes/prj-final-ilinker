"use client"; 
 
import React, { useContext } from "react"; 
import { useParams } from "next/navigation"; 
import UserSettings from "./UserSettings"; 
import { useEffect } from "react"; 
import { apiRequest } from "@/services/requests/apiRequest"; 
import { AuthContext } from "@/contexts/AuthContext"; 
import { useRouter } from "next/navigation"; 
import { LoaderContext } from "@/contexts/LoaderContext"; 
export default function CompanyPage() { 
  const { slug } = useParams<{ slug: string }>(); 
 
  const router = useRouter(); 
  const { showLoader, hideLoader } = useContext(LoaderContext); 
  const { userData } = useContext(AuthContext); 
 
  useEffect(() => { 
      showLoader(); 
      if (!userData) { 
        router.push("/auth/login"); 
      } 
   
      // Request for messages 
    }, [userData, router]);  
  return ( 
    <div className="min-h-screen bg-gray-50"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
        <UserSettings /> 
      </div> 
    </div> 
  ); 
} 
