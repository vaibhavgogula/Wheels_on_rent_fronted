'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVehicle } from '@/hooks/useVehicle';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ReviewPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = React.use(params);
  const { vehicle, loading, error } = useVehicle(vehicleId);
  const { toast } = useToast();
  const router = useRouter();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }

      const reviewData = {
        comment: comment.trim(),
        rating: rating
      };

      console.log('Submitting review:', reviewData);

      const response = await fetch(`http://localhost:8080/api/reviews/${vehicleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Review submission failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Review submitted successfully:', result);

      toast({
        title: "Review Submitted!",
        description: "Thank you for your review. It has been submitted successfully.",
        duration: 5000,
      });

      setTimeout(() => {
        router.push('/bookings');
      }, 2000);

    } catch (error) {
      console.error('Review submission error:', error);
      toast({
        title: "Review Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting your review. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl text-red-600">Vehicle Not Found</CardTitle>
            <CardDescription>{error || 'The vehicle you are trying to review does not exist.'}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/bookings">Back to Bookings</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Leave a Review</CardTitle>
          <CardDescription>How was your experience with the {vehicle.name}?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              <div
                className="flex items-center gap-2"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <Star
                      key={starValue}
                      className={cn(
                        'h-8 w-8 cursor-pointer transition-colors',
                        starValue <= (hoverRating || rating)
                          ? 'text-accent fill-accent'
                          : 'text-muted-foreground/30'
                      )}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="text-sm font-medium">Your Comments</label>
              <Textarea
                id="comment"
                placeholder="Tell us about your rental experience..."
                className="mt-1"
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || rating === 0 || !comment.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
