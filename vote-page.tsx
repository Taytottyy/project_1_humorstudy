"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "./lib/supabase/client";
import { ThumbsUp, ThumbsDown, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { AuthHeader } from "./components/auth-header";
import { useAuth } from "./components/auth-provider";

interface Caption {
  id: string;
  caption_text: string;
  image_id: string;
  image_url: string | null;
  image_description: string | null;
}

interface Study {
  id: string;
  name: string;
  description: string | null;
}

type VoteValue = 1 | -1;

export default function VotePage() {
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();

  const [study, setStudy] = useState<Study | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, VoteValue>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [pendingVote, setPendingVote] = useState<VoteValue | null>(null);

  if (authLoading) {
    return (
      <div className="vote-shell">
        <div className="vote-loading">
          <Loader2 className="spin" size={32} />
          <p>Loading authentication…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="vote-shell">
        <div className="vote-error">
          <p className="error-msg">Please sign in to vote on captions.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    async function loadStudy() {
      try {
        setLoading(true);

        const { data: studyData, error: studyErr } = await supabase
          .from("studies")
          .select("id, name, description")
          .lte("start_time", new Date().toISOString())
          .order("start_time", { ascending: false })
          .limit(1)
          .single();

        if (studyErr || !studyData) {
          setError("No active study found. Check back soon!");
          setLoading(false);
          return;
        }

        setStudy(studyData);

        const { data: mappings, error: mapErr } = await supabase
          .from("study_caption_mappings")
          .select("caption_id")
          .eq("study_id", studyData.id);

        if (mapErr || !mappings || mappings.length === 0) {
          setError("No captions found for this study.");
          setLoading(false);
          return;
        }

        const captionIds = mappings.map((m: { caption_id: string }) => m.caption_id);

        const { data: captionData, error: capErr } = await supabase
          .from("captions")
          .select("id, caption_text, image_id, images(url, image_description)")
          .in("id", captionIds);

        if (capErr || !captionData) {
          setError("Failed to load captions.");
          setLoading(false);
          return;
        }

        const formatted: Caption[] = captionData.map((c: any) => ({
          id: c.id,
          caption_text: c.caption_text,
          image_id: c.image_id,
          image_url: c.images?.url ?? null,
          image_description: c.images?.image_description ?? null,
        }));

        setCaptions([...formatted].sort(() => Math.random() - 0.5));
      } catch {
        setError("Something went wrong loading the study.");
      } finally {
        setLoading(false);
      }
    }

    loadStudy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setPendingVote(null);
      setAnimating(false);
      setCurrentIndex((i) => {
        if (i + 1 >= captions.length) {
          setDone(true);
          return i;
        }
        return i + 1;
      });
    }, 350);
  }, [captions.length]);

  const submitVote = useCallback(
    async (value: VoteValue) => {
      if (!study || submitting || animating || !user) return;
      const caption = captions[currentIndex];
      if (!caption) return;

      setSubmitting(true);
      setPendingVote(value);

      const { error: voteErr } = await supabase.from("caption_votes").insert({
        caption_id: caption.id,
        study_id: study.id,
        user_id: user.id,
        vote: value,
        created_at: new Date().toISOString(),
      });

      if (voteErr) console.error("Vote error:", voteErr.message);

      setVotes((prev) => ({ ...prev, [caption.id]: value }));
      setSubmitting(false);
      advance();
    },
    [study, captions, currentIndex, submitting, animating, supabase, advance, user]
  );

  const skip = useCallback(() => {
    if (animating) return;
    advance();
  }, [animating, advance]);

  const restart = () => {
    setCurrentIndex(0);
    setVotes({});
    setDone(false);
    setCaptions((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const progress =
    captions.length > 0 ? Math.round((currentIndex / captions.length) * 100) : 0;

  if (loading) {
    return (
      <div className="vote-shell">
        <div className="vote-loading">
          <Loader2 className="spin" size={32} />
          <p>Loading study…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vote-shell">
        <div className="vote-error">
          <p className="error-msg">{error}</p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="vote-shell">
        <div className="vote-done">
          <CheckCircle2 size={56} className="done-icon" />
          <h1>You&apos;re done!</h1>
          <p>
            You voted on <strong>{Object.keys(votes).length}</strong> caption
            {Object.keys(votes).length !== 1 ? "s" : ""}.
          </p>
          <p className="done-sub">Your votes power real humor research. Thanks!</p>
          <button className="btn-restart" onClick={restart}>
            Vote Again
          </button>
        </div>
      </div>
    );
  }

  const caption = captions[currentIndex];
  if (!caption) return null;

  return (
    <div className="vote-shell">
      <AuthHeader />
      <header className="vote-header">
        <span className="vote-logo">crackd</span>
        <span className="vote-study-name">{study?.name}</span>
      </header>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-label">
        {currentIndex + 1} / {captions.length}
      </p>

      <div
        className={clsx("caption-card", {
          "card-exit": animating,
          "card-exit-up": animating && pendingVote === 1,
          "card-exit-down": animating && pendingVote === -1,
        })}
      >
        {caption.image_url ? (
          <div className="caption-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caption.image_url}
              alt={caption.image_description ?? "Study image"}
              className="caption-img"
            />
          </div>
        ) : caption.image_description ? (
          <div className="caption-img-placeholder">
            <p className="placeholder-text">{caption.image_description}</p>
          </div>
        ) : null}

        <div className="caption-text-wrap">
          <p className="caption-text">&ldquo;{caption.caption_text}&rdquo;</p>
        </div>
      </div>

      <div className="vote-controls">
        <button
          className={clsx("vote-btn vote-btn-down", { active: pendingVote === -1 })}
          onClick={() => submitVote(-1)}
          disabled={submitting || animating}
          aria-label="Not funny"
        >
          <ThumbsDown size={28} />
          <span>Not funny</span>
        </button>

        <button
          className="skip-btn"
          onClick={skip}
          disabled={animating}
          aria-label="Skip"
        >
          <ChevronRight size={20} />
        </button>

        <button
          className={clsx("vote-btn vote-btn-up", { active: pendingVote === 1 })}
          onClick={() => submitVote(1)}
          disabled={submitting || animating}
          aria-label="Funny"
        >
          <ThumbsUp size={28} />
          <span>Funny</span>
        </button>
      </div>
    </div>
  );
}
