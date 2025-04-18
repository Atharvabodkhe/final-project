"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fadeIn, fadeInUp } from "@/lib/animations";
import { Check, SendIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setIsSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md relative"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={fadeInUp} className="relative">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "h-12 pr-32 bg-background/50 backdrop-blur-sm border-neutral-200 dark:border-neutral-800",
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
            disabled={isSubmitting || isSuccess}
          />
          <Button 
            type="submit" 
            className={cn(
              "absolute right-1 top-1 h-10",
              isSuccess ? "bg-green-600 hover:bg-green-700" : ""
            )}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              <>
                <span>Subscribe</span>
                <SendIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
        
        {isSuccess && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-500 text-sm mt-1"
          >
            Thanks for subscribing! Check your email for confirmation.
          </motion.p>
        )}
      </form>
    </motion.div>
  );
} 