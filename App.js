import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';

export default function App() {

  const key = '';

  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState('');
  const [city, setCity] = useState('')
  const [days, setDays] = useState(1);
  const [s, setS] = useState('');

  function Day(value) {
    setDays(value)
  }

  async function handleGenerate() {
    if (city === '') {
      Alert.alert('Attention', 'City name field invalid')
      return;
    }

    setTravel('');
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Crie um roteiro para uma viagem de exatos ${days} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`;

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data)
        setTravel(data.choices[0].message.content);
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false);
      })
  }

  function S(value) {
    if (value > 1) {
      setS('s');
    }
    else {
      setS('')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>
        MyRoadMap
      </Text>
      <View style={styles.card}>
        <Text style={styles.city}>
          Which city are you going?
        </Text>
        <TextInput style={styles.input} value={city} onChangeText={(text) => { setCity(text) }} placeholder='Ex: Maceió' placeholderTextColor={'#B0B0B0'} />
        <Text style={styles.time}>
          How many days: {days} day{s}
        </Text>
        <View style={styles.sliderView}>
          <Slider style={styles.slider} minimumValue={1} maximumValue={10} minimumTrackTintColor='#000' thumbTintColor='#000' value={days} onValueChange={(value) => { Day(value.toFixed(0)); S(value.toFixed(0)); }} />
        </View>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>
            Let's go
          </Text>
        </TouchableOpacity>
      </View>
      {travel && (
        <View style={styles.contentView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.contentTittle}>
                Here's your RoadMap 👇
              </Text>
              <Text style={styles.contentMain}>
                {travel}
              </Text>
            </View>
          </ScrollView>
        </View>
      )}

      {loading && (
        <View style={styles.loading}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.loadingTittle}>
                Loading
              </Text>
              <ActivityIndicator style={{ paddingBottom: 30 }} color={'#000'} size={'large'} />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: '#E6E6E6',
    alignItems: 'center',
  },
  tittle: {
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,

  },
  city: {
    width: '90%',
    height: 30,
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',

  },
  input: {
    width: '90%',
    height: 50,
    padding: 10,
    backgroundColor: '#EBEBEB',
    borderWidth: 2,
    borderColor: '#DFDFDF',
    borderRadius: 5,
  },
  time: {
    width: '90%',
    marginTop: 20,
    marginBottom: -20,
    fontWeight: 'bold',
  },
  sliderView: {
    width: '90%',
    height: 30,
    marginTop: 30,
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 50,
  },
  buttonView: {
    width: '90%',
    marginTop: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentView: {
    width: '90%',
    height: '50%',
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DFDFDF',
  },
  loading: {
    width: '90%',
    height: 'auto',
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DFDFDF',
  },
  content: {
    alignItems: 'center',
  },
  contentTittle: {
    width: '90%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  loadingTittle: {
    width: '90%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 30,
  },
  contentMain: {
    width: '90%',
    marginTop: 30,
  },
});
