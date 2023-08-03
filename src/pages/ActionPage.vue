<template>
    <div class="container" v-if="passPageCheck">
        <div class="row mt-5">
            <div class="col-12 text-center mt-5">
                <p class="font-merriweather fs-2">Change Password</p>
                <p v-if="resetDone" class="fs-5 text-success fw-bold">Password was successfully changed<br>This window will close in 5 seconds</p>
                <div class="border border-1 border-black p-3 w-75 m-auto">
                    <form @submit.prevent="resetPassword" class="text-start">
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control border-dark fs-5" id="password"
                                aria-describedby="passwordHelp" minlength="6" maxlength="100" v-model="editable.password">
                        </div>
                        <label for="passwordConfrim" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control border-dark fs-5" id="passwordConfrim"
                            aria-describedby="passwordHelp" minlength="6" maxlength="100"
                            v-model="editable.passwordConfirm">
                        <div class="text-end mt-2">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>

    <div class="container" v-if="emailVerified">
    <div class="row">
        <div class="col-12 text-center">
            <p class="fs-1 fw-bold font-merriweather mt-5">Required<br>Email Verified</p>
            <p class="w-75 mt-4 m-auto">Feel free to close out of this page and click Continue in the other tab.</p>
        </div>
    </div>
    </div>
</template>


<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { accountServices } from '../services/AccountServices';
import { logger } from '../utils/Logger';
import { Pop } from '../utils/Pop';
export default {
    setup() {
        const route = useRoute()
        let mode = null;
        let oobCode = null;

        const passPageCheck = ref(false)
        const emailVerified = ref(null)
        const editable = ref({})
        const resetDone = ref(false)

        const resetPassword = async () => {
            try {
                const password = editable.value.password
                const passwordConfirm = editable.value.passwordConfirm

                if (password != passwordConfirm) throw new Error('Passwords do not match.')
                if (password.length < 6) throw new Error('Password must be atleast 6 characters long.');
                if (password.length > 100) throw new Error('Pasword cannot exceed 100 characters long.')
                if (password.toLowerCase() == password) throw new Error('Password must contain at least 1 captilized character.');

                const resetCheck = await accountServices.verifyPasswordReset(oobCode, password)
                if(resetCheck){
                    resetDone.value = true
                    setTimeout(() => {
                        window.close()
                    }, 5000)
                }

            }
            catch (error) {
                logger.error(error)
                Pop.error(error)
            }
        }

        onMounted(async () => {
            passPageCheck.value = false
            emailVerified.value = false
            mode = route.query.mode
            oobCode = route.query.oobCode
            resetDone.value = false

            switch (mode) {
                case 'verifyEmail':
                    await accountServices.verifyEmailVerification(oobCode)
                    emailVerified.value = true
                    break
                case 'resetPassword':
                    passPageCheck.value = true
                    break
            }

        })
        return {
            passPageCheck,
            emailVerified,
            editable,
            resetPassword,
            resetDone
        }
    }
}
</script>


<style lang="scss" scoped></style>