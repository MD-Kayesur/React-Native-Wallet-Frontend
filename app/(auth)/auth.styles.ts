import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/colors";

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    successInput: {
  borderColor: COLORS.success,
  backgroundColor: COLORS.success + '20',
},
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: height,
  },
  
  verificationContainer: {
    

    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  

//  verificationContainer: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     padding: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },


  // Typography
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 6,
    marginTop: 16,
    lineHeight: 22,
  },
  
  emailText: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  
  hintText: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  
  // Image
  illustration: {
    width: width * 0.65,
    height: width * 0.65,
    alignSelf: "center",
    marginBottom: 24,
    resizeMode: 'contain',
  },
  
  // Input Fields
  verificationInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    fontFamily: 'System',
  },
  
  errorInput: {
    borderColor: COLORS.expense,
    borderWidth: 2,
    backgroundColor: COLORS.errorBackground,
  },
  
  // Code Input (for verification)
  codeContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  
  codeInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 16,
    padding: 22,
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    letterSpacing: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    height: 80,
  },
  
  successInput: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '20',
  },
  
  verifyingInput: {
    borderColor: COLORS.primary,
  },
  
  loadingIndicator: {
    position: 'absolute',
    right: 22,
    top: 28,
  },
  
  successIcon: {
    position: 'absolute',
    right: 22,
    top: 28,
  },
  
  // Password Container
  passwordContainer: {
    position: 'relative',
    marginBottom: 18,
  },
  
  eyeButton: {
    position: 'absolute',
    right: 18,
    top: 18,
    padding: 6,
    zIndex: 1,
  },
  
  // Buttons
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
    shadowOpacity: 0,
  },
  
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  
  // Error Box
  errorBox: {
    backgroundColor: COLORS.errorBackground,
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: COLORS.expense,
  },
  
  errorText: {
    color: COLORS.expense,
    fontSize: 14,
    marginLeft: 12,
    marginRight: 12,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  
  // Info Container
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  
  attemptsText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  
  cooldownText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Resend Button
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
  },
  
  resendText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
  
  // Back Button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
  },
  
  backText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
  
  // Sign In/Up Links
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    padding: 8,
  },
  
  signInText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  
  linkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  
  // Terms Text
  termsText: {
    color: COLORS.textLight,
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  
  // Forgot Password
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginBottom: 20,
    padding: 4,
  },
  
  // Separator
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 30,
    marginHorizontal: 20,
  },
  
  // Social Buttons
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  
  socialButtonText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  
  // Or Text
  orText: {
    color: COLORS.textLight,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
  },
  
  // Progress Bar
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  
  // Step Indicator
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  
  stepCircleCompleted: {
    backgroundColor: COLORS.success,
  },
  
  stepNumber: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 14,
  },
  
  stepNumberActive: {
    color: COLORS.white,
  },
  
  stepLabel: {
    color: COLORS.textLight,
    fontSize: 12,
    textAlign: 'center',
  },
  
  stepLabelActive: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  
  // Loading Overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  loadingText: {
    marginTop: 12,
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '500',
  },
});