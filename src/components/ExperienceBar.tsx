import styles from '../styles/components/ExperienceBar.module.css';
import { ChallengesContext } from '../contexts/ChallengeContexts';
import { useContext } from 'react';

function ExperienceBar() {
    const { currentExperience, experienceToNextLevel } = useContext(ChallengesContext);

    const percentToNextLevel = Math.round(currentExperience * 100) / experienceToNextLevel;

    return (
        <header className={styles.experienceBar}>
            <span>0 xp</span>
            <div >
                <div style={{ width: `${percentToNextLevel}%` }}>
                    <span style={{ left: `${percentToNextLevel}%` }} className={`${styles.currentExperience}`}>{currentExperience} XP</span>
                </div>
            </div>
            <span>{experienceToNextLevel} xp</span>
        </header>
    )
};

export default ExperienceBar;