import { useState } from 'react';
import { useRouter } from 'next/navigation';

const JoinChallenge: React.FC = () => {
  const [challengeCode, setChallengeCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoinChallenge = async () => {
    if (!challengeCode) {
      setError('Please enter a challenge code');
      return;
    }

    try {
      // Call the API to join the challenge
      const response = await fetch('/api/challenge/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to join the challenge');
        return;
      }

      const { challengeId } = await response.json();
      
      // Redirect to the challenge management page
      router.push(`/challenge/join/${challengeId}/`);
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="join-challenge">
      <h2>Join a Challenge</h2>
      <input
        type="text"
        placeholder="Enter Challenge Code"
        value={challengeCode}
        onChange={(e) => setChallengeCode(e.target.value)}
      />
      <button onClick={handleJoinChallenge}>Join Challenge</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default JoinChallenge;
