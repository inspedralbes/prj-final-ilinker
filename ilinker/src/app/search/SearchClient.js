'use client'

import {useContext, useEffect, useState} from 'react';
import {
    Search,
    MapPin,
    Briefcase,
    Filter,
    ChevronDown,
    Building2,
    Clock,
    BookmarkPlus,
    Globe,
    Users,
    Banknote,
    GraduationCap,
    X
} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import SearchHeader from "@/components/searchHeader";
import {AuthContext} from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation'

export default function SearchClient({latestOffers}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedJob, setSelectedJob] = useState(latestOffers ? latestOffers[0] : null);
    const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
    const [selectedInfoJob, setSelectedInfoJob] = useState(null);
    const {loggedIn, userData} = useContext(AuthContext);
    const router = useRouter()

    const handleApplyOffer = () => {
        console.log("apply offer")
    }

    const handleRedirectLogin = ()=>{
        router.push('/login');
    }
    const JobDetails = () => {
        return selectedInfoJob !== null ? (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedInfoJob.title}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Building2 className="h-4 w-4"/>
                        <span>{selectedInfoJob.company.name}</span>
                        <MapPin className="h-4 w-4 ml-2"/>
                        <span>{selectedInfoJob.address}</span>
                    </div>
                    <div className="flex gap-4">
                        <Button className="flex-1" onClick={loggedIn ? handleApplyOffer:handleRedirectLogin}>Apply now</Button>
                        <Button variant="outline" size="icon">
                            <BookmarkPlus className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>

                <Separator/>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground"/>
                        <span>Remote available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground"/>
                        <span>501-1,000 employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Banknote className="h-4 w-4 text-muted-foreground"/>
                        <span>$130K - $180K</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground"/>
                        <span>Bachelor's degree</span>
                    </div>
                </div>

                <Separator/>

                <div className="space-y-4">
                    {/*<h3 className="text-lg font-semibold">About the job</h3>*/}
                    {/*<p className="text-muted-foreground">*/}
                    {/*    We are seeking a talented Senior Software Engineer to join our dynamic team. In this role, you*/}
                    {/*    will*/}
                    {/*    be responsible for developing and maintaining our core products while collaborating with*/}
                    {/*    cross-functional teams to deliver high-quality solutions.*/}
                    {/*</p>*/}

                    {/*<h4 className="font-semibold mt-4">Responsibilities:</h4>*/}
                    {/*<ul className="list-disc pl-5 text-muted-foreground space-y-2">*/}
                    {/*    <li>Design and implement new features for our platform</li>*/}
                    {/*    <li>Write clean, maintainable, and efficient code</li>*/}
                    {/*    <li>Collaborate with product managers and designers</li>*/}
                    {/*    <li>Mentor junior developers and conduct code reviews</li>*/}
                    {/*    <li>Participate in technical architecture discussions</li>*/}
                    {/*</ul>*/}

                    {/*<h4 className="font-semibold mt-4">Requirements:</h4>*/}
                    {/*<ul className="list-disc pl-5 text-muted-foreground space-y-2">*/}
                    {/*    <li>5+ years of professional software development experience</li>*/}
                    {/*    <li>Strong proficiency in JavaScript/TypeScript and React</li>*/}
                    {/*    <li>Experience with modern frontend frameworks and tools</li>*/}
                    {/*    <li>Excellent problem-solving and communication skills</li>*/}
                    {/*    <li>Bachelor's degree in Computer Science or related field</li>*/}
                    {/*</ul>*/}

                    <div dangerouslySetInnerHTML={{__html: selectedInfoJob.description}}/>
                </div>

                <Separator/>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">About {selectedInfoJob.company.name}</h3>
                    <p className="text-muted-foreground">
                        {selectedInfoJob.company.short_description}
                    </p>
                </div>
            </div>
        ) : null
    }

    useEffect(()=>{
        setSelectedInfoJob(selectedJob)
    }, [selectedJob]);

    return (

        <div className="">
            {/*<SearchHeader />*/}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-2 mt-8 max-w-7xl">
                {/* Search Section */}
                <div className="flex flex-wrap items-center gap-4 mb-8 hidden">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search jobs, keywords, companies"
                            className="pl-9 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1 min-w-[200px]">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="City, state, or zip code"
                            className="pl-9 w-full"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4"/>
                                Date Posted
                                <ChevronDown className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Past 24 hours</DropdownMenuItem>
                            <DropdownMenuItem>Past week</DropdownMenuItem>
                            <DropdownMenuItem>Past month</DropdownMenuItem>
                            <DropdownMenuItem>Any time</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4"/>
                                Experience Level
                                <ChevronDown className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Internship</DropdownMenuItem>
                            <DropdownMenuItem>Entry level</DropdownMenuItem>
                            <DropdownMenuItem>Mid-Senior level</DropdownMenuItem>
                            <DropdownMenuItem>Director</DropdownMenuItem>
                            <DropdownMenuItem>Executive</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Search
                    </Button>
                </div>

                {/* Split View Layout */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-6">
                    {/* Job Listings */}
                    <ScrollArea className="h-[calc(100vh-170px)]">
                        <div className="pr-4 relative">
                            {/* Siempre mostramos los 3 primeros */}
                            <div className="space-y-4">
                                {latestOffers.slice(0, 3).map((job) => (
                                    <Card
                                        key={job.id}
                                        className={`p-6 hover:border-primary/50 transition-colors cursor-pointer ${selectedJob === job ? 'border-primary' : ''}`}
                                        onClick={() => {
                                            setSelectedJob(job);
                                            if (window.innerWidth < 768) {
                                                setIsJobDetailOpen(true);
                                            }
                                        }}
                                    >
                                        {/* Contenido del card */}
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Building2 className="h-4 w-4"/>
                                                        <span>{job.company.name}</span>
                                                        <MapPin className="h-4 w-4 ml-2"/>
                                                        <span>{job.address}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary">Full-time</Badge>
                                                    <Badge variant="secondary">Remote</Badge>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <BookmarkPlus className="h-5 w-5"/>
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4"/>
                                            <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                                            <Separator orientation="vertical" className="h-4"/>
                                            <span>84 applicants</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Si NO está logeado y hay más de 3 ofertas, agregamos el overlay */}
                            {!loggedIn && latestOffers.length > 3 && (
                                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none flex justify-center items-center">
                                    <span className="text-white font-medium">Inicia sesión para ver más</span>
                                </div>
                            )}

                            {/* Si el usuario está logeado, mostramos el resto de las ofertas */}
                            {loggedIn && latestOffers.slice(3).map((job) => (
                                <Card
                                    key={job.id}
                                    className={`p-6 hover:border-primary/50 transition-colors cursor-pointer ${selectedJob === job ? 'border-primary' : ''}`}
                                    onClick={() => {
                                        setSelectedJob(job);
                                        if (window.innerWidth < 768) {
                                            setIsJobDetailOpen(true);
                                        }
                                    }}
                                >
                                    {/* Contenido del card */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Building2 className="h-4 w-4"/>
                                                    <span>{job.company.name}</span>
                                                    <MapPin className="h-4 w-4 ml-2"/>
                                                    <span>{job.address}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary">Full-time</Badge>
                                                <Badge variant="secondary">Remote</Badge>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <BookmarkPlus className="h-5 w-5"/>
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4"/>
                                        <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                                        <Separator orientation="vertical" className="h-4"/>
                                        <span>84 applicants</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Job Details - Desktop */}
                    <div className="hidden md:block">
                        <Card className="">
                            <ScrollArea className="h-[calc(100vh-170px)] p-8">
                                <JobDetails/>
                            </ScrollArea>
                        </Card>
                    </div>

                    {/* Job Details - Mobile */}
                    <Sheet open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
                        <SheetContent side="bottom" className="h-[100vh] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="flex justify-between items-center">
                                    Job Details
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsJobDetailOpen(false)}
                                    >
                                        {/*<X className="h-4 w-4"/>*/}
                                    </Button>
                                </SheetTitle>
                            </SheetHeader>
                            <JobDetails/>
                        </SheetContent>
                    </Sheet>
                </div>
            </main>
        </div>
    );
}