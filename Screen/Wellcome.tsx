import { Image,StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Wellcome = ({ navigation }: any) => {
    setTimeout(() => {
        navigation.navigate('home')
    },3000);
    return (
        <View style={styles.container}>
            <Image
                style={{
                    width: 300,
                    height: 300,
                    resizeMode: 'contain',
                }}
                source={require('../IMG/1.png')} />

            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 30 }}>
                    Pham Viet Anh
                </Text>

                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 30 }}>
                    MSV: PH37030
                </Text>
            </View>
        </View>
    )
}

export default Wellcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
})