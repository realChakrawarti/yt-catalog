"use client"

import { Clock, Filter, Info, Link, Maximize2, MoreVertical, PlayCircle, Star, X } from 'lucide-react'
import Image from "next/image"
import { useState } from "react"

import { toast } from '~/hooks/use-toast'

import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar"
import { Badge } from "./shadcn/badge"
import { Button } from "./shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./shadcn/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./shadcn/popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./shadcn/sheet"

export function VideoInterface() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [openDescriptions, setOpenDescriptions] = useState<number[]>([])
  const [fullDescriptionId, setFullDescriptionId] = useState<number | null>(null)

  const tags = ["ThePrimeTime", "Jack Herrington", "The Code Creative"]
  const videos = [
    {
      id: 1,
      title: "OpenAI's Next Model Isn't Better...",
      creator: "ThePrimeTime",
      timeAgo: "2 days ago",
      thumbnail: "/placeholder.svg",
      avatar: "/placeholder.svg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: 2,
      title: "Creator of Node talks Deno 2.0 and the Future of JS",
      creator: "ThePrimeTime",
      timeAgo: "3 days ago",
      thumbnail: "/placeholder.svg",
      avatar: "/placeholder.svg",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      id: 3,
      title: "Tanstack Start vs NextJS - Server Functions Battle",
      creator: "Jack Herrington",
      timeAgo: "4 days ago",
      thumbnail: "/placeholder.svg",
      avatar: "/placeholder.svg",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    },
  ]

  const selectTag = (tag: string) => {
    setSelectedTag(prev => prev === tag ? null : tag)
  }

  const clearTag = () => setSelectedTag(null)

  const filteredVideos = selectedTag
    ? videos.filter(video => video.creator === selectedTag)
    : videos

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "The catalog has been removed from your favorites."
        : "The catalog has been added to your favorites.",
    })
  }

  const copyLink = (id: number) => {
    navigator.clipboard.writeText(`https://example.com/video/${id}`)
    toast({
      title: "Link copied",
      description: "The video link has been copied to your clipboard.",
    })
  }

  const toggleDescription = (id: number) => {
    setOpenDescriptions(prev =>
      prev.includes(id) ? prev.filter(openId => openId !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Title - nKlZcO</h1>
              <p className="text-base sm:text-lg text-muted-foreground">Description - nKlZcO</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavorite}
                aria-label={isFavorite ? "Remove catalog from favorites" : "Add catalog to favorites"}
              >
                <Star className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Clock className="h-4 w-4 mr-2" />
                    Next update
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <p>Next update: 3 hours 46 minutes later</p>
                </PopoverContent>
              </Popover>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-9 px-4 lg:px-6">
                    <Filter className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Filter Channel</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[280px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filter Channels</SheetTitle>
                    <SheetDescription>
                      Select a channel to filter the content
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {selectedTag && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearTag}
                        className="w-full justify-start"
                      >
                        Clear filter
                      </Button>
                    )}
                    <div className="flex flex-col space-y-2">
                      {tags.map(tag => (
                        <Button
                          key={tag}
                          variant={selectedTag === tag ? "default" : "outline"}
                          size="sm"
                          onClick={() => selectTag(tag)}
                          className="justify-start"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <section>
          <h2 className="mb-6 text-xl sm:text-2xl font-semibold tracking-tight">This week</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-xl border bg-card transition-colors hover:bg-accent"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 h-8 w-8 bg-black/50 hover:bg-black/70"
                    onClick={() => toggleDescription(video.id)}
                  >
                    <Info className="h-4 w-4 text-white" />
                  </Button>
                  {openDescriptions.includes(video.id) && (
                    <div className="absolute inset-0 bg-black/80 p-4 text-white overflow-y-auto transition-transform duration-300 ease-in-out translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 hover:bg-white/20"
                        onClick={() => toggleDescription(video.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <h4 className="font-semibold mb-2">{video.title}</h4>
                      <p className="text-sm">{video.description}</p>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-2 right-2 h-8 w-8 hover:bg-white/20"
                            onClick={() => setFullDescriptionId(video.id)}
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{video.title}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-4">
                            <p>{video.description}</p>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={video.avatar} alt={video.creator} />
                      <AvatarFallback>{video.creator[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold leading-tight">{video.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{video.creator}</span>
                        <span>•</span>
                        <span>{video.timeAgo}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyLink(video.id)}>
                          <Link className="h-4 w-4 mr-2" />
                          Copy link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}