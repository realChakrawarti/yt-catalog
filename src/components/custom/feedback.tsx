"use client";

import {
  Bug,
  HelpCircle,
  Lightbulb,
  MailQuestion,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";

import { toast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import { Button } from "../shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { Textarea } from "../shadcn/textarea";

type FeedbackType = "Bug" | "Improvement" | "Feature" | "General";

interface FeedbackData {
  name: string;
  email: string;
  feedback: string;
  type: FeedbackType;
}

const feedbackTypes: { [key in FeedbackType]: JSX.Element } = {
  Bug: <Bug className="mr-2 h-4 w-4" />,
  Improvement: <Lightbulb className="mr-2 h-4 w-4" />,
  Feature: <PlusCircle className="mr-2 h-4 w-4" />,
  General: <HelpCircle className="mr-2 h-4 w-4" />,
};

const TITLE_CHAR_LIMIT = 96;

const initialFeedbackData: FeedbackData = {
  name: "",
  email: "",
  feedback: "",
  type: "General",
};

export default function Feedback() {
  const [feedbackData, setFeedbackData] =
    useState<FeedbackData>(initialFeedbackData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { type, feedback, email = "", name = "" } = feedbackData;

    const title =
      feedback.length > TITLE_CHAR_LIMIT
        ? feedback.substring(0, TITLE_CHAR_LIMIT) + "..."
        : feedback;
    const description = `
### Reporter
**Name:** ${name ? name : "N/A"}
**Email:** ${email ? email : "N/A"}

### Device Information
**Platform:** ${navigator.platform}
**User-Agent:** ${navigator.userAgent}
**Screen Resolution:** ${window.screen.width} x ${window.screen.height}
**Cookies Enabled:** ${navigator.cookieEnabled}

### Description
${feedback}
`;

    const payload = {
      title: `[${type.toUpperCase()}] ${title}`,
      description: description,
    };

    const result = await fetchApi("/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (result.success) {
      toast({
        title: result.message,
        description: (
          <p>
            Issue link:{" "}
            <a
              href={result.data.data}
              target="_blank"
              className="cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70"
            >
              {result.data.data}
            </a>
          </p>
        ),
      });
      setFeedbackData(initialFeedbackData);
    } else {
      toast({ title: "Unable to shared feedback." });
    }
  };
  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="flex gap-2 group/feedback transition-all duration-200 ease-in"
            variant="outline"
          >
            <p className="hidden group-hover/feedback:block">Feedback</p>
            <MailQuestion size={24} />{" "}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              We appreciate your feedback. Please fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                value={feedbackData.name}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={feedbackData.email}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                required
                value={feedbackData.feedback}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, feedback: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type of Feedback</Label>
              <Select
                value={feedbackData.type}
                onValueChange={(value: FeedbackType) =>
                  setFeedbackData({ ...feedbackData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(feedbackTypes) as FeedbackType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center">
                          {feedbackTypes[type]}
                          {type}
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <DialogClose>
              <Button type="submit" className="w-full">
                Submit Feedback
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
