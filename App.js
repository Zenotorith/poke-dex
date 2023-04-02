import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, StyleSheet, Text, View, FlatList, Image } from 'react-native'
import { useEffect, useState } from 'react'

export default function App() {

  const [pokemon, setPokemon] = useState([])
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const fetchFirstGenPokemons = async () => {
      const firstGenPokemonIdsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const firstGenPokemonIdsBody = await firstGenPokemonIdsResponse.json();

      const firstGenPokemonDetails = await Promise.all(
        firstGenPokemonIdsBody.results.map(async (p) => {
          const pDetails = await fetch(p.url);

          return await pDetails.json();
        })
      )
      setPokemon(prev => [...prev, ...firstGenPokemonDetails]);
    }

    fetchFirstGenPokemons();
  }, [offset]);

  const renderLoader = () => {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' color='#aaa' />
      </View>
    )
  }

  const loadMorePokemon = () => {
    setOffset(offset + 20)
  }

  const pokemonRenderer = ({ item }) => {
    return (
      <View style={styles.pokemonCard}>
        <View style={styles.pokemonImageContainer}>
          <Image style={styles.pokemonImage}
            source={{
              uri: item.sprites.front_default
            }}
          />
        </View>
        <View style={styles.pokemonCardNameContainer}>
          <Text style={styles.pokemonCardName}>
            {item.name}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemon}
        renderItem={pokemonRenderer}
        ListFooterComponent={renderLoader}
        onEndReached={loadMorePokemon}
        onEndReachedThreshold={0}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'

  },
  pokemonCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    height: 100,
    backgroundColor: '#ccc'
  },
  loader: {
    marginVertical: 16,
    alignItems: 'center'
  },
  pokemonImage: {
    width: 80,
    height: 80
  },
  pokemonCardName: {
    textTransform: 'capitalize'
  },
  pokemonImageContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  pokemonCardNameContainer: {
    flex: 1,
    alignItems: 'flex-start'
  }
});
