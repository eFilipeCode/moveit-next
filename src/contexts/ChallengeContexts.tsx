import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
};

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    activeChallenge: Challenge;
    resetChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
};

interface ChallengesProviderProps {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    children: ReactNode;
  };

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ 
    children, 
    ...rest
}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrenceExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio! 🎉', {
                body: `Valendo ${challenge.amount}xp!`
            })
        };
    };

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    };

    function resetChallenge() {
        setActiveChallenge(null);
    };

    function completeChallenge() {
        if (!activeChallenge)
            return;
        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;
        
        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrenceExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    };
    
    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    return (
        <ChallengesContext.Provider value={{
            level,
            currentExperience,
            challengesCompleted,
            levelUp,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            experienceToNextLevel,
            completeChallenge,
            closeLevelUpModal
        }}>
            {children}
            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
};