"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type StrengthKey =
  | "strategic"
  | "analytical"
  | "relationship"
  | "communication"
  | "execution"
  | "learning";

type Question = {
  prompt: string;
  options: {
    label: string;
    strength: StrengthKey;
  }[];
};

type CoachingProfile = {
  label: string;
  pattern: string;
  interviewAdvantage: string;
  interviewRisk: string;
  stretchArea: string;
  pathfoundCoaching: string;
};

const strengthLabels: Record<StrengthKey, string> = {
  strategic: "Strategic Navigator",
  analytical: "Analytical Problem Solver",
  relationship: "Relationship Builder",
  communication: "Clear Communicator",
  execution: "Execution Driver",
  learning: "Learning Adapter",
};

const coachingProfiles: Record<StrengthKey, CoachingProfile> = {
  strategic: {
    label: "Strategic Navigator",
    pattern:
      "You naturally look for patterns, tradeoffs, and the bigger picture. You are probably strongest when you can understand where something is headed and decide what matters most.",
    interviewAdvantage:
      "In interviews, this helps you sound thoughtful, senior, and business-aware. You can connect your work to company priorities instead of only describing tasks.",
    interviewRisk:
      "Your risk is moving too quickly to the conclusion. You may assume the interviewer sees the same pattern you see, and skip the concrete steps that prove your thinking.",
    stretchArea:
      "You need to practice slowing down and showing your work. Lead with the strategic point, then support it with one clear example, one decision, and one measurable outcome.",
    pathfoundCoaching:
      "PathFound will help you turn broad strategic thinking into crisp interview stories that still feel grounded, specific, and credible.",
  },
  analytical: {
    label: "Analytical Problem Solver",
    pattern:
      "You are strongest when you can investigate, compare evidence, and reason your way to a decision. You probably build confidence by understanding the details.",
    interviewAdvantage:
      "In interviews, this gives you credibility. You can show judgment, rigor, and the ability to solve messy problems without relying on vague instincts.",
    interviewRisk:
      "Your risk is over-explaining the analysis before making the business point. Interviewers may lose the thread if you go too deep too quickly.",
    stretchArea:
      "You need to practice answer-first storytelling. Start with the outcome, then explain the evidence. Do not make the interviewer wait too long for the point.",
    pathfoundCoaching:
      "PathFound will help you compress complex work into sharper examples, stronger business impact, and cleaner executive-level answers.",
  },
  relationship: {
    label: "Relationship Builder",
    pattern:
      "You create value through trust, context, and collaboration. You probably notice people dynamics quickly and understand what different stakeholders need.",
    interviewAdvantage:
      "In interviews, this helps you show maturity, empathy, and cross-functional effectiveness. You can demonstrate that you do not just complete work — you bring people along.",
    interviewRisk:
      "Your risk is underselling the hard skill behind the relationship work. You may describe collaboration well but not clearly enough show the business result or technical contribution.",
    stretchArea:
      "You need to practice tying people stories to outcomes. For every stakeholder example, name the conflict, your role, the decision made, and the measurable impact.",
    pathfoundCoaching:
      "PathFound will help you turn relationship-heavy stories into strong leadership examples that still prove capability, judgment, and results.",
  },
  communication: {
    label: "Clear Communicator",
    pattern:
      "You create value by making ideas easier to understand. You probably help people align around a story, a recommendation, or a clear next step.",
    interviewAdvantage:
      "In interviews, this helps you be memorable. You can make your experience easier for hiring teams to understand and repeat back to others.",
    interviewRisk:
      "Your risk is sounding polished but not deep enough. If the story is too smooth, interviewers may wonder whether there is enough substance underneath.",
    stretchArea:
      "You need to practice pairing clarity with proof. Make sure every strong story includes evidence: numbers, constraints, tradeoffs, or concrete decisions.",
    pathfoundCoaching:
      "PathFound will help you keep your natural clarity while adding depth, specificity, and proof points that make your answers stronger.",
  },
  execution: {
    label: "Execution Driver",
    pattern:
      "You create value by moving work forward. You probably feel best when there is a clear goal, clear ownership, and visible progress.",
    interviewAdvantage:
      "In interviews, this helps you show reliability, momentum, and ownership. Hiring teams can picture you getting things done.",
    interviewRisk:
      "Your risk is making your work sound too task-oriented. If you only explain what you completed, you may not fully show the judgment, prioritization, or strategy behind it.",
    stretchArea:
      "You need to practice explaining why your execution mattered. Do not just say what you did — explain what was at stake, how you prioritized, and what changed because of you.",
    pathfoundCoaching:
      "PathFound will help you elevate execution stories into leadership stories with clearer stakes, decisions, and outcomes.",
  },
  learning: {
    label: "Learning Adapter",
    pattern:
      "You create value by ramping quickly, asking good questions, and adapting in unfamiliar situations. You likely grow fast when you are exposed to new problems.",
    interviewAdvantage:
      "In interviews, this helps you show curiosity, adaptability, and resilience. You can be compelling for roles where the company needs someone who can learn quickly.",
    interviewRisk:
      "Your risk is sounding too open-ended. If you emphasize learning too much, interviewers may wonder whether you already have enough mastery for the role.",
    stretchArea:
      "You need to practice balancing curiosity with authority. Show what you learned, but also show where you took ownership and became effective.",
    pathfoundCoaching:
      "PathFound will help you frame learning as a strength without making you sound underprepared or junior.",
  },
};

const baseQuestions: Question[] = [
  {
    prompt: "When facing a new challenge, I usually start by...",
    options: [
      { label: "Mapping the best path forward", strength: "strategic" },
      { label: "Gathering facts and evidence", strength: "analytical" },
      { label: "Talking to the people involved", strength: "relationship" },
      { label: "Clarifying the message and goal", strength: "communication" },
    ],
  },
  {
    prompt: "In interviews, I most want to show that I can...",
    options: [
      { label: "Think several steps ahead", strength: "strategic" },
      { label: "Solve complex problems", strength: "analytical" },
      { label: "Work well with stakeholders", strength: "relationship" },
      { label: "Explain ideas clearly", strength: "communication" },
    ],
  },
  {
    prompt: "People often rely on me to...",
    options: [
      { label: "Find the smartest direction", strength: "strategic" },
      { label: "Make sense of messy information", strength: "analytical" },
      { label: "Create trust across a group", strength: "relationship" },
      { label: "Turn confusion into clarity", strength: "communication" },
    ],
  },
  {
    prompt: "When a project feels stuck, I tend to...",
    options: [
      { label: "Reframe the problem", strength: "strategic" },
      { label: "Look for the root cause", strength: "analytical" },
      { label: "Reconnect the right people", strength: "relationship" },
      { label: "Create a clear next step", strength: "execution" },
    ],
  },
  {
    prompt: "The kind of work that energizes me most is...",
    options: [
      { label: "Planning and prioritizing", strength: "strategic" },
      { label: "Analysis and investigation", strength: "analytical" },
      { label: "Relationship building", strength: "relationship" },
      { label: "Learning something new", strength: "learning" },
    ],
  },
  {
    prompt: "My strongest contribution in a team is usually...",
    options: [
      { label: "Seeing the bigger picture", strength: "strategic" },
      { label: "Pressure-testing ideas", strength: "analytical" },
      { label: "Helping people work together", strength: "relationship" },
      { label: "Keeping the work moving", strength: "execution" },
    ],
  },
  {
    prompt: "When preparing for an interview, I prefer to...",
    options: [
      { label: "Understand the company strategy", strength: "strategic" },
      { label: "Research data, metrics, and performance", strength: "analytical" },
      { label: "Understand the team and people", strength: "relationship" },
      { label: "Practice my stories out loud", strength: "communication" },
    ],
  },
  {
    prompt: "A hiring manager would probably value me because I...",
    options: [
      { label: "Make thoughtful decisions", strength: "strategic" },
      { label: "Bring strong judgment from evidence", strength: "analytical" },
      { label: "Build strong working relationships", strength: "relationship" },
      { label: "Get important work done", strength: "execution" },
    ],
  },
  {
    prompt: "When I receive unclear feedback, I usually...",
    options: [
      { label: "Try to infer the underlying pattern", strength: "strategic" },
      { label: "Ask precise follow-up questions", strength: "analytical" },
      { label: "Try to understand the person's perspective", strength: "relationship" },
      { label: "Translate it into a clearer action plan", strength: "communication" },
    ],
  },
  {
    prompt: "I feel most confident when I can...",
    options: [
      { label: "Choose the right direction", strength: "strategic" },
      { label: "Back up my thinking with evidence", strength: "analytical" },
      { label: "Connect with people authentically", strength: "relationship" },
      { label: "Deliver something concrete", strength: "execution" },
    ],
  },
  {
    prompt: "If I joined a new company, I would first focus on...",
    options: [
      { label: "Understanding priorities and tradeoffs", strength: "strategic" },
      { label: "Understanding the data and systems", strength: "analytical" },
      { label: "Building trust with the team", strength: "relationship" },
      { label: "Learning the business quickly", strength: "learning" },
    ],
  },
  {
    prompt: "In a stressful job search, I most need help with...",
    options: [
      { label: "Choosing where to focus", strength: "strategic" },
      { label: "Evaluating options objectively", strength: "analytical" },
      { label: "Staying connected and supported", strength: "relationship" },
      { label: "Turning goals into actions", strength: "execution" },
    ],
  },
  {
    prompt: "My best interview stories usually involve...",
    options: [
      { label: "A smart decision or pivot", strength: "strategic" },
      { label: "A difficult problem I solved", strength: "analytical" },
      { label: "A relationship or team challenge", strength: "relationship" },
      { label: "A result I helped deliver", strength: "execution" },
    ],
  },
  {
    prompt: "When networking, I am best at...",
    options: [
      { label: "Finding mutually useful opportunities", strength: "strategic" },
      { label: "Asking thoughtful questions", strength: "analytical" },
      { label: "Creating genuine connection", strength: "relationship" },
      { label: "Explaining my background clearly", strength: "communication" },
    ],
  },
  {
    prompt: "I tend to impress people when I...",
    options: [
      { label: "Make a complex situation feel navigable", strength: "strategic" },
      { label: "Spot something others missed", strength: "analytical" },
      { label: "Make people feel understood", strength: "relationship" },
      { label: "Communicate with confidence", strength: "communication" },
    ],
  },
  {
    prompt: "When I am learning a new role, I usually...",
    options: [
      { label: "Identify the key levers quickly", strength: "strategic" },
      { label: "Study the details and systems", strength: "analytical" },
      { label: "Learn from people around me", strength: "relationship" },
      { label: "Experiment and adapt quickly", strength: "learning" },
    ],
  },
  {
    prompt: "The feedback I most want from PathFound is...",
    options: [
      { label: "Where to focus my job search", strength: "strategic" },
      { label: "How to evaluate opportunities", strength: "analytical" },
      { label: "How to strengthen relationships", strength: "relationship" },
      { label: "What action to take next", strength: "execution" },
    ],
  },
  {
    prompt: "When negotiating or discussing offers, I would likely...",
    options: [
      { label: "Think through leverage and timing", strength: "strategic" },
      { label: "Compare compensation data carefully", strength: "analytical" },
      { label: "Maintain a positive relationship", strength: "relationship" },
      { label: "Prepare a clear message", strength: "communication" },
    ],
  },
  {
    prompt: "I am most likely to struggle when...",
    options: [
      { label: "There is no clear direction", strength: "strategic" },
      { label: "There is not enough information", strength: "analytical" },
      { label: "There is poor communication between people", strength: "relationship" },
      { label: "There is no concrete next step", strength: "execution" },
    ],
  },
  {
    prompt: "The best version of me at work is...",
    options: [
      { label: "A thoughtful strategist", strength: "strategic" },
      { label: "A rigorous problem solver", strength: "analytical" },
      { label: "A trusted partner", strength: "relationship" },
      { label: "A clear storyteller", strength: "communication" },
    ],
  },
  {
    prompt: "When I read a job description, I naturally look for...",
    options: [
      { label: "How the role fits the company direction", strength: "strategic" },
      { label: "The problems and metrics involved", strength: "analytical" },
      { label: "The team and cross-functional work", strength: "relationship" },
      { label: "The skills I would need to learn", strength: "learning" },
    ],
  },
  {
    prompt: "After an interview, I usually think most about...",
    options: [
      { label: "Whether the opportunity makes sense strategically", strength: "strategic" },
      { label: "Whether I answered questions with enough evidence", strength: "analytical" },
      { label: "Whether I connected with the interviewer", strength: "relationship" },
      { label: "Whether I communicated my value clearly", strength: "communication" },
    ],
  },
  {
    prompt: "If PathFound coached me before an interview, I would want it to help me...",
    options: [
      { label: "Frame my value around business priorities", strength: "strategic" },
      { label: "Prepare evidence-based examples", strength: "analytical" },
      { label: "Understand the people I am meeting", strength: "relationship" },
      { label: "Practice concise answers", strength: "communication" },
    ],
  },
  {
    prompt: "When I have multiple opportunities moving at once, I need help...",
    options: [
      { label: "Prioritizing the best paths", strength: "strategic" },
      { label: "Comparing them objectively", strength: "analytical" },
      { label: "Managing communication well", strength: "relationship" },
      { label: "Keeping track of next steps", strength: "execution" },
    ],
  },
  {
    prompt: "I am most proud when I...",
    options: [
      { label: "Choose a path that works", strength: "strategic" },
      { label: "Solve a hard problem", strength: "analytical" },
      { label: "Help people succeed together", strength: "relationship" },
      { label: "Deliver something meaningful", strength: "execution" },
    ],
  },
  {
    prompt: "A good career coach should help me...",
    options: [
      { label: "Make better decisions", strength: "strategic" },
      { label: "Think more clearly", strength: "analytical" },
      { label: "Build stronger relationships", strength: "relationship" },
      { label: "Take consistent action", strength: "execution" },
    ],
  },
  {
    prompt: "I want hiring teams to remember me as someone who...",
    options: [
      { label: "Thinks strategically", strength: "strategic" },
      { label: "Brings strong analytical judgment", strength: "analytical" },
      { label: "Works well with people", strength: "relationship" },
      { label: "Communicates clearly", strength: "communication" },
    ],
  },
  {
    prompt: "In a new industry, I would rely most on my ability to...",
    options: [
      { label: "Understand the market quickly", strength: "strategic" },
      { label: "Learn the data and mechanics", strength: "analytical" },
      { label: "Ask people good questions", strength: "relationship" },
      { label: "Ramp up through curiosity", strength: "learning" },
    ],
  },
  {
    prompt: "My strongest job-search advantage is probably...",
    options: [
      { label: "Knowing how to position myself", strength: "strategic" },
      { label: "Having strong proof points", strength: "analytical" },
      { label: "Building authentic relationships", strength: "relationship" },
      { label: "Explaining my story well", strength: "communication" },
    ],
  },
  {
    prompt: "When PathFound gives me guidance, I want it to be...",
    options: [
      { label: "Strategic and focused", strength: "strategic" },
      { label: "Evidence-based and practical", strength: "analytical" },
      { label: "Human and relationship-aware", strength: "relationship" },
      { label: "Clear and action-oriented", strength: "execution" },
    ],
  },
];

function shuffleOptions(question: Question): Question {
  return {
    ...question,
    options: [...question.options].sort(() => Math.random() - 0.5),
  };
}

export default function Assessment() {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedStrengths, setSelectedStrengths] = useState<
    (StrengthKey | null)[]
  >(Array(baseQuestions.length).fill(null));
  const [result, setResult] = useState<{
    primaryKey: StrengthKey;
    secondaryKey: StrengthKey;
    primary: string;
    secondary: string;
    summary: string;
    scores: Record<StrengthKey, number>;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const questions = useMemo(() => baseQuestions.map(shuffleOptions), []);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUserId(data.user.id);
      setChecking(false);
    }

    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const progressPercent = useMemo(() => {
    return ((currentQuestion + 1) / questions.length) * 100;
  }, [currentQuestion, questions.length]);

  function selectAnswer(strength: StrengthKey) {
    const next = [...selectedStrengths];
    next[currentQuestion] = strength;
    setSelectedStrengths(next);
  }

  function goNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  function goBack() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  function calculateScores() {
    const scores: Record<StrengthKey, number> = {
      strategic: 0,
      analytical: 0,
      relationship: 0,
      communication: 0,
      execution: 0,
      learning: 0,
    };

    selectedStrengths.forEach((strength) => {
      if (strength) scores[strength] += 1;
    });

    return scores;
  }

  async function finishAssessment() {
    setSaving(true);
    setMessage("");

    const scores = calculateScores();

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]) as [
      StrengthKey,
      number
    ][];

    const primaryKey = sorted[0][0];
    const secondaryKey = sorted[1][0];

    const primary = strengthLabels[primaryKey];
    const secondary = strengthLabels[secondaryKey];

    const summary = `${primary}: ${coachingProfiles[primaryKey].pattern} Stretch area: ${coachingProfiles[primaryKey].stretchArea} Secondary strength: ${secondary}.`;

    const newResult = {
      primaryKey,
      secondaryKey,
      primary,
      secondary,
      summary,
      scores,
    };

    setResult(newResult);

    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      career_strength_primary: primary,
      career_strength_secondary: secondary,
      career_strength_summary: summary,
      career_strength_scores: scores,
      career_strength_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Assessment saved to your profile.");
    }

    setSaving(false);
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking your account...</p>
      </main>
    );
  }

  const question = questions[currentQuestion];
  const selectedStrength = selectedStrengths[currentQuestion];
  const answeredCount = selectedStrengths.filter(Boolean).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="border-b bg-white px-8 py-4 flex justify-between items-center">
        <a href="/" className="font-bold text-green-950 text-xl">
          PathFound
        </a>

        <div className="flex gap-6 text-sm">
          <a href="/home" className="text-gray-700 hover:text-black">
            Home
          </a>

          <a href="/assessment" className="text-gray-900 font-medium">
            Assessment
          </a>

<Link
  href="/home/import-review"
  className="text-gray-700 hover:text-black"
>
  Import Review
</Link>

          <a href="/account" className="text-gray-700 hover:text-black">
            Account
          </a>

          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-black"
          >
            Log out
          </button>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-8 py-12">
        {!started ? (
          <div className="bg-white border rounded-2xl p-8">
            <p className="text-sm font-medium text-green-900 mb-3">
              PathFound Career Strengths
            </p>

            <h1 className="text-4xl font-bold mb-4">
              Understand how you show up in your job search.
            </h1>

            <p className="text-gray-700 mb-6">
              This assessment helps PathFound understand how you naturally think,
              communicate, build trust, solve problems, and move work forward.
              Your results will help shape future interview prep, coaching, and
              career guidance.
            </p>

            <div className="space-y-4 text-gray-800 mb-8">
              <div className="border rounded-xl p-4">
                <p className="font-medium mb-1">Lean into your strengths</p>
                <p className="text-sm text-gray-600">
                  Learn which parts of your work style are most likely to help
                  you stand out in interviews.
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="font-medium mb-1">Spot your interview risks</p>
                <p className="text-sm text-gray-600">
                  Strong patterns can become blind spots. PathFound will help you
                  see where your answers may become too detailed, too vague, too
                  rushed, or too task-focused.
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="font-medium mb-1">Practice with purpose</p>
                <p className="text-sm text-gray-600">
                  Your results will eventually help PathFound tailor interview
                  prep around the selling points you should emphasize and the
                  habits you need to stretch.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800"
            >
              Start Assessment
            </button>
          </div>
        ) : !result ? (
          <div className="bg-white border rounded-2xl p-8">
            <div className="mb-8">
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>{answeredCount} answered</span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-900"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">{question.prompt}</h2>

            <div className="space-y-4">
              {question.options.map((option) => {
                const isSelected = selectedStrength === option.strength;

                return (
                  <button
                    key={option.label}
                    onClick={() => selectAnswer(option.strength)}
                    className={`w-full text-left border rounded-xl p-4 hover:bg-stone-50 ${
                      isSelected
                        ? "border-green-900 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={goBack}
                disabled={currentQuestion === 0}
                className="border px-6 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Back
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={goNext}
                  disabled={!selectedStrength}
                  className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-40"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={finishAssessment}
                  disabled={!allAnswered || saving}
                  className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-40"
                >
                  {saving ? "Saving..." : "See My Results"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-8">
            <p className="text-sm font-medium text-green-900 mb-3">
              Your PathFound Career Pattern
            </p>

            <h1 className="text-4xl font-bold mb-6">{result.primary}</h1>

            <p className="text-gray-700 mb-8">
              {coachingProfiles[result.primaryKey].pattern}
            </p>

            <div className="space-y-6 mb-8">
              <div className="border rounded-xl p-5">
                <h2 className="font-semibold mb-2">
                  How this helps in interviews
                </h2>
                <p className="text-gray-700">
                  {coachingProfiles[result.primaryKey].interviewAdvantage}
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h2 className="font-semibold mb-2">
                  Where this may work against you
                </h2>
                <p className="text-gray-700">
                  {coachingProfiles[result.primaryKey].interviewRisk}
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h2 className="font-semibold mb-2">
                  Where you need to stretch
                </h2>
                <p className="text-gray-700">
                  {coachingProfiles[result.primaryKey].stretchArea}
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h2 className="font-semibold mb-2">
                  How PathFound will coach you
                </h2>
                <p className="text-gray-700">
                  {coachingProfiles[result.primaryKey].pathfoundCoaching}
                </p>
              </div>
            </div>

            <div className="bg-stone-50 border rounded-xl p-5 mb-8">
              <p className="text-sm text-gray-500 mb-2">Secondary pattern</p>
              <p className="text-xl font-semibold mb-3">{result.secondary}</p>
              <p className="text-gray-700">
                {coachingProfiles[result.secondaryKey].pattern}
              </p>
            </div>

            <details className="bg-stone-50 border rounded-xl p-5 mb-8">
              <summary className="cursor-pointer font-medium">
                View strength signal breakdown
              </summary>

              <div className="space-y-2 text-sm text-gray-700 mt-4">
                {Object.entries(result.scores).map(([key, score]) => (
                  <div key={key} className="flex justify-between">
                    <span>{strengthLabels[key as StrengthKey]}</span>
                    <span>{score}</span>
                  </div>
                ))}
              </div>
            </details>

            {message && <p className="text-gray-700 mb-6">{message}</p>}

            <div className="flex gap-3">
              <a
                href="/account"
                className="inline-block bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800"
              >
                View Profile
              </a>

              <a
                href="/home"
                className="inline-block border px-6 py-3 rounded-lg hover:bg-gray-50"
              >
                Go Home
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}