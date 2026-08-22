import { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';
import { submitVerificationAnswers } from '../services/claimService';
import Button from './Button';

export default function VerificationFlow({ claim, questions = [], token, onComplete }) {
  const [answers, setAnswers] = useState(() =>
    questions.map(q => ({
      question: q.question || q,
      answer: '',
    }))
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[index].answer = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEvaluating(true);

    try {
      const claimId = claim?._id || claim?.id || 'demo_claim';
      const evaluation = await submitVerificationAnswers(claimId, answers, token);
      setResult(evaluation);
      if (onComplete) onComplete(evaluation);
    } catch (err) {
      alert('Error submitting verification. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // State: Showing Evaluation Results
  if (result) {
    const isSuccess = result.isVerified || result.status === 'VERIFIED';

    return (
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isSuccess
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}>
            {isSuccess ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              {isSuccess ? '✓ Ownership verified' : 'Verification unsuccessful'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Confidence Score: <span className="font-mono font-bold text-zinc-900 dark:text-white">{result.confidence}%</span>
            </p>
          </div>
        </div>

        {/* Professional Result Notice */}
        <div className={`p-4 rounded-xl text-sm leading-relaxed ${
          isSuccess
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900/50'
            : 'bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
        }`}>
          {isSuccess ? (
            <p>
              The claimant successfully answered the ownership verification questions. You can now proceed with arranging the safe return of the item.
            </p>
          ) : (
            <p>
              The information provided did not sufficiently match the ownership details recorded for this item. Correct answers are kept confidential for security.
            </p>
          )}
        </div>

        {/* Itemized breakdown (Confidence breakdown without revealing true answers) */}
        {result.breakdown && (
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Evaluation Criteria
            </h4>
            <div className="space-y-2">
              {result.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 text-xs"
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 flex-1">
                    {item.question}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-medium shrink-0 ${
                    item.status === 'match'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : item.status === 'partial'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {item.status === 'match' ? '✓ Matches' : item.status === 'partial' ? '⚠ Partially Matches' : 'Inconclusive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // State: AI Processing Evaluation
  if (isEvaluating) {
    return (
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-zinc-900 dark:text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Checking ownership details…
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
            Evaluating submitted answers against secure private item parameters using semantic analysis.
          </p>
        </div>
      </div>
    );
  }

  // State: Asking Questions
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Ownership Verification Questions
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            Please answer the following specific questions about the item. Correct answers are kept strictly hidden.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {answers.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {idx + 1}. {item.question}
            </label>
            <input
              type="text"
              required
              value={item.answer}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              placeholder="Enter specific answer or details..."
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" className="w-full">
          Submit for Verification
        </Button>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center mt-2.5">
          Privacy Protected • Answers are encrypted and compared securely
        </p>
      </div>
    </form>
  );
}
