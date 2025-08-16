'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { optimizeTranscript, type OptimizeTranscriptOutput } from '@/ai/flows/optimize-transcript';
import { Loader2, Sparkles, Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OptimizePage() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeTranscriptOutput | null>(null);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!transcript.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a transcript to optimize.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const optimizations = await optimizeTranscript({ transcript });
      setResult(optimizations);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate optimizations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.optimizations) {
      navigator.clipboard.writeText(result.optimizations.join('\n'));
      toast({
        title: 'Copied!',
        description: 'Optimizations have been copied to your clipboard.',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-start">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Transcript Optimizer</CardTitle>
            <CardDescription>
              Paste a transcript to get a list of actionable optimizations and action items.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transcript-input">Transcript</Label>
              <Textarea
                id="transcript-input"
                placeholder="Paste your transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
            <Button onClick={handleOptimize} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Optimize
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Optimizations & Actions</CardTitle>
             <CardDescription>Your AI-generated action items will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result && (
              <div className="relative group">
                <Button variant="ghost" size="icon" className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleCopy}>
                  <Clipboard className="h-4 w-4"/>
                </Button>
                <ul className="space-y-2">
                  {result.optimizations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
