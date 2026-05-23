import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './WeatherPage.module.css';

interface WeatherData {
    location: {
        name: string;
        country: string;
        region: string;
    };
    current: {
        temp_c: number;
        feelslike_c: number;
        humidity: number;
        wind_kph: number;
        condition: {
            code: number;
            text: string;
        };
    };
}

function WeatherPage() {
    const { city } = useParams();
    const navigate = useNavigate();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_KEY = 'f56821ef79b24124985222619262005';

    const getGradientColor = (conditionCode: number) => {
        if (conditionCode === 1000 || conditionCode === 1003) return '#F2D848';
        if (conditionCode === 1006 || conditionCode === 1009) return '#E0E0E0';
        return '#666666';
    };

    const getWeatherType = (conditionCode: number) => {
        if (conditionCode === 1000 || conditionCode === 1003) return 'Солнечно';
        if (conditionCode === 1006 || conditionCode === 1009) return 'Облачно';
        return 'Пасмурно';
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await fetch(
                    `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=,,${city}&lang=ru`
                );
                if (!response.ok) throw new Error('Город не найден');
                const data = await response.json();
                if (data.location.region === "" && data.location.country !== "") {
                    setError('Пожалуйста, введите конкретный город, а не страну');
                    setWeather(null);
                    setLoading(false);
                    return;
                }
                setWeather(data);
                setError('');
            } catch (err) {
                setError('Город не найден. Проверьте название.');
                setWeather(null);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [city]);

    const addToFavorites = async () => {
        if (!weather) return;
        try {
            await axios.post('http://localhost:5000/api/favorites', {
                city_name: weather.location.name,
                country: weather.location.country,
                temp_c: Math.round(weather.current.temp_c)
            });
            alert('Город добавлен в избранное!');
        } catch (err) {
            console.error(err);
            alert('Ошибка при добавлении');
        }
    };

    if (loading) {
        return (
            <div className={styles.weatherPage}>
                <div className={styles.weatherCard}>
                    <p className={styles.errorText}>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.weatherPage}>
                <div className={styles.weatherCard}>
                    <p className={styles.errorText}>{error}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button className={styles.backButton} onClick={() => navigate('/')}>Вернуться</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!weather) return null;

    const gradientColor = getGradientColor(weather.current.condition.code);
    const weatherType = getWeatherType(weather.current.condition.code);
    const windMs = (weather.current.wind_kph / 3.6).toFixed(1);

    return (
        <div className={styles.weatherPage}>
            <div
                className={styles.weatherCard}
                style={{ background: `linear-gradient(180deg, ${gradientColor} 0%, #1EC1FD 100%)` }}
            >
                <h1 className={styles.cityName}>{weather.location.name}</h1>
                <p className={styles.temperature}>{Math.round(weather.current.temp_c)}°C</p>
                <div className={styles.weatherDetails}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>{weatherType}</span>
                    </div>
                    <div className={styles.detailRowWithDots}>
                        <span className={styles.detailLabel}>Влажность</span>
                        <span className={styles.dots}></span>
                        <span className={styles.detailValue}>{weather.current.humidity}%</span>
                    </div>
                    <div className={styles.detailRowWithDots}>
                        <span className={styles.detailLabel}>Ветер</span>
                        <span className={styles.dots}></span>
                        <span className={styles.detailValue}>{windMs} м/с</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Ощущается как: {Math.round(weather.current.feelslike_c)}°C</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    <button className={styles.backButton} onClick={() => navigate('/')}>Вернуться</button>
                    <button className={styles.backButton} onClick={addToFavorites}>В избранное</button>
                </div>
            </div>
        </div>
    );
}

export default WeatherPage;