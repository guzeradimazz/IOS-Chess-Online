import React, { useEffect, useState } from 'react'
import { View, Button, Text, Image, StyleSheet, NativeModules } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import { JoinRoom } from './JoinRoom'
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { useConnectivity } from '../services/useConnectivity'

export const CreateAcc = ({ navigation, isConnected }) => {
    const [user, setUser] = useState({
        userName: 'username',
        photo: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
        signed: false
    })

    GoogleSignin.configure({
        webClientId:
            '73118825821-9ptqvc6gerq29qp1k7vpbm2u4t5suaai.apps.googleusercontent.com'
    })

    const onGoogleSignIn = async () => {
        const { idToken } = await GoogleSignin.signIn()
        const googleCredential = auth.GoogleAuthProvider.credential(idToken)
        const user_sign_in = auth().signInWithCredential(googleCredential)

        user_sign_in.then((res) => {
            try {
                setUser((prev) => {
                    return {
                        ...prev,
                        userName: res.additionalUserInfo.profile.name,
                        photo: res.additionalUserInfo.profile.picture,
                        signed: true
                    }
                })
            } catch (e) {}
        })
    }

    const signOut = () => {
        auth()
            .signOut()
            .then(() =>
                setUser(() => {
                    return {
                        userName: 'username',
                        photo: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
                        signed: false
                    }
                })
            )
    }


    return (
        <View style={{ marginTop: 50 }}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 20,
                    alignItems: 'center'
                }}
            >
                <Text>{user.userName}</Text>
                <Image style={styles.image} source={{ uri: user.photo }} />
            </View>
            <Button title='Google Sign-In' onPress={onGoogleSignIn} disabled={!isConnected}/>
            <Button title='Sign Out' disabled={!isConnected || user.userName === 'username'} onPress={signOut} />
            <JoinRoom  navigation={navigation} isConnected={isConnected}/>
            <Button
                title='Check wi-fi'
                disabled={isConnected}
                onPress={()=>NativeModules.DevSettings.reload()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 100
    }
})
