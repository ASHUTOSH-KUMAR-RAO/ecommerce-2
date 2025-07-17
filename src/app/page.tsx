import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="mt-5 ml-10">
        <Button variant="elevated">I am a ashutosh</Button>
      </div>
      <div className="ml-10">
        <Input placeholder="mai input hu" />
      </div>
      <div className="ml-10">
        <Progress value={50} />
      </div>
      <div className="ml-10">
        <Textarea value="mai text area hu bhai sahab" />
      </div>
      <div className="ml-10">
        <Checkbox />
      </div>
    </div>
  );
};

export default page;
