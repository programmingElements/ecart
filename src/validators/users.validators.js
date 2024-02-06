import z from "zod";


const signUpValidation = z.object({
    username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(3, {message: "username contains atleast 3 characters."})
    .max(100, {message: "username does not exceed 100 characters."}),
    email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({message: "Invalid email address."})
    .min(8, {message: "email contains atleast 8 characters."})
    .max(100, {message: "email does not exceed 100 characters."}),
    password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(8, {message: "password contains atleast 8 characters."})
    .max(100, {message: "password does not exceed 100 characters."})
});

const signInValidation = z.object({
    email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({message: "Invalid email address."})
    .min(8, {message: "email contains atleast 8 characters."})
    .max(100, {message: "email does not exceed 100 characters."}),
    password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(8, {message: "password contains atleast 8 characters."})
    .max(100, {message: "password does not exceed 100 characters."})
})

const refreshTokenValidation = z.object({
    refresh_token: z
    .string({ required_error: "token is required" })
    .trim()
    .min(8, { message: "token contains atleast 8 characters." })
})


export { signUpValidation, signInValidation, refreshTokenValidation };