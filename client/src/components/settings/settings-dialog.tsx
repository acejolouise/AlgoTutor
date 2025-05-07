import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EyeIcon, EyeOffIcon, Sun, Moon, Monitor, Contrast } from "lucide-react";
import { programmingLanguages } from "../../lib/openai";
import { useTheme } from "next-themes";

// Form schema for settings
const settingsSchema = z.object({
  apiKey: z.string().optional(),
  language: z.string(),
  theme: z.enum(["light", "dark", "system", "monochrome"]),
  fontSize: z.number().min(1).max(5),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferredLanguage: string;
  onLanguageChange: (language: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  preferredLanguage,
  onLanguageChange,
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { theme, setTheme } = useTheme();

  // Initialize form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      apiKey: "••••••••••••••••••••",
      language: preferredLanguage,
      theme: (theme || "monochrome") as any,
      fontSize: 3,
    },
  });

  // Update form when theme changes
  useEffect(() => {
    if (theme) {
      form.setValue("theme", theme as any);
    }
  }, [theme, form]);

  // Handle form submission
  const onSubmit = (data: SettingsFormValues) => {
    console.log("Settings updated:", data);
    
    // Update theme
    setTheme(data.theme);
    
    // Update language
    onLanguageChange(data.language);
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your AlgoTutor experience
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* API Key */}
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showApiKey ? "text" : "password"} 
                        className="rounded-r-none"
                        disabled 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormDescription>
                    API key is stored locally and never sent to our servers
                  </FormDescription>
                </FormItem>
              )}
            />
            
            {/* Programming Language */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Programming Language</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programmingLanguages.map((lang) => (
                        <SelectItem key={lang.toLowerCase()} value={lang.toLowerCase()}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            {/* Theme */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appearance</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={field.value === "light" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => field.onChange("light")}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "dark" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => field.onChange("dark")}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "monochrome" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => field.onChange("monochrome")}
                    >
                      <Contrast className="h-4 w-4 mr-2" />
                      Monochrome
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "system" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => field.onChange("system")}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Font Size */}
            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Size</FormLabel>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">A</span>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="flex-1"
                      />
                    </FormControl>
                    <span className="text-lg">A</span>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
