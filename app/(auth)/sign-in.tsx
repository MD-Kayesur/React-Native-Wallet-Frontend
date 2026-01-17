/* eslint-disable react/no-unescaped-entities */
import { styles } from '@/assets/images/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import { useSignIn } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  Alert 
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter() 
  
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return 
    
    // Clear previous errors
    setError("")
    
    // Basic validation
    if (!emailAddress.trim()) {
      setError("Please enter your email address")
      return
    }
    
    if (!password) {
      setError("Please enter your password")
      return
    }
    
    setLoading(true)
    
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      }) 
      
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // Check if there are additional steps required
        if (signInAttempt.status === 'needs_identifier') {
          setError("Please check your email and try again")
        } else if (signInAttempt.status === 'needs_factor_one') {
          setError("Additional verification required")
        } else {
          setError("Sign in incomplete. Please try again.")
        }
        console.error('Sign in incomplete:', JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error('Sign in error:', JSON.stringify(err, null, 2))
      
      // Handle specific Clerk errors
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0]
        
        if (clerkError.code === 'form_identifier_not_found') {
          setError("No account found with this email. Please sign up first.")
        } else if (clerkError.code === 'form_password_incorrect') {
          setError("Incorrect password. Please try again.")
        } else if (clerkError.code === 'form_param_format_invalid') {
          setError("Please enter a valid email address.")
        } else if (clerkError.message) {
          setError(clerkError.message)
        } else {
          setError("Failed to sign in. Please try again.")
        }
      } else {
        setError("Network error. Please check your connection.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Optional: Forgot password function
  const onForgotPassword = async () => {
    if (!emailAddress.trim()) {
      Alert.alert(
        "Enter Email",
        "Please enter your email address first to reset your password.",
        [{ text: "OK" }]
      )
      return
    }
    
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress.trim(),
      })
      
      Alert.alert(
        "Check Your Email",
        "We've sent password reset instructions to your email.",
        [{ text: "OK" }]
      )
    } catch (err: any) {
      console.error('Forgot password error:', err)
      
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        Alert.alert(
          "Email Not Found",
          "No account exists with this email. Please sign up instead.",
          [{ text: "OK" }]
        )
      } else {
        Alert.alert(
          "Error",
          "Failed to send reset email. Please try again.",
          [{ text: "OK" }]
        )
      }
    }
  }

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View 
      
      style={styles.verificationContainer}
      
      
      >
        <Text style={styles.title}>Login Here</Text> 
        
        <Image 
          style={styles.illustration} 
          source={require("../../assets/images/styles/image3.png")}
        /> 
        
        {error ? (
          <View style={styles.errorBox}>
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
          onChangeText={(email) => {
            setEmailAddress(email)
            if (error) setError("") // Clear error when user starts typing
          }}
          keyboardType="email-address"
          autoCorrect={false}
        /> 
        
        <View style={{ position: 'relative', marginBottom: 20  , flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
          <TextInput
            style={[styles.verificationInput, error && styles.errorInput]}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#9A8478"
            secureTextEntry={!showPassword}
            onChangeText={(password) => {
              setPassword(password)
              if (error) setError("") // Clear error when user starts typing
            }}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 15,
              top: 15,
              padding: 5,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#9A8478"
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={onForgotPassword}
          style={{ alignSelf: 'flex-end', marginBottom: 20 }}
        >
          <Text style={{ color: COLORS.primary, fontSize: 14 }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={onSignInPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginTop: 20,
          alignItems: 'center'
        }}>
          <Text style={{ color: COLORS.textLight }}>
            Don't have an account?
          </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, { marginLeft: 5 }]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}





 