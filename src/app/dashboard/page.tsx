'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { summarizeText, type SummarizeTextOutput } from '@/ai/flows/summarize-text';
import { Loader2, Sparkles, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SummarizePage() {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummarizeTextOutput | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to summarize.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const summary = await summarizeText({ text, prompt });
      setResult(summary);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (result?.summary) {
      navigator.clipboard.writeText(result.summary);
      toast({
        title: 'Copied!',
        description: 'Summary has been copied to your clipboard.',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-start">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Text Summarizer</CardTitle>
            <CardDescription>
              Paste your text and provide a prompt to get a conversational summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Your Text or Transcript</Label>
              <Textarea
                id="text-input"
                placeholder="Paste your content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt-input">Summarization Prompt (Optional)</Label>
              <Input
                id="prompt-input"
                placeholder="e.g., Summarize this for a busy executive"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button onClick={handleSummarize} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Summarize
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Generated Summary</CardTitle>
            <CardDescription>Your AI-powered summary will appear here.</CardDescription>
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
                <p className="text-sm whitespace-pre-wrap">{result.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
