
/**
 * The User class represents a user profile.
 */
export class User {
    /**
     * Create a new User object.
     * 
     * @param {Object} data - The data to create the user with.
     * @param {string} data.uid - The user's unique identifier.
     * @param {string} data.displayName - The name displayed in the user's profile.
     * @param {string} data.email - The user's email address.
     * @param {string} data.photoURL - The URL of the user's profile picture.
     * @param {boolean} data.emailVerified - Whether or not the user's email is verified.
     * 
     * @example
     * const user = new User({
     *     uid: 'abc123',
     *     displayName: 'John Doe',
     *     email: 'john.doe@example.com',
     *     photoURL: 'https://example.com/john_doe.jpg',
     *     emailVerified: true,
     * });
     * 
     * @WARNING Please note that uid is unique to the Firebase project. Do NOT use
     * this value to authenticate with your backend server, if
     * you have one. Use User.getToken() instead.
     */
    constructor(data) {
        const uid = data.uid
        this.displayName = data.displayName
        this.email = data.email
        this.photoURL = data.PhotoURL
        this.emailVerified = data.emailVerified
    }
}