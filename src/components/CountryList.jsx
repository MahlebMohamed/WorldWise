import CountryItem from './CountryItem';
import Spinner from './Spinner';
import Message from './Message';
import styles from './CountryList.module.css';


function CountryList({ cities, isLoading }) {
    if (isLoading)
        return <Spinner />

    if (cities.length <= 0)
        return <Message message='Add your first country by clicking on a country on the map' />

    const countries = cities.reduce((arr, city) => {
        if (!arr.map(city => city.emoji).includes(city.emoji))
            return [...arr, { id: city.id, emoji: city.emoji, country: city.cityName }];
        else
            return arr;
    }, []);

    return (
        <ul className={styles.countryList}>
            {
                countries.map(country => <CountryItem country={country} key={country.id} />)
            }
        </ul>
    )
}

export default CountryList;