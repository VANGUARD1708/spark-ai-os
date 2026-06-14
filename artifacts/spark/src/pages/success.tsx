import { useSearch } from "wouter";
import { Link } from "wouter";
import { Crown, CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const search = useSearch();

  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-lime-500/20 bg-zinc-950 p-8 text-center">

        <CheckCircle className="mx-auto h-16 w-16 text-lime-400" />

        <h1 className="text-3xl font-bold mt-4">
          Payment Successful 🎉
        </h1>

        <p className="text-zinc-400 mt-3">
          Welcome to SPARK Pro.
          Your subscription is now active.
        </p>

        {sessionId && (
          <p className="text-xs text-zinc-500 mt-4 break-all">
            Session ID: {sessionId}
          </p>
        )}

        <div className="mt-8">
          <Link href="/">
            <button className="inline-flex items-center gap-2 rounded-lg bg-lime-400 px-6 py-3 font-semibold text-black hover:opacity-90 transition">
              <Crown className="h-4 w-4" />
              Open SPARK
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}