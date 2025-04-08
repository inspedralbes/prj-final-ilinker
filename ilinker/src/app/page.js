"use client"

import {useContext, useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  BookmarkIcon,
  BuildingIcon,
  MapPinIcon,
  ClockIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  ShareIcon,
  BookmarkPlusIcon,
  PlusCircleIcon,
  Users2Icon,
  CalendarDaysIcon
} from "lucide-react"
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import {AuthContext} from "@/contexts/AuthContext";

// Mock data for internships
const mockInternships = [
  {
    id: 1,
    company: "Tech Solutions Inc",
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop",
    position: "Frontend Developer Intern",
    location: "New York, NY",
    type: "Full-time",
    posted: "2 days ago",
    description: "We're looking for a passionate frontend developer intern to join our team. You'll work on real projects using React, Next.js, and modern web technologies.",
    skills: ["React", "JavaScript", "HTML", "CSS"]
  },
  {
    id: 2,
    company: "Digital Innovations",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop",
    position: "UX Design Intern",
    location: "Remote",
    type: "Part-time",
    posted: "1 day ago",
    description: "Join our design team and help create beautiful user experiences. You'll work on various projects from concept to implementation.",
    skills: ["Figma", "UI/UX", "Prototyping"]
  },
  // Add more mock internships as needed
]

export default function Home() {
 

  const [searchTerm, setSearchTerm] = useState("")
  // console.log(Cookies.get('authToken'))
  // console.log(Cookies.get('userData'))
  return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <Card className="h-fit hidden md:block">
            {/* Profile Header with Background */}
            <div className="h-20 bg-slate-200 rounded-t-lg"></div>

            {/* Profile Info */}
            <div className="px-4 pb-4">
              {/* Profile Picture */}
              <div className="relative -mt-12 mb-3">
                <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white"></div>
              </div>

              {/* Name and Title */}
              <h1 className="text-xl font-semibold">Deray Burga Cachiguango</h1>
              <p className="text-sm mb-4">Estudiante en Institut Pedralbes</p>

              {/* Contacts Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm ">Contactos</span>
                  <button className="text-sm font-semibold">
                    Amplía tu red
                  </button>
                </div>
              </div>

              {/* Premium Button */}
              <button className="flex items-center gap-2 w-full justify-center py-2 px-4 border border-gray-300 rounded-full text-sm font-medium mb-3">
                <PlusCircleIcon className="w-4 h-4" />
                Probar Premium por 0 €
              </button>

              {/* Navigation Items */}
              <nav className="space-y-2">
                <button className="flex items-center gap-2 w-full py-2 text-sm">
                  <BookmarkIcon className="w-4 h-4" />
                  Elementos guardados
                </button>
                <button className="flex items-center gap-2 w-full py-2 text-sm">
                  <Users2Icon className="w-4 h-4" />
                  Grupos
                </button>
                <button className="flex items-center gap-2 w-full py-2 text-sm">
                  <CalendarDaysIcon className="w-4 h-4" />
                  Eventos
                </button>
              </nav>

              {/* Ver más Button */}
              <button className="w-full text-center py-3 text-sm">
                Ver más
              </button>
            </div>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            <Card className="p-4">
              <Input
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
              />
            </Card>

            {mockInternships.map((internship) => (
                <Card key={internship.id} className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <img src={internship.logo} alt={internship.company} />
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{internship.position}</h3>
                      <p className="text-muted-foreground">{internship.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {internship.location}
                    </span>
                        <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                          {internship.type}
                    </span>
                        <span className="flex items-center">
                      <BuildingIcon className="h-4 w-4 mr-1" />
                          {internship.posted}
                    </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm">{internship.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                        >
                    {skill}
                  </span>
                    ))}
                  </div>

                  <hr />

                  <div className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      <ThumbsUpIcon className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircleIcon className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BookmarkPlusIcon className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </Card>
            ))}
          </div>

          {/* Right Sidebar */}
          <Card className="p-6 h-fit hidden md:block">
            <div className="space-y-4">
              <h3 className="font-semibold">Recommended for you</h3>
              <div className="space-y-4">
                {mockInternships.slice(0, 3).map((internship) => (
                    <div key={internship.id} className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <img src={internship.logo} alt={internship.company} />
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{internship.position}</p>
                        <p className="text-muted-foreground">{internship.company}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
  )
}
