import { GoogleAuthProvider, deleteUser, signInWithEmailAndPassword, signInWithRedirect, updateProfile, createUserWithEmailAndPassword, applyActionCode, verifyPasswordResetCode, confirmPasswordReset, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../firebase"
import { AppState } from "../AppState"
import { User } from "../models/User.js"
import { router } from '../router'

/**
 * @module AccountService
 * This module handles all user authentication related actions
 */
class AccountServices {

    /**
    * @async
    * @description Register a new user using email and password
    * @param {string} displayName - The user's display name
    * @param {string} email - The user's email
    * @param {string} password - The user's password
    */
    async emailRegister(displayName, email, password) {
        if (password.length < 6) throw new Error('Password must be atleast 6 characters long.');
        if (password.length > 100) throw new Error('Pasword cannot exceed 100 characters long.')
        if (password.toLowerCase() == password) throw new Error('Password must contain at least 1 captilized character.');
        if (email.length < 3 || email.length > 100) throw new Error('Invalid email address.')
        if (!email.includes('@')) throw new Error('Invalid email address.');


        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        user.displayName = displayName
        await this.updateAccount(auth.currentUser, new User(user))
    }


    /**
     * @async
     * @description Authenticate a user using email and password
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     */
    async emailLogin(email, password) {
        const user = await signInWithEmailAndPassword(auth, email, password)
        AppState.user = new User(user.user)
    }

    /**
     * @async
     * @description Authenticates a Firebase client using a full-page redirect flow.
     */
    async googleLogin() {
        const provider = new GoogleAuthProvider();
        const user = signInWithRedirect(auth, provider)
        AppState.user = new User(user.user)
    }

    /**
     * @async
     * @description Sign out the current authenticated user
     */
    async signOut() {
        auth.signOut().then(() => {
            AppState.user = {}
            if (router.currentRoute.value.meta.requiresAuth) {
                router.push('/login')
            }
        }).catch((error) => {
            console.error('Error signing out', error)
        })
    }

    /**
     * @async
     * @description Retrieve the current authenticated user's details
     */
    async getAccount() {
        auth.currentUser.reload()
        const user = auth.currentUser
        const newUser = new User(user)
        AppState.user = newUser
        return newUser
    }

    /**
     * @async
     * @description Update the current authenticated user's details
     * @param {Object} newUser - The new user details
     * @satisfies displayName, photoURL, emailVerified
     */
    async updateAccount(newUser) {
        const user = auth.currentUser
        await updateProfile(user, {
            displayName: newUser.displayName ? newUser.displayName : user.displayName,
            photoURL: newUser.photoURL ? newUser.photoURL : user.photoURL,
            emailVerified: newUser.emailVerified ? newUser.emailVerified : user.emailVerified,
        })
    }

    /**
     * @async
     * @description Delete the current authenticated user's account
     */
    async deleteAccount() {
        const user = auth.currentUser
        await deleteUser(user)
    }

    // SECTION ACCOUNT UTILS

    /**
     * @async
     * @description Send an email verification to the current authenticated user
     */
    async sendEmailVerification() {
        await sendEmailVerification(auth.currentUser)
    }

    /**
     * @async
     * @description Send a password reset email
     * @param {string} email - The email to send the password reset link
     */
    async sendPasswordReset(email) {
        await sendPasswordResetEmail(auth, email)
    }

    /**
     * @async
     * @description Verify a user's email with a given code
     * @param {string} oobCode - The code to verify the user's email
     */
    async verifyEmailVerification(oobCode) {
        await applyActionCode(auth, oobCode)
    }

    /**
     * @async
     * @description Check if the current user's email has been verified
     * @returns {Promise<boolean>} - A promise that resolves to true if the email is verified, false otherwise
     */
    async checkEmailVerification() {
        await auth.currentUser.reload()
        const user = auth.currentUser
        if (user.emailVerified) {
            return true
        } else {
            return false
        }
    }

    /**
     * @async
     * @description Reset a user's password with a given code and new password
     * @param {string} oobCode - The code to verify the user's email
     * @param {string} newPassword - The new password for the user
     */
    async verifyPasswordReset(oobCode, newPassword) {
        try {
            await verifyPasswordResetCode(auth, oobCode)
            await confirmPasswordReset(auth, oobCode, newPassword);
            return true
        }
        catch (error) {
            throw error
        }
    }

    /**
     * @description Returns the unique identifier (uid) of the currently logged-in user.
     * @returns {string} - The uid of the currently logged-in user.
     */
    getCurrentUsersId() {
        const userId = auth.currentUser.uid
        return userId
    }


}

export const accountServices = new AccountServices()
