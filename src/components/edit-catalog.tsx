"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "./shadcn/badge";
import { Button } from "./shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/dialog";
import { Input } from "./shadcn/input";
import { Label } from "./shadcn/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./shadcn/table";

export function EditCatalogComponent() {
  const [title, setTitle] = useState("nKIZcO");
  const [description, setDescription] = useState("nKIZcO");
  const [videoUrl, setVideoUrl] = useState("");
  const [savedChannels, setSavedChannels] = useState([
    {
      id: "UC6vRUjYqDuoUsYsku86Lrsw",
      title: "Jack Herrington",
      topics: "Knowledge, Technology, Lifestyle",
      handle: "@jherr",
    },
    {
      id: "UCUyeluBRhGPCW4rPe_UvBZQ",
      title: "ThePrimeTime",
      topics: "Lifestyle, Technology",
      handle: "@theprimetimeagen",
    },
    {
      id: "UCmOpHGj4JRWCdXhIlVTZCVw",
      title: "The Code Creative",
      topics: "Technology, Knowledge, Lifestyle",
      handle: "@thecodecreative",
    },
  ]);
  const [unsavedChannels, setUnsavedChannels] = useState([
    {
      id: "UCCymWVaTozpEng_ep0mdUyw",
      title: "LambdaTest",
      topics: "N/A",
      handle: "N/A",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Submitted:", { title, description, savedChannels });
  };

  const handleValidate = () => {
    // Handle video URL validation
    console.log("Validating:", videoUrl);
  };

  const removeSavedChannel = (id: string) => {
    setSavedChannels((channels) =>
      channels.filter((channel) => channel.id !== id)
    );
  };

  const removeUnsavedChannel = (id: string) => {
    setUnsavedChannels((channels) =>
      channels.filter((channel) => channel.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Edit Catalog</h1>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add channel from video</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Channel from Video</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter video URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <Button onClick={handleValidate}>Validate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Channels</h2>
              <Badge variant="secondary">
                {savedChannels.length} of 15 channels added
              </Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL No</TableHead>
                  <TableHead>Channel Title</TableHead>
                  <TableHead>Channel ID</TableHead>
                  <TableHead>Channel Topics</TableHead>
                  <TableHead>Channel Handle</TableHead>
                  <TableHead className="w-[50px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedChannels.map((channel, index) => (
                  <TableRow key={channel.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{channel.title}</TableCell>
                    <TableCell className="font-mono">{channel.id}</TableCell>
                    <TableCell>{channel.topics}</TableCell>
                    <TableCell>{channel.handle}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSavedChannel(channel.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Unsaved Channels</h2>
              <Badge variant="secondary">
                Can add {15 - savedChannels.length} more channels
              </Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL No</TableHead>
                  <TableHead>Channel Title</TableHead>
                  <TableHead>Channel ID</TableHead>
                  <TableHead>Channel Topics</TableHead>
                  <TableHead>Channel Handle</TableHead>
                  <TableHead className="w-[50px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsavedChannels.map((channel, index) => (
                  <TableRow key={channel.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{channel.title}</TableCell>
                    <TableCell className="font-mono">{channel.id}</TableCell>
                    <TableCell>{channel.topics}</TableCell>
                    <TableCell>{channel.handle}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUnsavedChannel(channel.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
