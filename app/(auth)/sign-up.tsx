/* eslint-disable react/no-unescaped-entities */
import { styles } from '@/assets/images/styles/auth.styles';
import { COLORS } from '@/constants/colors';
import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  
  const signUpRef = useRef<any>(null);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
    };
  }, []);

  // Store signUp instance in ref for verification
  useEffect(() => {
    if (signUp) {
      signUpRef.current = signUp;
    }
  }, [signUp]);

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      resendTimerRef.current = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(resendTimerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
    };
  }, [resendCooldown]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setError('');
    setLoading(true);

    if (!emailAddress.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
      setError('');
      setVerificationAttempts(0);
      setVerificationStatus('idle');
      setResendCooldown(30);
      
      Alert.alert(
        'Check Your Email',
        `We've sent a 6-digit verification code to ${emailAddress}.`,
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      console.error('Sign up error:', JSON.stringify(err, null, 2));
      
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        
        if (clerkError.code === 'form_identifier_exists') {
          setError('Account already exists. Please sign in instead.');
        } else if (clerkError.code === 'form_password_incorrect') {
          setError("Password doesn't meet requirements. Use a stronger password.");
        } else if (clerkError.code === 'form_param_format_invalid') {
          setError('Please enter a valid email address.');
        } else if (clerkError.message) {
          setError(clerkError.message);
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setError('Network error. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || verificationStatus === 'verifying' || verificationStatus === 'success') {
      return;
    }

    if (!code.trim() || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    if (verificationAttempts >= 5) {
      setError('Too many attempts. Please request a new code.');
      return;
    }

    setVerificationStatus('verifying');
    setLoading(true);
    setError('');

    try {
      const currentSignUp = signUpRef.current;
      if (!currentSignUp) {
        throw new Error('Sign up instance not available');
      }

      const signUpAttempt = await currentSignUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      setVerificationAttempts(prev => prev + 1);

      if (signUpAttempt.status === 'complete') {
        setVerificationStatus('success');
        
        Alert.alert(
          'Success!',
          'Your email has been verified. Signing you in...',
          [{ text: 'OK' }]
        );

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (signUpAttempt.createdSessionId) {
          await setActive({ session: signUpAttempt.createdSessionId });
          router.replace('/');
        } else {
          throw new Error('No session created');
        }
      } else {
        setVerificationStatus('error');
        
        if (signUpAttempt.status === 'abandoned') {
          setError('Verification expired. Please start over.');
        } else if (signUpAttempt.status === 'missing_requirements') {
          setError('Missing requirements. Please contact support.');
        } else {
          setError(`Verification ${signUpAttempt.status}. Please try again.`);
        }
      }
    } catch (err: any) {
      console.error('Verification error:', JSON.stringify(err, null, 2));
      
      setVerificationStatus('error');
      setVerificationAttempts(prev => prev + 1);
      
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        
        if (clerkError.code === 'form_code_incorrect') {
          setError('Invalid code. Please check the code and try again.');
        } else if (clerkError.code === 'verification_expired') {
          setError('Code expired. Please request a new one.');
          setPendingVerification(false);
        } else if (clerkError.code === 'verification_failed') {
          setError('Code invalid or already used. Request a new one.');
        } else if (clerkError.code === 'form_param_format_invalid') {
          setError('Invalid code format. Enter 6 digits only.');
        } else if (clerkError.message && clerkError.message.includes('incorrect')) {
          setError('Incorrect verification code. Please try again.');
        } else if (clerkError.message) {
          setError(clerkError.message);
        } else {
          setError('Failed to verify. Please try again.');
        }
      } else if (err.message === 'Sign up instance not available') {
        setError('Session lost. Please sign up again.');
        setPendingVerification(false);
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!isLoaded || loading || resendCooldown > 0) return;

    setError('');
    setLoading(true);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      Alert.alert(
        'Code Resent', 
        'New verification code sent to your email.',
        [{ text: 'OK' }]
      );
      
      setVerificationAttempts(0);
      setCode('');
      setVerificationStatus('idle');
      setResendCooldown(30);
    } catch (err: any) {
      console.error('Resend error:', err);
      
      if (err.errors?.[0]?.code === 'verification_expired') {
        setError('Session expired. Please sign up again.');
        setPendingVerification(false);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetVerification = () => {
    setPendingVerification(false);
    setCode('');
    setError('');
    setVerificationAttempts(0);
    setVerificationStatus('idle');
    setResendCooldown(0);
  };

  const validateCode = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setCode(numericText);
    
    if (error && error.includes('code')) {
      setError('');
    }
    
    if (numericText.length === 6 && verificationStatus !== 'verifying') {
      setTimeout(() => {
        onVerifyPress();
      }, 300);
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAwareScrollView 
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.verificationContainer}>
          <Text style={styles.title}>Verify Your Email</Text>
          
          <Image
            style={styles.illustration}
            source={require('../../assets/images/styles/image2.png')}
          />

          <Text style={{ 
            color: COLORS.text, 
            fontSize: 16, 
            textAlign: 'center',
            marginBottom: 5
          }}>
            Enter the 6-digit code sent to:
          </Text>
          <Text style={{ 
            color: COLORS.primary, 
            fontSize: 16, 
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 20
          }}>
            {emailAddress}
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError('')}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
            style={[
              styles.verificationInput,
              error && styles.errorInput,
              verificationStatus === 'success' && { borderColor: COLORS.success },
              verificationStatus === 'verifying' && { borderColor: COLORS.primary },
            ]}
            value={code}
            placeholder="000000"
            placeholderTextColor="#9A8478"
            onChangeText={validateCode}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            editable={verificationStatus !== 'verifying' && verificationStatus !== 'success'}
            selectTextOnFocus
          />
          
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 20
          }}>
            <Text style={{ 
              color: COLORS.textLight, 
              fontSize: 14 
            }}>
              Attempts: {verificationAttempts}/5
            </Text>
            {resendCooldown > 0 && (
              <Text style={{ 
                color: COLORS.textLight, 
                fontSize: 14 
              }}>
                Resend in: {resendCooldown}s
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.button, 
              (verificationStatus === 'verifying' || verificationStatus === 'success' || code.length !== 6) && { opacity: 0.7 }
            ]} 
            onPress={onVerifyPress}
            disabled={verificationStatus === 'verifying' || verificationStatus === 'success' || code.length !== 6}
          >
            {verificationStatus === 'verifying' ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : verificationStatus === 'success' ? (
              <>
                <Ionicons name="checkmark" size={20} color={COLORS.white} />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Verified!</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>
                {code.length === 6 ? 'Verify Now' : 'Enter 6-digit Code'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              opacity: (loading || resendCooldown > 0 || verificationStatus === 'verifying') ? 0.5 : 1
            }}
            onPress={onResendCode}
            disabled={loading || resendCooldown > 0 || verificationStatus === 'verifying'}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color={resendCooldown > 0 ? COLORS.textLight : COLORS.primary} 
            />
            <Text style={{ 
              color: resendCooldown > 0 ? COLORS.textLight : COLORS.primary, 
              fontSize: 14,
              fontWeight: '600',
              marginLeft: 5
            }}>
              {resendCooldown > 0 
                ? `Resend available in ${resendCooldown}s` 
                : "Didn't receive code? Resend"
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15,
              marginBottom: 20
            }}
            onPress={resetVerification}
            disabled={verificationStatus === 'verifying'}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={{ 
              color: COLORS.primary, 
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 5
            }}>
              Back to sign up
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 10 }}>
            <Text style={{ 
              color: COLORS.textLight, 
              fontSize: 12,
              textAlign: 'center',
              lineHeight: 18
            }}>
              • Check your spam folder if you don't see the email
              {'\n'}• Code expires in 10 minutes
              {'\n'}• Enter the 6-digit code exactly as shown
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.verificationContainer}>
        <Text style={styles.title}>Create Account</Text>
        
        <Image
          style={styles.illustration}
          source={require('../../assets/images/styles/image2.png')}
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
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
          onChangeText={(text) => {
            setEmailAddress(text);
            if (error) setError('');
          }}
          keyboardType="email-address"
          autoCorrect={false}
        />

        <View style={{ 
          position: 'relative', 
          marginBottom: 20,
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%'
        }}>
          <TextInput
            style={[styles.verificationInput, error && styles.errorInput]}
            value={password}
            placeholder="Password (min. 8 characters)"
            placeholderTextColor="#9A8478"
            secureTextEntry={!showPassword}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
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
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={onSignUpPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginTop: 20,
          alignItems: 'center'
        }}>
          <Text style={{ color: COLORS.textLight }}>
            Already have an account?
          </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, { marginLeft: 5 }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}





// /* eslint-disable react/no-unescaped-entities */

//  import { COLORS } from "@/constants/colors";
// import { useSignUp } from "@clerk/clerk-expo";
// import { Ionicons } from "@expo/vector-icons";
// import { Link, useRouter } from "expo-router";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { styles } from "./auth.styles";

// export default function SignUpScreen() {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [pendingVerification, setPendingVerification] = useState(false);
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [verificationAttempts, setVerificationAttempts] = useState(0);
//   const [resendCooldown, setResendCooldown] = useState(0);
//   const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  
//   const signUpRef = useRef<any>(null);
//   const isVerifying = useRef(false);
//   const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     return () => {
//       if (resendTimerRef.current) {
//         clearInterval(resendTimerRef.current);
//       }
//     };
//   }, []);

//   // Store signUp instance in ref for verification
//   useEffect(() => {
//     if (signUp) {
//       signUpRef.current = signUp;
//     }
//   }, [signUp]);

//   // Handle resend cooldown timer
//   useEffect(() => {
//     if (resendCooldown > 0) {
//       resendTimerRef.current = setInterval(() => {
//         setResendCooldown(prev => {
//           if (prev <= 1) {
//             clearInterval(resendTimerRef.current!);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
    
//     return () => {
//       if (resendTimerRef.current) {
//         clearInterval(resendTimerRef.current);
//       }
//     };
//   }, [resendCooldown]);

//   const onSignUpPress = async () => {
//     if (!isLoaded) return;

//     setError("");
//     setLoading(true);

//     if (!emailAddress.trim()) {
//       setError("Please enter your email address");
//       setLoading(false);
//       return;
//     }

//     if (!password) {
//       setError("Please enter a password");
//       setLoading(false);
//       return;
//     }

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters long");
//       setLoading(false);
//       return;
//     }

//     try {
//       await signUp.create({
//         emailAddress: emailAddress.trim(),
//         password,
//       });

//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

//       setPendingVerification(true);
//       setError("");
//       setVerificationAttempts(0);
//       setVerificationStatus("idle");
//       setResendCooldown(30);
      
//       Alert.alert(
//         "Check Your Email",
//         `We've sent a 6-digit verification code to ${emailAddress}.`,
//         [{ text: "OK" }]
//       );
//     } catch (err: any) {
//       console.error("Sign up error:", JSON.stringify(err, null, 2));
      
//       if (err.errors && err.errors.length > 0) {
//         const clerkError = err.errors[0];
        
//         if (clerkError.code === "form_identifier_exists") {
//           setError("Account already exists. Please sign in instead.");
//         } else if (clerkError.code === "form_password_incorrect") {
//           setError("Password doesn't meet requirements. Use a stronger password.");
//         } else if (clerkError.code === "form_param_format_invalid") {
//           setError("Please enter a valid email address.");
//         } else if (clerkError.message) {
//           setError(clerkError.message);
//         } else {
//           setError("Something went wrong. Please try again.");
//         }
//       } else {
//         setError("Network error. Check your connection.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onVerifyPress = async () => {
//     if (!isLoaded || verificationStatus === "verifying" || verificationStatus === "success") {
//       return;
//     }

//     if (!code.trim() || code.length !== 6) {
//       setError("Please enter a valid 6-digit code");
//       return;
//     }

//     if (verificationAttempts >= 5) {
//       setError("Too many attempts. Please request a new code.");
//       return;
//     }

//     setVerificationStatus("verifying");
//     setLoading(true);
//     setError("");

//     try {
//       console.log("Attempting verification with code:", code);
      
//       // Use the stored signUp reference
//       const currentSignUp = signUpRef.current;
//       if (!currentSignUp) {
//         throw new Error("Sign up instance not available");
//       }

//       const signUpAttempt = await currentSignUp.attemptEmailAddressVerification({
//         code: code.trim(),
//       });

//       console.log("Verification response:", signUpAttempt);

//       setVerificationAttempts(prev => prev + 1);

//       if (signUpAttempt.status === "complete") {
//         setVerificationStatus("success");
        
//         // Show success message
//         Alert.alert(
//           "Success!",
//           "Your email has been verified. Signing you in...",
//           [{ text: "OK" }]
//         );

//         // Give a moment for the success state to show
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Set active session
//         if (signUpAttempt.createdSessionId) {
//           await setActive({ session: signUpAttempt.createdSessionId });
//           router.replace("/");
//         } else {
//           throw new Error("No session created");
//         }
//       } else {
//         console.log("Verification status:", signUpAttempt.status);
        
//         setVerificationStatus("error");
        
//         if (signUpAttempt.status === "abandoned") {
//           setError("Verification expired. Please start over.");
//         } else if (signUpAttempt.status === "missing_requirements") {
//           setError("Missing requirements. Please contact support.");
//         } else {
//           setError(`Verification ${signUpAttempt.status}. Please try again.`);
//         }
//       }
//     } catch (err: any) {
//       console.error("Verification error:", JSON.stringify(err, null, 2));
      
//       setVerificationStatus("error");
//       setVerificationAttempts(prev => prev + 1);
      
//       if (err.errors && err.errors.length > 0) {
//         const clerkError = err.errors[0];
        
//         if (clerkError.code === "form_code_incorrect") {
//           setError("Invalid code. Please check the code and try again.");
//         } else if (clerkError.code === "verification_expired") {
//           setError("Code expired. Please request a new one.");
//           setPendingVerification(false);
//         } else if (clerkError.code === "verification_failed") {
//           setError("Code invalid or already used. Request a new one.");
//         } else if (clerkError.code === "form_param_format_invalid") {
//           setError("Invalid code format. Enter 6 digits only.");
//         } else if (clerkError.message && clerkError.message.includes("incorrect")) {
//           setError("Incorrect verification code. Please try again.");
//         } else if (clerkError.message) {
//           setError(clerkError.message);
//         } else {
//           setError("Failed to verify. Please try again.");
//         }
//       } else if (err.message === "Sign up instance not available") {
//         setError("Session lost. Please sign up again.");
//         setPendingVerification(false);
//       } else {
//         setError("Network error. Please check your connection.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onResendCode = async () => {
//     if (!isLoaded || loading || resendCooldown > 0) return;

//     setError("");
//     setLoading(true);

//     try {
//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
//       Alert.alert(
//         "Code Resent", 
//         "New verification code sent to your email.",
//         [{ text: "OK" }]
//       );
      
//       setVerificationAttempts(0);
//       setCode("");
//       setVerificationStatus("idle");
//       setResendCooldown(30);
//     } catch (err: any) {
//       console.error("Resend error:", err);
      
//       if (err.errors?.[0]?.code === "verification_expired") {
//         setError("Session expired. Please sign up again.");
//         setPendingVerification(false);
//       } else {
//         setError("Failed to resend code. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetVerification = () => {
//     setPendingVerification(false);
//     setCode("");
//     setError("");
//     setVerificationAttempts(0);
//     setVerificationStatus("idle");
//     setResendCooldown(0);
//   };

//   const validateCode = (text: string) => {
//     // Only allow numbers
//     const numericText = text.replace(/[^0-9]/g, '');
//     setCode(numericText);
    
//     if (error && error.includes("code")) {
//       setError("");
//     }
    
//     // Auto-submit when 6 digits entered
//     if (numericText.length === 6 && verificationStatus !== "verifying") {
//       setTimeout(() => {
//         onVerifyPress();
//       }, 300);
//     }
//   };

//   if (pendingVerification) {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.verificationContainer}>
//             <Text style={styles.title}>Verify Your Email</Text>
            
//             <Image
//               style={styles.illustration}
//               source={require("../../assets/images/styles/image2.png")}
//             />

//             <Text style={styles.subtitle}>
//               Enter the 6-digit code sent to:
//             </Text>
//             <Text style={styles.emailText}>{emailAddress}</Text>

//             {error ? (
//               <View style={styles.errorBox}>
//                 <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity onPress={() => setError("")}>
//                   <Ionicons name="close" size={20} color={COLORS.textLight} />
//                 </TouchableOpacity>
//               </View>
//             ) : null}

//             <View style={styles.verificationContainer }>
//               <TextInput
//                 style={[
//                   styles.codeInput,
//                   error && styles.errorInput,
//                   verificationStatus === "success" && styles.successInput,
//                   verificationStatus === "verifying" && styles.verifyingInput,
//                 ]}
//                 value={code}
//                 placeholder="000000"
//                 placeholderTextColor="#9A8478"
//                 onChangeText={validateCode}
//                 keyboardType="number-pad"
//                 maxLength={6}
//                 autoFocus
//                 editable={verificationStatus !== "verifying" && verificationStatus !== "success"}
//                 selectTextOnFocus
//               />
              
//               {verificationStatus === "verifying" && (
//                 <ActivityIndicator 
//                   style={styles.loadingIndicator} 
//                   color={COLORS.primary} 
//                   size="small" 
//                 />
//               )}
              
//               {verificationStatus === "success" && (
//                 <Ionicons 
//                   style={styles.successIcon} 
//                   name="checkmark-circle" 
//                   size={24} 
//                   color={COLORS.success} 
//                 />
//               )}
//             </View>

//             <View style={styles.infoContainer}>
//               <Text style={styles.attemptsText}>
//                 Attempts: {verificationAttempts}/5
//               </Text>
//               {resendCooldown > 0 && (
//                 <Text style={styles.cooldownText}>
//                   Resend in: {resendCooldown}s
//                 </Text>
//               )}
//             </View>

//             <TouchableOpacity
//               style={[
//                 styles.button, 
//                 (verificationStatus === "verifying" || verificationStatus === "success" || code.length !== 6) && styles.buttonDisabled
//               ]}
//               onPress={onVerifyPress}
//               disabled={verificationStatus === "verifying" || verificationStatus === "success" || code.length !== 6}
//             >
//               {verificationStatus === "verifying" ? (
//                 <ActivityIndicator color={COLORS.white} size="small" />
//               ) : verificationStatus === "success" ? (
//                 <>
//                   <Ionicons name="checkmark" size={20} color={COLORS.white} />
//                   <Text style={[styles.buttonText, { marginLeft: 8 }]}>Verified!</Text>
//                 </>
//               ) : (
//                 <Text style={styles.buttonText}>
//                   {code.length === 6 ? "Verify Now" : "Enter 6-digit Code"}
//                 </Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.resendButton, 
//                 (loading || resendCooldown > 0 || verificationStatus === "verifying") && styles.buttonDisabled
//               ]}
//               onPress={onResendCode}
//               disabled={loading || resendCooldown > 0 || verificationStatus === "verifying"}
//             >
//               <Ionicons name="refresh" size={16} color={resendCooldown > 0 ? COLORS.textLight : COLORS.primary} />
//               <Text style={[styles.resendText, resendCooldown > 0 && { color: COLORS.textLight }]}>
//                 {resendCooldown > 0 
//                   ? `Resend available in ${resendCooldown}s` 
//                   : "Didn't receive code? Resend"
//                 }
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={resetVerification}
//               disabled={verificationStatus === "verifying"}
//             >
//               <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
//               <Text style={styles.backText}>Back to sign up</Text>
//             </TouchableOpacity>

//             <Text style={styles.hintText}>
//               • Check your spam folder if you don't see the email
//               {"\n"}• Code expires in 10 minutes
//               {"\n"}• Enter the 6-digit code exactly as shown
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View 
//         style={styles.verificationContainer}
         
//         >
//           <Text style={styles.title}>Create Account</Text>
          
//           <Image
//             style={styles.illustration}
//             source={require("../../assets/images/styles/image2.png")}
//           />

//           {error ? (
//             <View style={styles.errorBox}>
//               <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
//               <Text style={styles.errorText}>{error}</Text>
//               <TouchableOpacity onPress={() => setError("")}>
//                 <Ionicons name="close" size={20} color={COLORS.textLight} />
//               </TouchableOpacity>
//             </View>
//           ) : null}

//           <TextInput
//             style={[styles.verificationInput, error && styles.errorInput]}
//             autoCapitalize="none"
//             value={emailAddress}
//             placeholder="Enter email"
//             placeholderTextColor="#9A8478"
//             onChangeText={(text) => {
//               setEmailAddress(text);
//               if (error) setError("");
//             }}
//             keyboardType="email-address"
//             autoCorrect={false}
//           />

//           <View style={styles.passwordContainer}>
//             <TextInput
//               style={[styles.verificationInput, error && styles.errorInput]}
//               value={password}
//               placeholder="Password (min. 8 characters)"
//               placeholderTextColor="#9A8478"
//               secureTextEntry={!showPassword}
//               onChangeText={(text) => {
//                 setPassword(text);
//                 if (error) setError("");
//               }}
//             />
//             <TouchableOpacity
//               style={styles.eyeButton}
//               onPress={() => setShowPassword(!showPassword)}
//             >
//               <Ionicons
//                 name={showPassword ? "eye-off" : "eye"}
//                 size={20}
//                 color="#9A8478"
//               />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={onSignUpPress}
//             disabled={loading}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? "Creating Account..." : "Sign Up"}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.signInContainer}>
//             <Text style={styles.signInText}>Already have an account?</Text>
//             <Link href="/sign-in" asChild>
//               <TouchableOpacity>
//                 <Text style={styles.linkText}>Sign In</Text>
//               </TouchableOpacity>
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }


 