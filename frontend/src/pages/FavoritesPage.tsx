import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './FavoritesPage.module.css';

interface FavoriteCity {
    id: number;
    city_name: string;
    country: string;
    temp_c: number;
    added_at: string;
}

function FavoritesPage() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/favorites');
            setFavorites(response.data);
        } catch (error) {
            console.error('Ошибка загрузки избранного:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (id: number) => {
        try {
            await axios.delete(`http://localhost:5000/api/favorites/${id}`);
            fetchFavorites();
            alert('Город удалён из избранного');
        } catch (error) {
            alert('Ошибка при удалении');
        }
    };

    const goToWeather = (cityName: string) => {
        navigate(`/weather/${cityName}`);
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <div className={styles.favoritesPage}>
                <div className={styles.container}>
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.favoritesPage}>
            <div className={styles.container}>
                <h1>Избранные города</h1>
                {favorites.length === 0 ? (
                    <p>Нет избранных городов. Добавьте города на странице погоды.</p>
                ) : (
                    <ul className={styles.list}>
                        {favorites.map((city) => (
                            <li key={city.id} className={styles.card}>
                                <div>
                                    <strong>{city.city_name}</strong> {city.country && `, ${city.country}`}
                                    <br />
                                    <span>{city.temp_c}°C</span>
                                    <br />
                                    <small>Добавлено: {new Date(city.added_at).toLocaleString()}</small>
                                </div>
                                <div className={styles.cardButtons}>
                                    <button className={styles.viewBtn} onClick={() => goToWeather(city.city_name)}>Погода</button>
                                    <button className={styles.removeBtn} onClick={() => removeFavorite(city.id)}>Удалить</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <button className={styles.backBtn} onClick={() => navigate('/')}>На главную</button>
            </div>
        </div>
    );
}

export default FavoritesPage;