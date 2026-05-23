import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './HomePage.module.css';

function HomePage() {
    const [city, setCity] = useState('');
    const navigate = useNavigate();

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && city.trim() !== '') {
            navigate(`/weather/${city}`);
        }
    };

    return (
        <div className={styles.homePage}>
            <Link to="/favorites" className={styles.favoritesLink}>Избранное</Link>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Введите город"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
        </div>
    );
}

export default HomePage;