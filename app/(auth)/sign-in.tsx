/* eslint-disable react/no-unescaped-entities */
import { styles } from '@/assets/images/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import { useSignIn } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View  } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter() 
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
const [error, setError] = useState("");
   const onSignInPress = async () => {
    if (!isLoaded) return 
     try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      }) 
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else { 
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) { 
      console.error(JSON.stringify(err, null, 2))
    }
  } 
  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}
    contentContainerStyle={{flexGrow: 1}} >
    <View style={styles.verificationContainer}>
      <Text style={styles.title}>Login Here </Text> 
      <Image style={styles.illustration} source={require("../../assets/images/styles/image3.png")}/> 
{error ? (
  <View  style={styles.errorBox}>
    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={() => setError("")}>
      <Ionicons name="close" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  </View>
) : null} 
     <TextInput
  style={[styles.verificationInput, error && styles.errorInput]}
  autoCapitalize="none"
  value={emailAddress}
  
  placeholderTextColor="#9A8478"
  placeholder="Enter email"
  onChangeText={(email) => setEmailAddress(email)}
/> 
<TextInput
  style={[styles.verificationInput, error && styles.errorInput]}
  value={password}
  placeholder="Enter password"
  placeholderTextColor="#9A8478"
secureTextEntry={true}
  onChangeText={(password) => setPassword(password)}
/>
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <View  >
        <Link  href="/sign-up">
           <Text>If you don't have an account?</Text>
          <Text style={styles.linkText}> Sign up</Text>
        </Link>
      </View>
    </View>
    </KeyboardAwareScrollView>
  )
}